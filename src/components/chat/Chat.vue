<template>
  <div class="chat">
    <h1>芜湖聊天框</h1>
    <!--  聊天框  -->
    <div class="chat_content">
      <div class="chat_left">
        <div class="infinite-list-wrapper" style="overflow: auto">
          <ul
              v-infinite-scroll="load"
              class="list"
              :infinite-scroll-disabled="disabled"
          >
            <li v-for="i in count" :key="i" class="list-item">{{ i }}</li>
          </ul>
          <p v-if="loading">Loading...</p>
          <p v-if="noMore">No more</p>
        </div>
      </div>
      <div class="chat_right">

        <div class="chatbox">
          <span>name</span>
          <el-divider />
        </div>
      </div>
    </div>
  </div>


  <el-input v-model="msgContent" >

  </el-input>
  <el-span v-for="(item,index) in userList" :key="index" @click="">
    <el-button @click="msgReceiver = item.userId">{{item.nickname}}</el-button>
  </el-span>
  <el-button @click="send()">发送</el-button>



</template>

<script setup lang="ts">

import {computed, onMounted, Ref, ref} from 'vue'
import {getUserList, User} from "@/api/User";
import {getMsgDetails, Message, sendMsg} from "@/api/Message";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/websocket/mywebsocket";
import {UserMsg} from "@/websocket/websocketApi";


const  rt  = useRoute();

const msgReceiver = ref<string>('');
const msgContent = ref<string>('');
const msgSend = rt.query.uid as string

const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)

const { connect, sendMessage } = useWebSocket();
// const load = () => {
//   loading.value = true
//   setTimeout(() => {
//     count.value += 2
//     loading.value = false
//   }, 2000)
// }
const userList = ref<User[]>([])
//获取全部的用户对象
onMounted(async () => {
   const { data } = await getUserList();
   userList.value = data;

})
onMounted( () => {
  console.log(msgSend)
  useWebSocket().connect(msgSend);
})
onMounted(async () => {
  const { data } = await getMsgDetails(msgSend);
  console.log(data)
})
// const sendMessage = async () => {
//    const { data } = await sendMsg(MsgForm.value);
// }
  function send() {
    let msg = UserMsg(msgSend,msgReceiver.value,msgContent.value);
    useWebSocket().sendMessage(msg);
    msgContent.value = "";
  }

  // return {
  //   msg,
  //   connect,
  //   sendMessage: send,
  //   messages
  // }
</script>

<style scoped>
    .chat{
      display: flex;
      //width:500px;
      flex-direction: column;
      //height: 500px;
      //background: #409eff;
    }
    .chat_left{
      width: 500px;
    }
    .infinite-list-wrapper {
      height: 500px;
      text-align: center;
    }
    .infinite-list-wrapper .list {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .infinite-list-wrapper .list-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      background: var(--el-color-danger-light-9);
      color: var(--el-color-danger);
    }
    .infinite-list-wrapper .list-item + .list-item {
      //margin-top: 10px;
    }

    .chat_content{
      display: flex;
      flex-direction: row;
      height: 500px;
    }

    .chat_right span{
      //font-size: 24px;
    }
    .chatbox{
      height: 100%;
      width: 500px;
      background-color: #ff5d39;
    }
</style>
