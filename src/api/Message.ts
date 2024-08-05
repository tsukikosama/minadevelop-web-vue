import request from "@/utils/request";
import qs from 'query-string';
import {messageType} from "element-plus";

export interface Message {
    msgSend?: string
    msgReceiver?: string;
    content: string;
    msgType: number,
    chatId?: string
}

export interface MessageBox {
    chatId: string,
    chatNickname: string,
    chatUid: string,

    list: Message[]
}

export interface MessageDetail {
    id: string;
    messageId: string;
    sendUid: string;
    receiverUid: string;
    content: string;
    createTime: string;
    status: string;
    chatId: string;
    sendNickname: string;
    receiverNickname: string;
}


export function getMsgList(userId: string) {
    console.log(userId)
    return request.get<number>('/message/list/' + userId)
}


export function notifi(chatId: number) {
    return request.get('/message/notifi/' + chatId);
}

export function getMsgDetail(uid: number) {
    return request.get<string, MessageDetail[]>('/message/detail/'+uid)
}
