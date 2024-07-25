// src/websocketService.js
import {ref} from 'vue';
import {Message} from "@/api/Message";
import qs from "qs";
import {GroupMsg} from "@/websocket/websocketApi";
import {useRoute} from "vue-router";

const ws = ref<WebSocket | null>(null);
const heartbeatInterval = ref<number | null>(null);
const heartbeatTimeout = ref<number | null>(null);
const HEARTBEAT_INTERVAL: number = 5000; // 心跳间隔（毫秒）
const HEARTBEAT_TIMEOUT: number = 10000; // 心跳超时（毫秒）

export function useWebSocket() {
    // const  rt  = useRoute();

    // const messages:Message = ref<Message|null>(null);
    // const uid = rt.query.uid as string
    function connect(uid:number|string) {
        ws!.value = new WebSocket('ws://localhost:8099/websocket?userId='+uid);
        ws!.value.onopen = function () {
            console.log('开始连接');


            let test: Message = {
                msgSend: 1,
                msgReceiver: 2,
                msgContent: "3",
                msgType: 3
            }
            ws.value!.send(JSON.stringify(test))
            startHeartbeat();
        };

        ws.value.onmessage = function (event) {
            const receivedMessage = event.data;
            console.log('接收到的消息是: ' + receivedMessage);
            if (receivedMessage === 'pong') {
                console.log('Heartbeat received');
                clearTimeout(heartbeatTimeout.value as number);
            }

            // messages.value.push(receivedMessage);
        };

        ws.value.onclose = function () {
            console.log('Disconnected');
            stopHeartbeat();
        };

        ws.value.onerror = function (error) {
            console.error('WebSocket Error: ' + error);
            stopHeartbeat();
        };

    }

    function startHeartbeat() {
        // heartbeatInterval.value = setInterval(() => {
        //     let s = GroupMsg("","",'ping');
        //     ws.value!.send(JSON.stringify(s));
        //     heartbeatTimeout.value = setTimeout(() => {
        //         console.log('No heartbeat response, closing connection');
        //         ws.value!.close();
        //     }, HEARTBEAT_TIMEOUT);
        // }, HEARTBEAT_INTERVAL);
    }

    function stopHeartbeat() {
        clearInterval(heartbeatInterval.value as number);
        clearTimeout(heartbeatTimeout.value as number);
    }

    function sendMessage(message: Message) {
        console.log("发送消息的方法接收到了message")
        console.log(message);
        ws.value!.send(JSON.stringify(message));
    }

    function getWs(){
        return ws.value;
    }
    return {
        connect,
        sendMessage,
        getWs
        // messages
    };


}
