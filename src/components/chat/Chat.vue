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
  <el-span v-for="(value,key) in msgMap" :key="key" @click="">
    <el-button @click="changeBox(key)">{{value[0].receiverNickname}}</el-button>

  </el-span>
  <el-button @click="send()">发送</el-button>


</template>

<script setup lang="ts">

import {computed, onMounted, Ref, ref, watch} from 'vue'
import {getUserList, User} from "@/api/User";
import {getMsgDetails, Message, MessageDetail, sendMsg} from "@/api/Message";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/websocket/mywebsocket";
import {UserMsg} from "@/websocket/websocketApi";


const  rt  = useRoute();

const msgReceiver = ref<number>(-1);
const msgContent = ref<string>('');
const msgSend = rt.query.uid as string
const chatBox = ref<MessageDetail[]>([]);
const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)
const msgMap  = ref<Map<number,MessageDetail[]>>();
const { connect, sendMessage } = useWebSocket();
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
  console.log(data.get(0))
  // for (let i = 0 ; i < data.values() ; i++){
  //   console.log(data)
  //   console.log(data.entries())
  // }
  // console.log( typeof data)
  // msgMap.value = data

})

  function send() {
    let msg = UserMsg(msgSend,msgReceiver.value,msgContent.value);
    useWebSocket().sendMessage(msg);
    msgContent.value = "";
  }
  const changeBox = (str:any) => {
    console.log(str)
    msgReceiver.value = str
     let s =  msgMap.value!.get(str);
     console.log(s)
  }
/**
 * 检测到msgReceiver发生变话去更新对话框
 */
  watch(msgReceiver ,(newValue,OldValue,onCleanup) =>{
    console.log("6666")
    console.log(msgMap.value!.get(newValue))

    // chatBox.value = msgMap.value.get(newValue)!;
  })
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
