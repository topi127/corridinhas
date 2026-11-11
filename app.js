(function () {
  "use strict";

  const { tracks, races } = window.LEAGUE;

  // Any driver id used in a race but missing from `drivers` is added automatically,
  // named from its id (e.g. "samuel" -> "Samuel"), so they still show on the leaderboard.
  const drivers = [...window.LEAGUE.drivers];
  for (const race of races) {
    const ids = [...race.participants, ...race.laps.map((l) => l.driverId)];
    for (const id of ids) {
      if (!drivers.some((d) => d.id === id)) {
        drivers.push({ id, name: id.charAt(0).toUpperCase() + id.slice(1) });
      }
    }
  }

  // ---------- Data helpers ----------

  const byId = (list, id) => list.find((x) => x.id === id);
  const getTrack = (id) => byId(tracks, id);
  const getDriver = (id) => byId(drivers, id);
  const getRace = (id) => byId(races, id);

  const lapsFor = (race, driverId) =>
    race.laps.filter((l) => l.driverId === driverId).sort((a, b) => a.lap - b.lap);

  const fastest = (laps) =>
    laps.reduce((best, l) => (!best || l.timeMs < best.timeMs ? l : best), null);

  // All sessions a driver took part in, newest first.
  function driverRaces(driverId) {
    return races
      .filter((r) => r.participants.includes(driverId))
      .map((race) => {
        const laps = lapsFor(race, driverId);
        return { race, track: getTrack(race.trackId), laps, best: fastest(laps) };
      })
      .sort((a, b) => b.race.date.localeCompare(a.race.date) || b.race.raceNumber - a.race.raceNumber);
  }

  function driverStats(driverId) {
    const driver = getDriver(driverId);
    if (!driver) return null;
    const results = driverRaces(driverId);

    let best = null;
    for (const r of results) {
      if (r.best && (!best || r.best.timeMs < best.timeMs)) best = { ...r.best, race: r.race, track: r.track };
    }

    const visits = new Map();
    for (const r of results) visits.set(r.race.trackId, (visits.get(r.race.trackId) || 0) + 1);

    return {
      driver,
      results,
      best,
      totalRaces: results.length,
      totalLaps: results.reduce((n, r) => n + r.laps.length, 0),
      tracksVisited: tracks.filter((t) => visits.has(t.id)).map((t) => ({ track: t, count: visits.get(t.id) })),
    };
  }

  // Every driver ranked by absolute fastest lap; drivers without laps go last.
  function leaderboard() {
    return drivers
      .map((d) => driverStats(d.id))
      .sort((a, b) => {
        if (!a.best) return b.best ? 1 : a.driver.name.localeCompare(b.driver.name);
        if (!b.best) return -1;
        return a.best.timeMs - b.best.timeMs;
      });
  }

  // ---------- Formatting ----------

  function formatLap(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const x = ms % 1000;
    return `${m}:${String(s).padStart(2, "0")}.${String(x).padStart(3, "0")}`;
  }

  const formatGap = (ms) => `+${(ms / 1000).toFixed(3)}`;

  const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const dateParts = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m, d };
  };
  const dayOf = (iso) => String(dateParts(iso).d);
  const monthOf = (iso) => MONTHS[dateParts(iso).m - 1];
  const formatDate = (iso) => {
    const { y, m, d } = dateParts(iso);
    return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
  };

  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const initial = (name) => esc(name.trim().charAt(0).toUpperCase());
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const chevron =
    '<svg class="chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>';

  const driverHref = (driverId) => `#/driver/${encodeURIComponent(driverId)}`;
  const raceHref = (driverId, raceId) => `${driverHref(driverId)}/race/${encodeURIComponent(raceId)}`;

  // ---------- Views ----------

  function viewHome() {
    const board = leaderboard();
    const leader = board[0] && board[0].best ? board[0] : null;

    const hero = leader
      ? `
      <a class="card hero" href="${raceHref(leader.driver.id, leader.best.race.id)}">
        <div class="checker"></div>
        <div class="hero-body">
          <p class="hero-kicker">Fastest lap ever</p>
          <p class="hero-time time">${formatLap(leader.best.timeMs)}</p>
          <p class="hero-who">${esc(leader.driver.name)}</p>
          <p class="hero-meta">${esc(leader.best.track ? leader.best.track.name : "Unknown track")} · Race #${esc(leader.best.race.raceNumber)} · Lap ${esc(leader.best.lap)}</p>
        </div>
      </a>`
      : `<div class="card empty">No laps recorded yet.</div>`;

    const rows = board
      .map((s, i) => {
        const rank = i + 1;
        const gapMs = leader && s.best ? s.best.timeMs - leader.best.timeMs : 0;
        const gap =
          leader && s.best && i > 0
            ? `<span class="gap"><span class="tip time" tabindex="0" data-tip="Gap to the leader">${formatGap(gapMs)}</span></span>`
            : "";
        const end = s.best
          ? `<span class="time">${formatLap(s.best.timeMs)}</span>${gap}`
          : `<span class="pill">No laps</span>`;
        return `
        <li>
          <a class="row${rank === 1 && s.best ? " leader" : ""}" href="${driverHref(s.driver.id)}">
            <span class="rank${rank <= 3 && s.best ? ` p${rank}` : ""}">${rank}</span>
            <div class="row-main">
              <p class="row-title">${esc(s.driver.name)}</p>
              <p class="row-sub">${plural(s.totalRaces, "race", "races")} · ${plural(s.totalLaps, "lap", "laps")}</p>
            </div>
            <div class="row-end">${end}</div>
            ${chevron}
          </a>
        </li>`;
      })
      .join("");

    return {
      title: "Leaderboard",
      html: `
        ${hero}
        <section class="section">
          <h2 class="label">Leaderboard · Best lap</h2>
          <ol class="list">${rows}</ol>
        </section>`,
    };
  }

  function viewDriver(driverId) {
    const s = driverStats(driverId);
    if (!s) return viewNotFound("Driver not found.");

    const trackItems = s.tracksVisited.length
      ? s.tracksVisited
          .map((t) => `<li><span>${esc(t.track.name)}</span><span class="pill">${plural(t.count, "race", "races")}</span></li>`)
          .join("")
      : `<li><span class="stat-note">None yet</span></li>`;

    const raceRows = s.results.length
      ? s.results
          .map((r) => {
            const isPb = s.best && r.best && r.race.id === s.best.race.id;
            return `
          <li>
            <a class="row" href="${raceHref(driverId, r.race.id)}">
              <span class="date-block"><b>${dayOf(r.race.date)}</b><small>${esc(monthOf(r.race.date))}</small></span>
              <div class="row-main">
                <p class="row-title">${esc(r.track ? r.track.name : "Unknown track")}</p>
                <p class="row-sub">Race #${esc(r.race.raceNumber)} · ${formatDate(r.race.date)} · ${plural(r.laps.length, "lap", "laps")}</p>
              </div>
              <div class="row-end">
                ${r.best ? `<span class="time">${formatLap(r.best.timeMs)}</span>` : `<span class="pill">—</span>`}
                ${isPb ? `<span class="gap"><span class="tip pill gold" tabindex="0" data-tip="Personal Best: ${esc(s.driver.name)} set their fastest lap ever in this race.">PB</span></span>` : ""}
              </div>
              ${chevron}
            </a>
          </li>`;
          })
          .join("")
      : `<li class="card empty">No races yet.</li>`;

    return {
      title: "Driver",
      back: { href: "#/", label: "Leaderboard" },
      html: `
        <div class="profile-head">
          <span class="avatar" aria-hidden="true">${initial(s.driver.name)}</span>
          <div>
            <h1 class="profile-name">${esc(s.driver.name)}</h1>
            <div class="profile-sub">
              ${s.best ? `<span class="tip tip-start pill neon" tabindex="0" data-tip="Personal Best: ${esc(s.driver.name)}'s fastest lap across all races.">PB ${formatLap(s.best.timeMs)}</span>` : ""}
            </div>
          </div>
        </div>

        <div class="stats">
          <div class="card stat wide">
            <p class="stat-label">Personal best</p>
            <p class="stat-value time">${s.best ? formatLap(s.best.timeMs) : "—"}</p>
            ${s.best ? `<p class="stat-note">${esc(s.best.track ? s.best.track.name : "")} · Race #${esc(s.best.race.raceNumber)} · Lap ${esc(s.best.lap)}</p>` : ""}
          </div>
          <div class="card stat">
            <p class="stat-label">Total races</p>
            <p class="stat-value">${s.totalRaces}</p>
          </div>
          <div class="card stat">
            <p class="stat-label">Total laps</p>
            <p class="stat-value">${s.totalLaps}</p>
          </div>
          <div class="card stat wide">
            <p class="stat-label">Tracks visited · ${s.tracksVisited.length}</p>
            <ul class="track-list">${trackItems}</ul>
          </div>
        </div>

        <section class="section">
          <h2 class="label">Race sessions</h2>
          <ol class="list">${raceRows}</ol>
        </section>`,
    };
  }

  function viewRace(driverId, raceId) {
    const race = getRace(raceId);
    const driver = getDriver(driverId);
    if (!race || !driver) return viewNotFound("Race not found.");

    const track = getTrack(race.trackId);
    const laps = lapsFor(race, driverId);
    const best = fastest(laps);

    // Laps well above the median are probably incidents or pit stops — flag them.
    const sorted = laps.map((l) => l.timeMs).sort((a, b) => a - b);
    const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
    const total = laps.reduce((n, l) => n + l.timeMs, 0);
    const avg = laps.length ? Math.round(total / laps.length) : 0;

    const tabs =
      race.participants.length > 1
        ? `<nav class="tabs section" aria-label="Participants">${race.participants
            .map((pid) => {
              const p = getDriver(pid);
              return `<a class="tab" href="${raceHref(pid, race.id)}"${pid === driverId ? ' aria-current="page"' : ""}>${esc(p ? p.name : pid)}</a>`;
            })
            .join("")}</nav>`
        : "";

    const lapRows = laps
      .map((l) => {
        const isBest = best && l.lap === best.lap;
        const isSlow = median && l.timeMs > median * 1.3;
        const pct = Math.max(8, Math.round((best.timeMs / l.timeMs) * 100));
        return `
        <li class="lap-row${isBest ? " best" : ""}${isSlow ? " slow" : ""}">
          <span class="lap-no">${esc(l.lap)}</span>
          <span class="lap-bar" aria-hidden="true"><i style="width:${pct}%"></i></span>
          <span class="lap-time">
            <span class="time">${formatLap(l.timeMs)}</span>
            <span class="gap">${isBest ? "Fastest" : formatGap(l.timeMs - best.timeMs)}</span>
          </span>
        </li>`;
      })
      .join("");

    return {
      title: `Race #${race.raceNumber}`,
      back: { href: driverHref(driverId), label: driver.name },
      html: `
        <div class="card race-head">
          <p class="race-num">Race #${esc(race.raceNumber)}</p>
          <h1 class="race-track">${esc(track ? track.name : "Unknown track")}</h1>
          <dl class="race-facts">
            <div><dt>Date</dt><dd>${formatDate(race.date)}</dd></div>
            <div><dt>Drivers</dt><dd>${race.participants.length}</dd></div>
            <div><dt>Total laps</dt><dd>${race.laps.length}</dd></div>
          </dl>
        </div>

        ${tabs}

        <section class="section">
          <h2 class="label">${esc(driver.name)} · Session</h2>
          <div class="summary">
            <div class="card stat"><p class="stat-label">Best</p><p class="stat-value time">${best ? formatLap(best.timeMs) : "—"}</p></div>
            <div class="card stat"><p class="stat-label">Average</p><p class="stat-value time" style="color:var(--text)">${avg ? formatLap(avg) : "—"}</p></div>
            <div class="card stat"><p class="stat-label">Laps</p><p class="stat-value">${laps.length}</p></div>
          </div>
        </section>

        <section class="section">
          <h2 class="label">Lap by lap</h2>
          ${
            laps.length
              ? `<ol class="card laps list" style="gap:0">
                  <li class="lap-row lap-head"><span>Lap</span><span>Pace</span><span>Time</span></li>
                  ${lapRows}
                </ol>
                <p class="footnote">Fastest lap in gold. Laps 30%+ slower than the median are shown in red.</p>`
              : `<div class="card empty">No laps recorded for ${esc(driver.name)} in this race.</div>`
          }
        </section>`,
    };
  }

  function viewNotFound(message) {
    return {
      title: "",
      back: { href: "#/", label: "Leaderboard" },
      html: `<div class="card empty">${esc(message)}</div>`,
    };
  }

  // ---------- Router ----------

  const app = document.getElementById("app");
  const back = document.getElementById("back");
  const backLabel = document.getElementById("back-label");
  const topbar = document.querySelector(".topbar");
  const topTitle = document.getElementById("topbar-title");

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    let view;
    if (parts.length === 0) view = viewHome();
    else if (parts[0] === "driver" && parts.length === 2) view = viewDriver(parts[1]);
    else if (parts[0] === "driver" && parts[2] === "race" && parts.length === 4) view = viewRace(parts[1], parts[3]);
    else view = viewNotFound("Page not found.");

    app.innerHTML = view.html;
    topTitle.textContent = view.title || "";

    topbar.classList.toggle("has-back", Boolean(view.back));
    if (view.back) {
      back.href = view.back.href;
      backLabel.textContent = view.back.label;
    }

    document.title = view.title ? `${view.title} · Corridinhas` : "Corridinhas";
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
