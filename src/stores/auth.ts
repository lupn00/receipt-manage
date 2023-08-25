import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  username: string;
  phone: string;
  token: string;
  avatar: string;
  isChangePwd: number;
  roleIds: Array<number>;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    const errors = ref({});
    const user = ref<User>({} as User);
    const isAuthenticated = ref(!!JwtService.getToken());

    function setAuth(authUser: User) {
      isAuthenticated.value = true;
      user.value = authUser;
      errors.value = {};
      JwtService.saveToken(user.value.token);
      ApiService.setHeader();
    }

    function setError(error: any) {
      errors.value = { ...error };
    }

    function purgeAuth() {
      isAuthenticated.value = false;
      user.value = {} as User;
      errors.value = [];
      JwtService.destroyToken();
      JwtService.destroyUserMenu();
    }

    function login(
      username: string,
      password: string,
      captchaVerification: string
    ) {
      return ApiService.post("login", {
        username,
        password,
        captchaVerification,
      })
        .then(({ data }) => {
          setAuth(data.obj);
        })
        .catch(({ response }) => {
          setError(["登录异常"]);
        });
    }

    function logout() {
      purgeAuth();
    }

    function register(credentials: User) {
      return ApiService.post("register", credentials)
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
        });
    }

    function forgotPassword(email: string) {
      return ApiService.post("forgot_password", email)
        .then(() => {
          setError({});
        })
        .catch(({ response }) => {
          setError(response.data.errors);
        });
    }

    function verifyAuth() {
      if (JwtService.getToken()) {
        ApiService.setHeader();
        ApiService.post("verify_token", { api_token: JwtService.getToken() })
          .then(({ data }) => {
            setAuth(data);
          })
          .catch(({ response }) => {
            setError(response.data.errors);
            purgeAuth();
          });
      } else {
        purgeAuth();
      }
    }

    return {
      errors,
      user,
      isAuthenticated,
      login,
      logout,
      register,
      forgotPassword,
      verifyAuth,
    };
  },
  { persist: { storage: sessionStorage } }
);
