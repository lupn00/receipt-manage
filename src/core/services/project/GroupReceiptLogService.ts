import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class GroupReceiptLogService extends RestfulService {
  constructor() {
    super("/group-receipt-log");
  }
  
  listByGroupReceiptId(groupReceiptId: number) {
    return ApiService.get(
      `${this.moduleUrl}/list/group-receipt`,
      groupReceiptId.toString()
    );
  }
}

const GroupReceiptLogServiceImpl = new GroupReceiptLogService();

interface IGroupReceiptLog {
  id: number;
  groupReceiptId: number;
  groupReceiptName: string;
  operatorEmployeeId: number;
  operatorEmployeeName: string;
  operation: string;
  remark?: string;
  receiptId?: number;
  receiptCodeNo?: string;
  dtCreate: Date;
}

// export default GroupReceiptLogServiceImpl;
export { type IGroupReceiptLog, GroupReceiptLogServiceImpl };
