// holiday list
const holidays = {
  "2026-01-01": { name: "New Year's Day", type: "regular", multiplier: 2 },
  "2026-04-02": { name: "Maundy Thursday", type: "regular", multiplier: 2 },
  "2026-04-03": { name: "Good Friday", type: "regular", multiplier: 2 },
  "2026-04-09": { name: "Day of Valor (Araw ng Kagitingan)", type: "regular", multiplier: 2 },
  "2026-05-01": { name: "Labor Day", type: "regular", multiplier: 2 },
  "2026-06-12": { name: "Independence Day", type: "regular", multiplier: 2 },
  "2026-08-21": { name: "Ninoy Aquino Day", type: "special_non_working", multiplier: 1.3 },
  "2026-08-31": { name: "National Heroes Day", type: "regular", multiplier: 2 },
  "2026-11-01": { name: "All Saints' Day", type: "special_non_working", multiplier: 1.3 },
  "2026-11-02": { name: "All Souls' Day", type: "special_day", multiplier: 1 },
  "2026-11-30": { name: "Bonifacio Day", type: "regular", multiplier: 2 },
  "2026-12-24": { name: "Christmas Eve", type: "special_day", multiplier: 1 },
  "2026-12-25": { name: "Christmas Day", type: "regular", multiplier: 2 },
  "2026-12-30": { name: "Rizal Day", type: "regular", multiplier: 2 },
  "2026-12-31": { name: "Last Day of the Year", type: "special_non_working", multiplier: 1.3 },

  "2026-02-17": { name: "Chinese New Year", type: "special_non_working", multiplier: 1.3 },
  "2026-04-04": { name: "Black Saturday", type: "special_non_working", multiplier: 1.3 },

  "2027-01-01": { name: "New Year's Day", type: "regular", multiplier: 2 },
  "2027-01-02": { name: "Day After New Year's Day", type: "special_day", multiplier: 1 }
};

module.exports = holidays;