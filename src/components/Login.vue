<template>
  <div class="content">
    <div style="margin: 20px"  />
    <el-form
        :rules="rules"

        class="cc_form demo-ruleForm"
        label-position="right"
        label-width="auto"
        :model="userpo"
        style="max-width: 100vw"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="userpo.account" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userpo.password" />
      </el-form-item>
      <div>
        <el-checkbox v-model="rememberme.isRememberme" label="记住密码" size="large" />
        <el-span class="captcha" style="margin-left: 30px">忘记密码</el-span>
      </div>
      <div class="login-div">
        <div>
          <el-span id="login-btn" class="captcha" @click="loginBtn">点击验证</el-span> <svg v-show="capater.isCapater" t="1718623711524" class="cc_success_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1461" width="200" height="200"><path d="M512 0C229.003636 0 0 229.003636 0 512s229.003636 512 512 512 512-229.003636 512-512S794.996364 0 512 0z m260.654545 425.425455l-279.272727 279.272727c-5.585455 5.585455-13.032727 9.309091-21.410909 9.309091-10.24 1.861818-20.48-0.930909-27.927273-8.378182l-175.941818-176.872727a30.906182 30.906182 0 0 1 0-43.752728l14.894546-14.894545c12.101818-12.101818 31.650909-12.101818 43.752727 0l141.498182 141.498182 244.829091-244.829091c12.101818-12.101818 31.650909-12.101818 43.752727 0L772.654545 381.672727c12.101818 12.101818 12.101818 31.650909 0 43.752728z" fill="#65B85D" p-id="1462"></path></svg>

          <div id="captcha-div"></div>
        </div>
        <div>
          <el-span class="captcha">没有账号？点击去注册</el-span>
        </div>

      </div>
      <div>
        <el-button type="primary"  @click="login()">登录</el-button>
<!--        <el-button types="primary" :disabled=!capater.isCapater @click="login()">登录</el-button>-->
        <el-button  @click="resetForm()">清空</el-button>
      </div>
    </el-form>


  </div>
</template>


<script setup lang="ts">
import "../common/tac.min.js"
import "../common/styles/tac.css"
import request from "@/utils/request";
import {getCurrentInstance, reactive} from "vue";
import {ElMessage, ElNotification, FormRules} from "element-plus";
import {useUserStore} from "@/store";
const globalProperties = getCurrentInstance()!.appContext.config.globalProperties;
const clearValue = globalProperties.$clearValue;

  let userpo = reactive({
      account:'',
      password:''
  })
  let capater = reactive({
    isCapater : false
  });
  let rememberme = reactive({
    isRememberme : false
  })
const userStatus = useUserStore();
const rules = reactive<FormRules>({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 6, max: 16, message: '账号必须在6-16个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码必须在6-16个字符之间', trigger: 'blur' },
  ],
})
  const  loginBtn = () =>{
    const style = {logoUrl : null}
    const config = {
      requestCaptchaDataUrl: "http://localhost:8090/user/captcha",
      validCaptchaUrl: "http://localhost:8090/user/check",
      bindEl: "#captcha-div",
      // 按钮样式
      btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
      // 背景样式
      bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
      // logo地址
      logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
      // 滑动边框样式
      moveTrackMaskBgColor: "#f7b645",
      moveTrackMaskBorderColor: "orange",
      // 验证成功回调函数
      validSuccess:(res,c,tac)=> {
        // console.log(res);
        // login();
        capater.isCapater = true;
        tac.destroyWindow();
      }
    }

    new window.TAC(config,style).init();
  }
const login =  () => {
  request.post('/user/login/'+rememberme.isRememberme,userpo).then(async (res) => {
    // console.log('sadasdASA')
    // console.log(res.data.tokenValue)
    // console.log(res)
    // 把token存入浏览器缓存中
    // 判断是否勾选了rememberme
    let token = res.data.tokenValue
    await request.get('/user/'+res.data.loginId).then((res) => {
      // console.log("开始输出")
      // console.log(res)
      // console.log(jsonstr)

      ElMessage.success("欢迎回来:"+res.data.nickname)
      //把用户信息存入浏览器缓存中
      // console.log(jsonstr)
      if(rememberme.isRememberme) {
        // JSON.stringify(res.data);
        localStorage.setItem('token',token);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
      }
      userStatus.login(res.data)
      // globalProperties.$store.commit("savaUser",res.data)
      //存入
      //跳转到首页
      globalProperties.$router.push({path:'/'})
    })
  }).catch((err) => {
    console.log(err)
    ElNotification.error(err)
  })
}

const resetForm =  () =>{
  clearValue(userpo)
}

const getInfo = (id:number) => {

}
</script>

<style scoped>

  .content{
    background: url('../assets/1.jpg') ;
    background-size: cover;
    background-attachment: fixed;
    //height: 100vh;
    background: white;
    margin: 0 auto;
  }

  .captcha{
    color: #027aa1;
    //padding:  10px 0px;
    font-size: 12px;
    margin: 5px;

  }
  .captcha:hover{
      cursor: pointer;
  }
  .cc_form{
    display: flex;
    align-items: center;
    flex-direction: column;
    //background: #00f4ab;
    margin: 30px;
  }
  .cc_success_icon{
    width: 15px;
    height: 15px;
    font-size: 12px;
  }
  .login-div div{
    margin: 5px;
  }
</style>
