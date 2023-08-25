import moment from "moment";

const formatDateEP = (row, column, cellValue, index) => {
  if (cellValue) return moment(cellValue).format("YYYY-MM-DD");
  else {
    return "";
  }
};

const formatDateTimeEP = (row, column, cellValue, index) => {
  if (cellValue) return moment(cellValue).format("YYYY-MM-DD HH:mm");
  else {
    return "";
  }
};

const formatMoneyEP = (row, column, cellValue, index) => {
  return formatMoney(cellValue);
};

const formatMoney = (cellValue) => {
  if (cellValue) return Number(cellValue).toFixed(2);
  else {
    return "";
  }
};

export { formatDateEP, formatDateTimeEP, formatMoneyEP, formatMoney };
