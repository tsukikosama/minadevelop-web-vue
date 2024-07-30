// src/websocketService.js
import {ComponentInternalInstance, getCurrentInstance, ref} from 'vue';
import {Message} from "@/api/Message";
import qs from "qs";
import {GroupMsg, HeartMsg} from "@/websocket/websocketApi";
import {useRoute} from "vue-router";

const ws = ref<WebSocket | null>(null);
const heartbeatInterval = ref<number | null>(null);
const heartbeatTimeout = ref<number | null>(null);
const HEARTBEAT_INTERVAL: number = 1000 * 30 ; // 心跳间隔（毫秒）
const HEARTBEAT_TIMEOUT: number = 1000 * 10; // 心跳超时（毫秒）

export function useWebSocket() {
    // const  rt  = useRoute();

    const messages = ref<any[]>([]);
    // const uid = rt.query.uid as string
    function connect(uid:number|string) {
        ws!.value = new WebSocket('ws://localhost:8099/websocket?userId='+uid);
        ws!.value.onopen = function () {
            console.log('开始连接');
            startHeartbeat(uid);
        };

        ws.value.onmessage = function (event) {

            let receivedMessage = event.data;
            const msg = JSON.parse(receivedMessage);

            if (msg.content === 'pong') {
                // console.log('Heartbeat received');
                console.log("心跳检测完毕");
                clearTimeout(heartbeatTimeout.value as number);
            }else{
                //通过监听器来监听数据的变话
                messages.value!.push(msg)
            }

        };

        ws.value.onclose = function () {
            console.log('连接关闭');
            stopHeartbeat();
        };

        ws.value.onerror = function (error) {
            console.error('WebSocket Error: ' + error);
            stopHeartbeat();
        };

    }

    function startHeartbeat(uid: string|number) {
        console.log("心跳检测启动")
        heartbeatInterval.value = setInterval(() => {
            console.log("发送心跳检测")
            let s = HeartMsg(uid);
            console.log(s);
            ws.value!.send(JSON.stringify(s));
            heartbeatTimeout.value = setTimeout(() => {
                console.log('没有心跳连接关闭');
                ws.value!.close();
            }, HEARTBEAT_TIMEOUT);
        }, HEARTBEAT_INTERVAL);
    }

    function stopHeartbeat() {
        clearInterval(heartbeatInterval.value as number);
        clearTimeout(heartbeatTimeout.value as number);
    }

    function sendMessage(message: Message) {
        console.log("发送消息的方法接message")
        console.log(message);
        ws.value!.send(JSON.stringify(message));
    }

    function getWs(){
        return ws.value;
    }
    return {
        connect,
        sendMessage,
        getWs,
        messages
    };


}
