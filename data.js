// League data. Loaded as a plain script so index.html works straight from disk (no server needed).
// timeMs is the source of truth for sorting and display; "time" is kept as recorded.
window.LEAGUE = {
  tracks: [
    { id: "matosinhos", name: "Kart Center de Matosinhos" },
    { id: "cabo-do-mundo", name: "Kartódromo Cabo do Mundo" }
  ],
  drivers: [
    { id: "antony", name: "Antony" },
    { id: "samuel", name: "Samuel" },
    { id: "ricardo", name: "Ricardo" },
    { id: "rodrigo", name: "Rodrigo" }
  ],
  races: [
    {
      id: "race-13-matosinhos",
      trackId: "matosinhos",
      raceNumber: 13,
      date: "2026-07-10",
      participants: ["antony","samuel","ricardo","rodrigo"],
      laps: [
        { driverId: "antony", lap: 1, time: "0:40.939", timeMs: 40939 },
        { driverId: "antony", lap: 2, time: "0:30.850", timeMs: 30850 },
        { driverId: "antony", lap: 3, time: "0:39.502", timeMs: 39502 },
        { driverId: "antony", lap: 4, time: "0:38.620", timeMs: 38620 },
        { driverId: "antony", lap: 5, time: "0:39.420", timeMs: 39420 },
        { driverId: "antony", lap: 6, time: "1:31.672", timeMs: 91672 },
        { driverId: "antony", lap: 7, time: "0:41.238", timeMs: 41238 },
        { driverId: "antony", lap: 8, time: "0:39.888", timeMs: 39888 },
        { driverId: "antony", lap: 9, time: "0:41.992", timeMs: 41992 },
        { driverId: "antony", lap: 10, time: "0:41.068", timeMs: 41068 },
        { driverId: "antony", lap: 11, time: "0:41.068", timeMs: 41068 },
        { driverId: "antony", lap: 12, time: "0:38.883", timeMs: 38883 },
        { driverId: "antony", lap: 13, time: "0:40.116", timeMs: 40116 },
        { driverId: "samuel", lap: 1, time: "0:45.744", timeMs: 45744 },
        { driverId: "samuel", lap: 2, time: "0:46.619", timeMs: 46619 },
        { driverId: "samuel", lap: 3, time: "0:43.219", timeMs: 43219 },
        { driverId: "samuel", lap: 4, time: "0:42.053", timeMs: 42053 },
        { driverId: "samuel", lap: 5, time: "1:52.229", timeMs: 112229 },
        { driverId: "samuel", lap: 6, time: "0:41.628", timeMs: 41628 },
        { driverId: "samuel", lap: 7, time: "0:41.903", timeMs: 41903 },
        { driverId: "samuel", lap: 8, time: "0:42.941", timeMs: 42941 },
        { driverId: "samuel", lap: 9, time: "0:41.697", timeMs: 41697 },
        { driverId: "samuel", lap: 10, time: "0:41.103", timeMs: 41103 },
        { driverId: "samuel", lap: 11, time: "0:39.789", timeMs: 39789 },
        { driverId: "ricardo", lap: 1, time: "0:45.495", timeMs: 45495 },
        { driverId: "ricardo", lap: 2, time: "0:43.443", timeMs: 43443 },
        { driverId: "ricardo", lap: 3, time: "0:42.874", timeMs: 42874 },
        { driverId: "ricardo", lap: 4, time: "0:44.856", timeMs: 44856 },
        { driverId: "ricardo", lap: 5, time: "0:47.855", timeMs: 47855 },
        { driverId: "ricardo", lap: 6, time: "1:01.390", timeMs: 65765 },
        { driverId: "ricardo", lap: 7, time: "0:42.903", timeMs: 42903 },
        { driverId: "ricardo", lap: 8, time: "0:42.199", timeMs: 42199 },
        { driverId: "ricardo", lap: 9, time: "0:41.595", timeMs: 41595 },
        { driverId: "ricardo", lap: 10, time: "0:41.802", timeMs: 41802 },
        { driverId: "ricardo", lap: 11, time: "0:42.816", timeMs: 42816 },
        { driverId: "ricardo", lap: 12, time: "0:41.107", timeMs: 41107 },
        { driverId: "ricardo", lap: 13, time: "0:41.115", timeMs: 41015 },

        { driverId: "rodrigo", lap: 1, time: "0:54.511", timeMs: 54511 },
        { driverId: "rodrigo", lap: 2, time: "0:52.118", timeMs: 52118 },
        { driverId: "rodrigo", lap: 3, time: "0:50.143", timeMs: 50143 },
        { driverId: "rodrigo", lap: 4, time: "0:47.700", timeMs: 47700 },
        { driverId: "rodrigo", lap: 5, time: "1:05.765", timeMs: 65765 },
        { driverId: "rodrigo", lap: 6, time: "0:47.271", timeMs: 47271 },
        { driverId: "rodrigo", lap: 7, time: "0:43.961", timeMs: 43961 },
        { driverId: "rodrigo", lap: 8, time: "0:43.037", timeMs: 43037 },
        { driverId: "rodrigo", lap: 9, time: "0:41.431", timeMs: 41431 },
        { driverId: "rodrigo", lap: 10, time: "0:42.047", timeMs: 42047 },
        { driverId: "rodrigo", lap: 11, time: "0:41.904", timeMs: 41904 }

      ]
    }
  ]
};
