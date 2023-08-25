import RestfulService from "@/core/services/RestfulService";
import ApiService from "@/core/services/ApiService";
import type { IReceipt } from "@/core/services/project/ReceiptCommon";

class GroupReceiptSelfService extends RestfulService {
  constructor() {
    super("/group-receipt-workflow");
  }

  listMyStartInProcess() {
    return ApiService.get(`${this.moduleUrl}`, "query-my-start-in-process");
  }
}

class ReceiptSelfService extends RestfulService {
  constructor() {
    super("/receipt-self");
  }
  listByGroupId(groupId: number) {
    return ApiService.get(`${this.moduleUrl}/group`, `${groupId}`);
  }
  updateRejectMulti(receiptReceiptList: IReceipt[]) {
    return ApiService.put(
      `${this.moduleUrl}/updateRejectMulti`,
      receiptReceiptList
    );
  }
}

const ReceiptSelfServiceImpl = new ReceiptSelfService();
const GroupReceiptSelfServiceImpl = new GroupReceiptSelfService();

export { ReceiptSelfServiceImpl, GroupReceiptSelfServiceImpl };
