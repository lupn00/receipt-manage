<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Heading-->
    <div class="text-center mb-10">
      <!--begin::Title-->
      <h1 class="text-dark mb-3">发票管理系统</h1>
      <!--end::Title-->
    </div>
    <!--begin::Heading 
      :rules="LoginRules"-->
    <el-form
      :model="loginForm"
      :rules="LoginRules"
      ref="loginFormRef"
      label-position="top"
      label-width="100px"
      style="max-width: 460px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input size="large" v-model="loginForm.username" autocomplete="on" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input size="large" type="password" v-model="loginForm.password" />
      </el-form-item>
      <div class="text-center login-div">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
          @click="verifyYZM"
        >
          <span class="indicator-label"> 登录 </span>

          <span class="indicator-progress">
            请稍后...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!-- <Vcode :show="isShowYZM" @success="onYZMSuccess" @close="onYZMClose" /> -->
        <Verify
          @success="onYZMSuccess"
          mode="pop"
          captchaType="blockPuzzle"
          :imgSize="{ width: '330px', height: '155px' }"
          ref="verify"
        ></Verify>
      </div>
    </el-form>

    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, reactive } from "vue";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Vcode from "vue3-puzzle-vcode";
import Verify from "@/components/verifition/Verify.vue";
import type { FormInstance, FormRules } from "element-plus";

export default defineComponent({
  name: "sign-in",
  components: {
    Vcode,
    Verify,
  },
  setup() {
    const verify = ref(null);
    const store = useAuthStore();
    const router = useRouter();

    const loginFormRef = ref<FormInstance>();
    const submitButton = ref<HTMLButtonElement | null>(null);

    interface LoginForm {
      username: string;
      password: string;
    }
    const loginForm = reactive<LoginForm>({
      username: "",
      password: "",
    });

    const LoginRules = ref<FormRules>({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          pattern: "(^\\d{11}$)",
          message: "用户名不正确",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          min: 6,
          message: "密码不正确",
          trigger: "blur",
        },
      ],
    });

    const isShowYZM = ref(false);
    //Create form validation object

    const verifyYZM = async () => {
      // isShowYZM.value = true;
      console.log("点击登录按钮");
      if (!loginFormRef.value) return;
      await loginFormRef.value.validate((valid) => {
        if (valid) {
          verify.value!.show();
          // isShowYZM.value = true;
        } else {
          console.log("validate False");
          return;
        }
      });
    };
    const onYZMSuccess = async (yzmParams) => {
      console.log("yzmParams:" + yzmParams.captchaVerification);
      // isShowYZM.value = false;
      //TODO 登录
      store.logout();
      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }
      // Send login request
      await store.login(loginForm.username, loginForm.password,yzmParams.captchaVerification);
      const error = Object.values(store.errors);
      if (error.length === 0) {
        Swal.fire({
          text: "登录成功!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "进入系统!",
          customClass: {
            confirmButton: "btn fw-bold btn-light-primary",
          },
          timer: 1200,
        }).then(function () {
          // ApiService.setHeader();
          // Go to page after successfully login
          router.push({ name: "home-common-employee" });
        });
      } else {
        Swal.fire({
          text: error[0] as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-danger",
          },
        }).then(() => {
          store.errors = {};
        });
      }
      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      submitButton.value!.disabled = false;
    };
    const onYZMClose = () => {};
    //Form submit function
    return {
      verify,
      loginFormRef,
      loginForm,
      submitButton,
      getAssetPath,
      isShowYZM,
      verifyYZM,
      onYZMSuccess,
      onYZMClose,
      LoginRules,
    };
  },
});
</script>
<style>
/* .yzm {
  position: relative !important;
}
.vue-auth-box_ {
  position: absolute;
  top: 150px !important;
  left: 200px;
  background-color: brown;
} */
</style>
