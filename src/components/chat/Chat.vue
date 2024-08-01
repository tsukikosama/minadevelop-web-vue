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
            <li v-for="(item ,index) in chatContact" :key="index" class="list-item" @click="changeBox(item)">
              {{ item.nickname }}
            </li>
          </ul>

        </div>
      </div>
      <div class="chat_right">
        <div class="chatbox">
          <span v-if="chatBox.nickname">{{ chatBox.nickname }}</span>

          <div class="chat_box" :class="item.receiverUid != msgSend ? 'chat_send':'chat_receiver'"
               v-for="(item,index) in chatBox.list" :key="index">
            <!--            <el-image></el-image>-->
            {{ item.content }}<br/>
          </div>
        </div>
        <div class="chat_inner">
          <el-input v-model="msgContent" placeholder="请输入内容" type="textarea"
                    :autosize="{ minRows: 4, maxRows: 4 }">

          </el-input>
          <el-button @click="send()" class="sendbtn">发送</el-button>
        </div>
      </div>
    </div>
  </div>


  <!--  <el-input v-model="msgContent">-->
  <!--  </el-input>-->

</template>

<script setup lang="ts">

import {ComponentInternalInstance, computed, getCurrentInstance, onMounted, Ref, ref, watch} from 'vue'
import {getUserList, User} from "@/api/User";
import {getMsgDetails, Message, MessageBox, MessageDetail, notifi, sendMsg} from "@/api/Message";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/websocket/mywebsocket";
import {UserMsg} from "@/websocket/websocketApi";
import {getChatRelationByChatId, getChatRelationByUid} from "@/api/Chat";
import {getLocalStorage, setLocalStorage} from "@/utils/localStorage";
import {clearObject} from "@/utils/commonUtils";
import {useUserStore} from "@/store";

const rt = useRoute();
const userStore = useUserStore()
const msgReceiver = ref<number>(-1);
const msgContent = ref<string>("");
const msgSend = ref<string>("")
const chatBox = ref<MessageBox[]>([]);
const chatContact = ref<MessageDetail[]>([]);
const {connect, sendMessage, messages} = useWebSocket();

const userList = ref<User[]>([])
//获取全部的用户对象
onMounted( () => {
  // const {data} = await getUserList();
  // userList.value = data;
})
onMounted(async () => {
  msgSend.value = userStore.user!.userId as string;
  connect(msgSend.value);
  console.log("chatId",rt.query.chatId)
  //判断缓存中是否拥有这个
  const chat = localStorage.getItem(rt.query.chatId as string)
  console.log("当前的chat",chat)
  let data ;
  if (chat != null){
    data = JSON.parse(chat)
    console.log("BUWEIkong",)
  }else{
    //为空发送一个请求去后台获取该聊天关系 然后存入聊天框
      data  = await getChatRelationByChatId(rt.query.chatId as string);
    console.log("weikong",data.data)

  }
  chatContact.value.push(data.data);
})
onMounted(async () => {
  console.log("async",msgSend.value)
  if (msgSend.value != null) {
    const {data} = await getChatRelationByUid(msgSend.value);
    console.log("data",data)
    chatContact.value = data
  }

})


function send() {
  let msg = UserMsg(msgSend.value, msgReceiver.value, msgContent.value, chatBox.value.chatId, userStore.user!.nickname, chatBox.value.chatNickname);
  useWebSocket().sendMessage(msg);
  msgContent.value = "";
  //并且把当前的消息存入list集合中并且存入缓存
  chatBox.value.list!.push(msg);
}

/**
 * 监听message中的数据变话  这边需要加value要不然不会监听到
 */
watch(messages.value, (newMessages: any) => {
  // 将新消息添加到当前聊天框中
  console.log("接收到了新的数据:")
  console.log(newMessages)
  //转成对象
  const data = JSON.parse(newMessages);
  console.log(data)
  //获取到了新的消息把他添加到list集合中并且更新缓存中的消息
  //获取当前的chatbox 存入list中
  if (chatBox.value != null) {
    chatBox.value.list!.push(data)
  }
  // if (chatBox.value && chatBox.value.chatId) {
  //   chatBox.value.list.push(...newMessages);
  // }
},);
/**
 * 把消息存储到浏览器上 可以使用浏览器缓存localstorage 和 浏览器数据库 indexDB 这里采用浏览器缓存方便使用 数据量打的时候需要使用indexdb
 * 切换聊天用户
 * @param str
 */
const changeBox = (str: any) => {
  //改变接收用户
  // console.log(str.chatUid)
  msgReceiver.value = str.chatUid
  //判断chatbox是否为空 如果不为空就代表 用户切换了聊天框 先把旧的聊天信息存入缓存中
  if (chatBox.value != null) {
    setLocalStorage(chatBox.value.chatId, chatBox.value);
  }
  //先从浏览器缓存中查询是否有缓存的聊天记录
  let date = getLocalStorage(str.chatId);

  //然后再把查询到的消息添加进chatbox
  if (date == null) {
    chatBox.value = str
  } else {
    chatBox.value = date
    chatBox.value.messageList.push(...str.list)
  }
  console.log(str)
  msgReceiver.value = str.chatUid;
  //发送一个异步请求告知后台读取过了这个消息
  notifi(str.chatId)
}
/**
 * 使用定时器去监听chatbox的数量是否发生了改变
 * 如果当前chatbox的数量发生了改变就代表有新的消息
 * 就可以把他存入缓存中
 */
watch(chatBox, (newVal: any) => {
  // console.log("s数量发送了变话")
  // console.log(newVal.chatId)
  setLocalStorage(newVal.chatId, newVal)
  // setLocalStorage()
}, {deep: true})
</script>
<style scoped>
.chat {
  display: flex;

//width:500px; flex-direction: column; //height: 500px; //background: #409eff;
}

.chat div {

}

.chat_left {
  width: 500px;
  height: 500px;
  border: 1px solid black;
}

.chat_right {
  border: 1px solid black;
}

.chat_box span {
  height: 30px;
  background-color: #39c522;
  border-bottom: 1px solid black;
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
.list-item:hover{
  cursor:pointer;
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
  height: 410px;
  width: 500px;
  overflow-y: scroll;
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

.chat_inner {
  display: flex;
//width: 100%; //height: 200px; position: relative;
}

.sendbtn {
  position: absolute;
  right: 0px;
  bottom: 0px;
}
</style>
