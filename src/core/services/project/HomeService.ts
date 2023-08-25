import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class HomeService extends RestfulService {
  constructor() {
    super("/home");
  }

  employee(startDt, endDt) {
    return ApiService.post(`${this.moduleUrl}/employee`, {
      startDt,
      endDt,
    });
  }
}

const HomeServiceImpl = new HomeService();

export default HomeServiceImpl;
