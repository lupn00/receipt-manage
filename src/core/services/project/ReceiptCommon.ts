import type { FormRules } from "element-plus";

interface IReceipt {
  id?: number;
  groupId?: number;
  groupName?: string;
  imgReceipt?: string;
  codeReceipt?: string;
  noReceipt?: string;
  codeNoReceipt?: string;
  ddReceipt?: string;
  bdMoney?: number;
  category?: number;
  employeeId?: number;
  employeeName?: string;
  status: number;
  remark: string;
  systemCategory: string;
  systemCheckCode: string;
  systemEncrypt: string;
  originStr: string;
  dtCreate?: Date;
  dtUpdate?: Date;
  hasCodeNo: number;
}

interface IGroupReceipt {
  name: string;
  numReceipt?: number;
  bdTotal?: number;
  status: number;
  remark: string;
  dtCreate?: Date;
  dtUpdate?: Date;
}

function initGroupReceipt(options?: Partial<IGroupReceipt>): IGroupReceipt {
  const defaults = {
    name: "",
    numReceipt: 0,
    bdTotal: undefined,
    status: 1,
    remark: "",
  };
  return {
    ...defaults,
    ...options,
  };
}

function initReceipt(options?: Partial<IReceipt>): IReceipt {
  const defaults = {
    status: 1,
    remark: "",
    hasCodeNo: 1,
  };
  return {
    ...defaults,
    ...options,
  };
}

function receiptCategory2Str(status: number): string {
  switch (status) {
    case 1:
      return "餐饮";
    case 2:
      return "住宿";
    case 3:
      return "办公用品";
    case 4:
      return "出租车";
    case 5:
      return "火车票";
    case 6:
      return "飞机票";
    case 9:
      return "其他";
    default:
      return "未知类别";
  }
}

function receiptCategory2StrEP(row, column, cellValue, index) {
  return receiptCategory2Str(cellValue);
}

function receiptStatus2Str(status: number): string {
  switch (status) {
    case 1:
      return "新建";
    case 2:
      return "已提交财务";
    case 3:
      return "财务驳回";
    case 4:
      return "财务已核对";
    case 9:
      return "财务已报销";
    default:
      return "未知状态";
  }
}

function receiptStatus2Tag(status: number): string {
  switch (status) {
    case 1:
      return "";
    case 2:
      return "warning";
    case 3:
      return "danger";
    case 4:
      return "info";
    case 9:
      return "success";
    default:
      return "";
  }
}
function receiptStatus2StrEP(row, column, cellValue, index): string {
  return receiptStatus2Str(cellValue);
}
const GroupReceiptRules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入发票组名称",
      trigger: "blur",
    },
    {
      type: "string",
      max: 50,
      message: "最多输入50字",
      trigger: "blur",
    },
  ],
  remark: [
    {
      type: "string",
      max: 500,
      message: "最多输入500字",
      trigger: "blur",
    },
  ],
};

const ReceiptRules: FormRules = {
  hasCodeNo: [
    {
      required: true,
      message: "请选择是否有发票",
      trigger: "change",
    },
  ],
  codeReceipt: [
    // {
    //   required: true,
    //   message: "请输入发票代码",
    //   trigger: "blur",
    // },
    {
      pattern: "(^\\d{10}$)|(^\\d{12}$)",
      message: "发票代码为全数字且为10或12位",
      trigger: "blur",
    },
  ],
  noReceipt: [
    {
      pattern: "(^\\d{8}$)",
      message: "发票号码为全数字且为8位",
      trigger: "blur",
    },
  ],
  ddReceipt: [
    {
      type: "date",
      required: true,
      message: "请选择开票日期",
      trigger: "change",
    },
  ],
  category: [
    {
      required: true,
      message: "请选择发票类别",
      trigger: "change",
    },
  ],
  bdMoney: [
    {
      required: true,
      message: "请输入发票金额",
      trigger: "blur",
    },
    {
      pattern: "^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,2})?$",
      message: "发票金额为正，且最多两位小数",
      trigger: "blur",
    },
  ],
  remark: [
    {
      type: "string",
      max: 500,
      message: "最多输入500字",
      trigger: "blur",
    },
  ],
};

