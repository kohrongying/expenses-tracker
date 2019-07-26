const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getMonthName = () => {
  return monthNames[(new Date().getMonth())];
};

export const getMonth = () => {
  return new Date().getMonth();
};

export const formatNumber = (num) => {
  let result = num !== null ? parseFloat(num).toFixed(2) : 0;
  return result;
};

export const getMonthYear = () => {
  return `${monthNames[(new Date().getMonth())]} ${new Date().getFullYear()}`;
};

export const getTotalFromItems = (items) => {
  let total = 0;
  for (let item in items) {
    total += items[item].amount;
  }
  return total;
};