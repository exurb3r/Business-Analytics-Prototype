const dailyWage = (monthlySalary, numberOfWorkDays) => {
  const ref = (365 - ((7 - numberOfWorkDays) * 52)) / 12;
  const wage = monthlySalary / ref;
  return wage;
};

const dailyGrossWage = (
  dailyWage,
  late,
  overtime,
  undertime,
  nightdifference,
  absent,
  specification,
  multiplierOverride  // ← new param
) => {

  // Use override if provided, otherwise fall back to string-based lookup
  let multiplier = multiplierOverride !== undefined ? multiplierOverride : 1;

  if (multiplierOverride === undefined) {
    const spec = specification.toLowerCase();
    if (spec === 'regular holiday')           multiplier = 2;
    else if (spec === 'special holiday')      multiplier = 1.3;
    else if (spec === 'rest day')             multiplier = 1.3;
    else if (spec === 'special working holiday') multiplier = 1;
  }

  // ... rest of the function unchanged

  let grossWage = dailyWage * multiplier;

  late = late || 0;
  overtime = overtime || 0;
  undertime = undertime || 0;
  nightdifference = nightdifference || 0;
  absent = absent || 0;

  const hourlyRate = dailyWage / 8;
  const perMinuteRate = hourlyRate / 60;

  const lateDeduction = late * perMinuteRate;
  const undertimeDeduction = undertime * perMinuteRate;
  const absentDeduction = absent * dailyWage;

  const overtimePay = overtime * perMinuteRate * 1.25;
  const nightDiffPay = nightdifference * perMinuteRate * 0.10;

  const finalWage =
    grossWage
    - lateDeduction
    - undertimeDeduction
    - absentDeduction
    + overtimePay
    + nightDiffPay;

  return finalWage;
};

module.exports = { dailyWage, dailyGrossWage }; 