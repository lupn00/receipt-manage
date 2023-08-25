import { errorAlert } from "@/core/utils/MessageUtils";
import { formatMoney } from "@/core/utils/ElementPlusFormatter";

// upload 组件上传图片时,限制文件类型和大小方法
const limitImgAnd5M = (file) => {
  const isIMAGE =
    file.type === "image/jpeg" ||
    file.type === "image/gif" ||
    file.type === "image/png";
  const isLt1M = file.size / 1024 / 1024 < 5;

  if (!isIMAGE) {
    errorAlert("只能上传jpg,gif,png图片格式文件");
  }
  if (!isLt1M) {
    errorAlert("上传文件大小不能超过 5MB!");
  }
  return isIMAGE && isLt1M;
};

// upload 组件上传图片时,限制文件类型和大小方法
const limitImgPdfAnd5M = (file) => {
  const isImageOrPdf =
    file.type === "application/pdf" ||
    file.type === "image/jpeg" ||
    file.type === "image/gif" ||
    file.type === "image/png";
  const isLt1M = file.size / 1024 / 1024 < 5;

  if (!isImageOrPdf) {
    errorAlert("只能上传pdf文档,或者jpg,gif,png图片格式文件");
  }
  if (!isLt1M) {
    errorAlert("上传文件大小不能超过 5MB!");
  }
  return isImageOrPdf && isLt1M;
};
/**
 * 合计行，合计金额
 * @param param 
 * @param moneyColName 金额列的列名称
 * @returns 
 */
const tableTotalMoney = (param, moneyColName: string): string[] => {
  const { columns, data } = param;
  let moneyColIndex = 0;
  columns.forEach((col) => {
    if (col.property === moneyColName) {
      moneyColIndex = col.no;
    }
  });
  const tableColNum = columns.length;
  // const sums: string[] = new Array(tableColNum).join(",").split(",");
  const sums: string[] = new Array(tableColNum).fill("");
  sums[0] = "合计";
  let total = 0;
  data.forEach((item) => {
    total += Number(item[moneyColName]);
  });
  sums[moneyColIndex] = formatMoney(total) + "";
  return sums;
};

export { limitImgAnd5M, limitImgPdfAnd5M, tableTotalMoney };