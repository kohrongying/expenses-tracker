const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getMonth = () => {
  return monthNames[(new Date().getMonth())];
}

export const formatNumber = (num) => {
  let result = num != null ? parseFloat(num).toFixed(2) : 0;
  return result;
}

export const getMonthYear = () => {
  return `${monthNames[(new Date().getMonth())]} ${new Date().getFullYear()}`;
}