class GroupReceiptStep {
  active: number = 1;
  steps: any[];
  constructor() {
    this.steps = [
      { title: "提交审核", processStatus: "" },
      { title: "财务审核", processStatus: "" },
      { title: "审核通过", processStatus: "" },
      { title: "完成", processStatus: "" },
    ];
  }
  static getFromGroupReceiptStatus(status: number) {
    const stepInfo = new GroupReceiptStep();
    switch (status) {
      case 2:
        stepInfo.active = 1;
        stepInfo.steps[0].processStatus = "success";
        stepInfo.steps[1].processStatus = "wait";
        break;
      case 3:
        stepInfo.active = 2;
        stepInfo.steps[0].processStatus = "success";
        stepInfo.steps[1].processStatus = "success";
        stepInfo.steps[2].processStatus = "error";
        break;
      case 4:
        stepInfo.active = 2;
        stepInfo.steps[0].processStatus = "success";
        stepInfo.steps[1].processStatus = "success";
        stepInfo.steps[2].processStatus = "success";
        break;
      case 9:
        stepInfo.active = 3;
        stepInfo.steps[0].processStatus = "success";
        stepInfo.steps[1].processStatus = "success";
        stepInfo.steps[2].processStatus = "success";
        stepInfo.steps[3].processStatus = "success";
        break;
    }
    return stepInfo;
  }
}

class GroupReceiptStepAnt {
  current: number = 0;
  items: any[];
  status: string = "process"; // wait process finish error
  constructor() {
    this.items = [
      { title: "新建", description: "" },
      { title: "审核中", description: "" },
      { title: "审核通过", description: "" },
      { title: "完成（已打款）", description: "" },
    ];
  }
  /**
   * 
   * @param status 发票处理状态：
      1-新建
      2-已提交财务
      3-驳回
      4-财务已核对
      9-已报销（完成）
   * @returns 
   */
  static getFromGroupReceiptStatus(status: number) {
    const stepInfo = new GroupReceiptStepAnt();
    switch (status) {
      case 1:
        stepInfo.current = 0;
        break;
      case 2:
        stepInfo.current = 1;
        break;
      case 3:
        stepInfo.current = 2;
        stepInfo.status = "error";
        break;
      case 4:
        stepInfo.current = 2;
        break;
      case 9:
        stepInfo.current = 3;
        break;
    }
    return stepInfo;
  }
}
/**
   是否有发票号
 */
const ReceiptHasCodeNoList = [
  {
    name: "发票类-有发票号",
    value: 1,
  },
  {
    name: "收据类-没有发票号",
    value: 0,
  },
];
/**
  发票类别：1-餐饮，2-住宿，3-办公用品，4-出租车，5-火车票，6-飞机票，9-其他
 */
const ReceiptCategoryList = [
  {
    name: "餐饮",
    value: 1,
  },
  {
    name: "住宿",
    value: 2,
  },
  {
    name: "办公用品",
    value: 3,
  },
  {
    name: "出租车",
    value: 4,
  },
  {
    name: "火车票",
    value: 5,
  },
  {
    name: "飞机票",
    value: 6,
  },
  {
    name: "其他",
    value: 9,
  },
];

export {
  type IReceipt,
  type IGroupReceipt,
  initGroupReceipt,
  initReceipt,
  receiptCategory2Str,
  receiptCategory2StrEP,
  receiptStatus2Str,
  receiptStatus2Tag,
  receiptStatus2StrEP,
  ReceiptRules,
  GroupReceiptRules,
  GroupReceiptStep,
  GroupReceiptStepAnt,
  ReceiptCategoryList,
  ReceiptHasCodeNoList,
};
