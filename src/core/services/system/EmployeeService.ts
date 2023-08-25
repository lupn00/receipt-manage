import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class EmployeeService extends RestfulService {
  constructor() {
    super("/employee");
  }

  // queryTop5ByNameOrPhone(query: string) {
  //   const params = {
  //     params: {
  //       query,
  //     },
  //   };
  //   return ApiService.query(`${this.moduleUrl}/queryTop5ByNameOrPhone`, params);
  // }

  changePwd(data) {
    const params = {
      ...data,
    };
    return ApiService.post(`${this.moduleUrl}/update-pwd`, params);
  }

  self() {
    return ApiService.get(`${this.moduleUrl}`, "self");
  }

  updateBankAccount(bankAccountName: string, bankAccountNo: string) {
    const params = {
      bankAccountName,
      bankAccountNo,
    };
    return ApiService.post(`${this.moduleUrl}/update-bankAccount`, params);
  }

  updateAvatar(avatarUrl: string) {
    const params = {
      avatarUrl,
    };
    return ApiService.post(`${this.moduleUrl}/update-avatar`, params);
  }

  confirmPwdBeforeChangeAccount(loginPassword: string) {
    const params = {
      loginPassword,
    };
    return ApiService.post(
      `${this.moduleUrl}/confirm-pwd-before-change-account`,
      params
    );
  }
}

const EmployeeServiceImpl = new EmployeeService();

interface IEmployee {
  id?: number;
  name: string;
  phone: string;
  password?: string;
  avatar?: string;
  status: number;
  departmentId?: number;
  departmentName?: string;
  ddBirthday?: string;
  dtLastLogin?: Date;
  lastLoginIp?: string;
}

function initEmployeeVal(): IEmployee {
  return {
    name: "",
    phone: "",
    status: 1,
  };
}

const EmployeeValidRules = {
  departmentId: [
    {
      required: true,
      message: "请选择部门",
      trigger: "change",
    },
  ],
  name: [
    {
      required: true,
      message: "员工名称必填",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "11位手机号码必填",
      trigger: "blur",
    },
    {
      min: 11,
      max: 11,
      message: "手机号码为11位",
      trigger: "blur",
    },
  ],
};
export default EmployeeServiceImpl;
export { type IEmployee, initEmployeeVal, EmployeeValidRules };
