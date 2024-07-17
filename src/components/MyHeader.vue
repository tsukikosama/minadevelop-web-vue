<template>
  <el-menu
      :default-active=activeIndex
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item >
      这里未来是一个大大的logo
    </el-menu-item>

<!--    <div class="flex-grow" />-->
    <el-menu-item index="/">
      首页
    </el-menu-item>
    <el-menu-item index="/type">
      分类
    </el-menu-item>
    <el-menu-item index="/product">
      商品
    </el-menu-item>


    <div class="flex-grow" />
    <div class="search">
      <el-input v-model="input" style="width: 240px" placeholder="搜索" />
    </div>


    <div class="flex-grow" />
      <div class="login" v-if="userStore.user == null">
        <el-span index="1" @click="login()">
          登录
        </el-span>
        <el-span index="4" @click="reg()">
          注册
        </el-span>
      </div>
      <div class="login" v-else>
        <el-span index="1" >
          {{userStore.user.nickname}}
        </el-span>
        <el-span index="4" @click="logout()">
          注销
        </el-span>
      </div>


  </el-menu>
</template>

<script lang="ts" setup>
import {getCurrentInstance, reactive, ref} from 'vue'
import request from "@/utils/request";
import {ElNotification} from "element-plus";
import {useUserStore}  from "../store/index";

   const globalProperties = getCurrentInstance()!.appContext.config.globalProperties;
   const userStore = useUserStore() // 调用 useUserStore 以获取 store 实例
   const input = ref('')
   const activeIndex = ref('0')

   const person = reactive({
      name: '张三',
      age: 18,
      sex: '男'
   })
   const login = () => {

      //跳转登录界面
     globalProperties.$router.push({path:'/login'})
      // request.get('/login').then(() => {
      //   ElNotification.success("登录成功")
      // }).catch((e: string) => {
      //   ElNotification.error("登录失败，原因为："+e)
      // })
   }
   const  reg = () =>{
      // request.get('/reg').then(() => {
      //   ElNotification.success("注册成功")
      // }).catch((e: string) => {
      //   ElNotification.error("注册失败，原因为："+e)
      // })
   }
   const logout = () => {

     request.post('/user/logout',userStore.user!.uid).then((res:any) => {
       // ElNotification.success("注销成功")
       // globalProperties.$store.commit("logout");
       userStore.logout();
       // localStorage.removeItem("userInfo")
       ElNotification.success("注销成功")
     }).catch((e:any) => {
       ElNotification.error("注销失败，原因为："+e)
     })
   }
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.login{
  display: flex;
  align-items: center;
  justify-content: center;
}
.login el-span{
  padding: 5px;
}
.login el-span:hover{
  cursor:pointer
}
.login el-span:last-child{
  margin-right: 5vw;
}
.search{
  margin:  auto  5px;
}
</style>
