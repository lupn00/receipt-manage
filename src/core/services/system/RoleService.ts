import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class RoleService extends RestfulService {
  constructor() {
    super("/role");
  }

  listAll() {
    return ApiService.get(`${this.moduleUrl}`, "list-all");
  }

  listInUse() {
    return ApiService.get(`${this.moduleUrl}`, "in-use");
  }

  saveRoleMenu(roleMenus: IRoleMenus) {
    return ApiService.post(`${this.moduleUrl}/save-role-menu`, roleMenus);
  }

  listMenuIdByRoleId(roleId: number) {
    return ApiService.get(`${this.moduleUrl}/menu-id/role`, String(roleId));
  }
}

const RoleServiceImpl = new RoleService();

interface IRole {
  id?: number;
  name: string;
  status: number;
  remark?: string;
}

interface IRoleMenus {
  roleId: number;
  menuIds: Array<number>;
}

function initRole(): IRole {
  return {
    status: 1,
  };
}

const RoleValidRules = {
  name: [
    {
      required: true,
      message: "角色名称必填",
      trigger: "blur",
    },
  ],
};
export default RoleServiceImpl;
export { type IRole, type IRoleMenus, initRole, RoleValidRules };
