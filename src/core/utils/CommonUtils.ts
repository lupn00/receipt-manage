import moment from "moment";
const formatDate = (date: Date) => {
  if (date) return moment(date).format("YYYY-MM-DD");
  else {
    return "";
  }
};

const formatDateTime = (date: Date) => {
  if (date) return moment(date).format("YYYY-MM-DD HH:mm");
  else {
    return "";
  }
};

const formatMoney = (money: number) => {
  if (money) return Number(money).toFixed(2);
  else {
    return "";
  }
};

const calculateAge = (date: Date) => {
  if (date) return moment().diff(moment(date), "years") + 1;
  else {
    return "";
  }
};

export { formatDate, formatDateTime, calculateAge, formatMoney };
