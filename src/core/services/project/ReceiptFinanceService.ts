import RestfulService from "@/core/services/RestfulService";
import ApiService from "@/core/services/ApiService";

class GroupReceiptFinanceService extends RestfulService {
  constructor() {
    super("/group-receipt-finance");
  }

  toPaid(id: number) {
    return ApiService.post(`${this.moduleUrl}/to-paid/${id}`, null);
  }

  completeMyTask(groupReceiptId: number) {
    return ApiService.post(
      `${this.moduleUrl}/complete-my-task/${groupReceiptId}`,
      null
    );
  }
}

class ReceiptFinanceService extends RestfulService {
  constructor() {
    super("/receipt-finance");
  }
  listByGroupId(groupId: number) {
    return ApiService.get(`${this.moduleUrl}/group`, `${groupId}`);
  }
  review(receiptId: number, operationCode: number, remark: string = "") {
    return ApiService.post(`${this.moduleUrl}/review`, {
      receiptId,
      operationCode,
      remark,
    });
  }
}

const ReceiptFinanceServiceImpl = new ReceiptFinanceService();
const GroupReceiptFinanceServiceImpl = new GroupReceiptFinanceService();

export { ReceiptFinanceServiceImpl, GroupReceiptFinanceServiceImpl };
