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
          <span v-if="chatBox.nickname != null">{{ chatBox.nickname }}</span>

          <div class="chat_box" :class="item.receiverUid != userStore.user!.userId ? 'chat_send':'chat_receiver'"
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

</template>

<script setup lang="ts">

import { onMounted, ref, watch} from 'vue'
import {User} from "@/api/User";
import {Message, MessageBox, MessageDetail, notifi} from "@/api/Message";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/websocket/mywebsocket";
import {UserMsg} from "@/websocket/websocketApi";
import {ChatRelation, getAllChatRelation, getChatRelationByChatId} from "@/api/Chat";
import {getLocalStorage, setLocalStorage} from "@/utils/localStorage";
import {useUserStore} from "@/store";
import {ElMessage} from "element-plus";
const rt = useRoute();
const userStore = useUserStore()
const msgReceiver = ref<string>("");
const msgContent = ref<string>("");
const chatBox = ref<MessageBox[]>([]);
const chatContact = ref<ChatRelation[]>([]);
const {connect, messages} = useWebSocket();

const checkClient = ref({
  checkId:"",
  checkChatId:"",
})

//获取全部的用户对象
onMounted(async () => {
  // console.log("async",userStore.user!.userId)
  //获取当前用户的全部聊天关系
  let { data }  = await getAllChatRelation(userStore.user!.userId as string);

  //获取全部的关系集合
  let arr:string[] = data;
  console.log(arr + "arrr")
  for (let i = 0; i < arr.length; i++){

    //遍历本地缓存是否拥有该聊天记录
     let item = localStorage.getItem(arr[i]);
     console.log("item",item)
     if (item != null){
       // console.log("json",JSON.parse(item))
       let chat =  JSON.parse(item);
       chatContact.value!.push(chat)
     }
  }

  connect(userStore.user!.userId as string);
  // console.log("chatId",rt.query.chatId)
  //判断缓存中是否拥有这个 如果这个聊天对象 把这个聊天对象添加到chatbox的头部
  const chat = localStorage.getItem(rt.query.chatId as string)
  // console.log("当前的chat",chat)

  if (chat != null && userStore.user!.userId as string!= null){
    let data = JSON.parse(chat)
    // console.log("BUWEIkong",data)
    // console.log("chatbox",chatBox)
    chatBox.value  = data
  }else{
    //为空发送一个请求去后台获取该聊天关系 然后存入聊天框
      const {data}  = await getChatRelationByChatId(rt.query.chatId as string);
      // console.log("weikong",data)
      chatContact.value!.push(data);
      // console.log("chatcontact",chatContact)
  }

})
function send() {
  let msg = UserMsg(userStore.user!.userId as string, checkClient.value.checkId, msgContent.value,
      checkClient.value.checkChatId);
  useWebSocket().sendMessage(msg);
  console.log("test",msg);
  //并且把当前的消息存入list集合中并且存入缓存
  chatBox.value.push(msg);
  msgContent.value = "";

}

/**
 * 监听message中的数据变话  这边需要加value要不然不会监听到
 */
watch(chatBox.value, (newMessages: any) => {
  // 将新消息添加到当前聊天框中
  console.log(newMessages)
  //转成对象
  const data = JSON.parse(newMessages);
  console.log(data)
  //获取到了新的消息把他添加到list集合中并且更新缓存中的消息
  //获取当前的chatbox 存入list中
  if (chatBox.value != null) {
    chatBox.value.push(data)
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
const changeBox = (str: Message) =>{
    console.log(str + "sssssssss")
  checkClient.value.checkChatId = str.chatId!
  // checkClient.value.checkId = str.receiverUid
  //改变接收用户
  console.log("ssssss",str)
  checkClient.value.checkId = str.uid!
  //判断chatbox是否为空 如果不为空就代表 用户切换了聊天框 先把旧的聊天信息存入缓存中
  if (chatBox.value != null) {
    setLocalStorage(checkClient.value.checkChatId, chatBox.value);
  }
  //先从浏览器缓存中查询是否有缓存的聊天记录
  let date = getLocalStorage(str.chatId!);

  //然后再把查询到的消息添加进chatbox
  if (date == null) {
    chatBox.value.push(str)
  } else {
    chatBox.value = date
    chatBox.value.push(...str)
  }
  // console.log(str)
  // msgReceiver.value = str.chatUid;
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
  setLocalStorage(newVal.id, newVal)
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
