const sssTable = require('../system_data/sssContribution');

const computeSSS = (salary) => {
  const bracket = sssTable.find(b => salary >= b.min && salary <= b.max);
  return bracket ? bracket.employee : 1750; // max cap
};

const computePhilHealth = (salary) => {
  const total = salary * 0.055;
  return total / 2; // employee share
};


const computeHDMF = () => 200;

//  WITHHOLDING TAX
const computeTax = (salary) => {
  if (salary <= 20833) return 0;

  if (salary <= 33332)
    return (salary - 20833) * 0.15;

  if (salary <= 66666)
    return 1875 + (salary - 33333) * 0.20;

  if (salary <= 166666)
    return 8541.8 + (salary - 66667) * 0.25;

  if (salary <= 666666)
    return 33541.8 + (salary - 166667) * 0.30;

  return 183541.8 + (salary - 666667) * 0.35;
};

module.exports = {
  computeSSS,
  computePhilHealth,
  computeHDMF,
  computeTax
};