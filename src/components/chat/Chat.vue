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
            <li v-for="(item,index) in chatContact" :key="index" class="list-item" @click="changeBox(item)">
              {{ item.chatNickname }}
            </li>
          </ul>
          <p v-if="loading">Loading...</p>
          <p v-if="noMore">No more</p>
        </div>
      </div>
      <div class="chat_right " v-show="chatBox != 0">
        <div class="chatbox">
          <span v-if="chatBox.chatNickname">{{ chatBox.chatNickname }}</span>
          <el-divider/>
          <div class="chat_box" :class="item.receiverUid != msgSend ? 'chat_send':'chat_receiver'"
               v-for="(item,index) in chatBox.list" :key="index">
            <el-image></el-image>
            测试{{ item.content }}<br/>
          </div>
          <!--          <div class="chat_receiver chat_box">-->
          <!--            <el-image></el-image>heloo-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>


  <el-input v-model="msgContent">
  </el-input>
  <el-button @click="send()">发送</el-button>
</template>

<script setup lang="ts">

import {computed, onMounted, Ref, ref, watch} from 'vue'
import {getUserList, User} from "@/api/User";
import {getMsgDetails, Message, MessageDetail, notifi, sendMsg} from "@/api/Message";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/websocket/mywebsocket";
import {UserMsg} from "@/websocket/websocketApi";
import {getChatRelationByUid} from "@/api/Chat";
import {getLocalStorage, setLocalStorage} from "@/utils/localStorage";
import {clearObject} from "@/utils/commonUtils";


const rt = useRoute();

const msgReceiver = ref<number>(-1);
const msgContent = ref<string>('');
const msgSend = rt.query.uid as string
const chatBox = ref<MessageDetail[]>([]);
const chatContact = ref<MessageDetail[]>([]);
const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)
const {connect} = useWebSocket();
const userList = ref<User[]>([])
//获取全部的用户对象
onMounted(async () => {
  const {data} = await getUserList();
  userList.value = data;
})
onMounted(() => {
  useWebSocket().connect(msgSend);
})
onMounted(async () => {
  const {data} = await getChatRelationByUid(msgSend);
  chatContact.value = data
})

function send() {
  let msg = UserMsg(msgSend, msgReceiver.value, msgContent.value);
  useWebSocket().sendMessage(msg);
  msgContent.value = "";
  //并且把当前的消息存入list集合中并且存入缓存

}

/**
 * 把消息存储到浏览器上 可以使用浏览器缓存localstorage 和 浏览器数据库 indexDB 这里采用浏览器缓存方便使用 数据量打的时候需要使用indexdb
 * 切换聊天用户
 * @param str
 */
const changeBox = (str: any) => {
  //判断chatbox是否为空 如果不为空就代表 用户切换了聊天框 先把旧的聊天信息存入缓存中
  if (chatBox.value.length != null) {

    setLocalStorage(chatBox.value.chatId, chatBox.value);

  }
  //先从浏览器缓存中查询是否有缓存的聊天记录
  let date = getLocalStorage(str.chatId);

  //然后再把查询到的消息添加进chatbox
  if (date == null){
    chatBox.value = str
  } else{
    chatBox.value = date
    chatBox.value.list.push(...str.list)
  }
  console.log(str)
  msgReceiver.value = str.chatUid;
  //发送一个异步请求告知后台读取过了这个消息
  notifi(str.chatId)
}
</script>
<style scoped>
.chat {
  display: flex;
//width:500px; flex-direction: column; //height: 500px; //background: #409eff;
}

.chat_left {
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

.chat_content {
  display: flex;
  flex-direction: row;
  height: 500px;
}

.chat_right span {
//font-size: 24px;
}

.chatbox {
  height: 100%;
  width: 500px;
  background-color: #ff5d39;
}

.chat_box {
  display: flex;
  padding: 5px;
  margin: 5px;
}

.chat_receiver {
  background-color: #409eff;
}

.chat_send {
  background-color: #027aa1;
  flex-direction: row-reverse;
}
</style>
