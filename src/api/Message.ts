import request from "@/utils/request";
import qs from 'query-string';
import {messageType} from "element-plus";

export interface Message {
    msgSend?: number | string
    msgReceiver?: number;
    msgContent: string;
    msgType:number,
    chatId?:string
}

export interface MessageDetail {
    id:string;
    ChatNickname:string;
    ChatUid:number;
    messageId:string;
    sendUid:number;
    receiverUid:number;
    content:string;
    createTime:string;
    status:string;
    sendNickname:string;
    receiverNickname:string;

}
// export interface PersonMessage {
//     sendUid : string
//     receiverUid: string;
//     content: number;
// }

export function sendMsg(msg : Message){
    console.log(msg)
    return request.post<Message>('/message/send',
       msg,
    )
}

export function getMsgList(userId: string){
    console.log(userId)
    return request.get<number>('/message/list/'+userId)
}

export function getMsgDetails(userId: string){
    return request.get<Map<number,MessageDetail[]>>('/message/detail/'+userId)
}

export function notifi(chatId: number){
    return request.get('/message/notifi/'+chatId);
}

