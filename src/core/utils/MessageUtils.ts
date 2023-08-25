import Swal from "sweetalert2/dist/sweetalert2.js";

const errorAlert = (msg: string) => {
  Swal.fire({
    text: msg,
    icon: "error",
    buttonsStyling: false,
    confirmButtonText: "确定",
    customClass: {
      confirmButton: "btn fw-bold btn-light-danger",
    },
  });
};

const successAlert = (msg: string) => {
  Swal.fire({
    text: msg,
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "确定!",
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};
// const confirmResult = await
const confirmAlert = (msg: string, confirmBtnMsg: string = "删除！") => {
  return Swal.fire({
    title: msg,
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "取消",
    confirmButtonText: confirmBtnMsg,
    reverseButtons: true,
  });
};

export { errorAlert, successAlert, confirmAlert };
