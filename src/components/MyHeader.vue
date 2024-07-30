<template>
  <el-menu
      :default-active=activeIndex
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item>
      这里未来是一个大大的logo
    </el-menu-item>

    <!--    <div class="flex-grow" />-->
    <el-menu-item index="/">
      首页
    </el-menu-item>
    <el-menu-item index="/types">
      分类
    </el-menu-item>
    <el-menu-item index="/product">
      商品
    </el-menu-item>


    <div class="flex-grow"/>
    <div class="search">
      <el-input v-model="input" style="width: 240px" placeholder="搜索"/>
    </div>


    <div class="flex-grow"/>
    <div class="login" v-if="userStore.user == null">
      <el-span index="1" @click="login()">
        登录
      </el-span>
      <el-span index="4" @click="reg()">
        注册
      </el-span>
    </div>
    <div class="login" v-else>
      <el-dropdown index="1" size="large">
        <el-span>{{ userStore.user.nickname }}</el-span>
        <template #dropdown>
          <el-dropdown-menu split-button type="primary">
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>
              <el-badge :value="messageCount" class="item" @click="toChat(userStore.user.userId)">
                <el-span>消息</el-span>
              </el-badge>
            </el-dropdown-item>
            <el-dropdown-item @click="toFuns(userStore.user.userId)">
              <el-span>粉丝</el-span>
            </el-dropdown-item>
            <el-dropdown-item @click="toFollow(userStore.user.userId)">
              <el-span>关注</el-span>
            </el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-span index="4" class="logout" @click="logout()">
        注销
      </el-span>
    </div>


  </el-menu>

</template>

<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive, ref} from 'vue'
import request from "@/utils/request";
import {ElNotification} from "element-plus";
import {useUserStore} from "../store/index";
import {getMsgList} from "@/api/Message";

const globalProperties = getCurrentInstance()!.appContext.config.globalProperties;
const userStore = useUserStore() // 调用 useUserStore 以获取 store 实例
const input = ref('')
const activeIndex = ref('0')
const messageCount = ref<number>(0)

const login = () => {
  //跳转登录界面
  globalProperties.$router.push({path: '/login'})
}
const toChat = (uid: string) => {
  // console.log(u)
  globalProperties.$router.push({path: '/chat', query: {uid: uid}})
}
const toFuns = (uid: string) => {
  globalProperties.$router.push({path: '/fans', query: {uid: uid}})
}

const toFollow = (uid: string) => {
  globalProperties.$router.push({path: '/follow', query: {uid: uid}})
}
const reg = () => {
  // request.get('/reg').then(() => {
  //   ElNotification.success("注册成功")
  // }).catch((e: string) => {
  //   ElNotification.error("注册失败，原因为："+e)
  // })
}
onMounted(() => {
  msgCount()
})
const msgCount = async () => {
  if (userStore.user != null) {
    let {data} = await getMsgList(userStore.user.userId);
    // console.log("wwwwlogo")
    console.log(data);
    messageCount.value = data;
  }
}
const logout = () => {

  request.post('/user/logout', userStore.user!.userId).then((res: any) => {
    // ElNotification.success("注销成功")
    // globalProperties.$store.commit("logout");
    userStore.logout();
    // localStorage.removeItem("userInfo")
    ElNotification.success("注销成功")
  }).catch((e: any) => {
    ElNotification.error("注销失败，原因为：" + e)
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

.login {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5vw;
}

.login el-span {
  padding: 5px;
}

.login el-span:hover {
  cursor: pointer
}

.search {
  margin: auto 5px;
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
