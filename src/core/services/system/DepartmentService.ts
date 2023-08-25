import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class DepartmentService extends RestfulService {
  constructor() {
    super("/department-tree");
  }

  inUse() {
    return ApiService.get(this.moduleUrl, "in-use");
  }

  saveDepartmentRole(departmentRoles: IDepartmentRoles) {
    return ApiService.post(
      `${this.moduleUrl}/save-department-role`,
      departmentRoles
    );
  }

  listRoleIdByDepartmentId(departmentId: number) {
    return ApiService.get(
      `${this.moduleUrl}/role-id/department`,
      String(departmentId)
    );
  }
}

interface IDepartmentRoles {
  departmentId: number;
  roleIds: Array<number>;
}

const DepartmentServiceImpl = new DepartmentService();
export default DepartmentServiceImpl;
export { type IDepartmentRoles };
