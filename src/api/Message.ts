import request from "@/utils/request";
import qs from 'query-string';
import {messageType} from "element-plus";

export interface Message {
    uid:string,
    avatar?:string,
    nickname:string
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


/**
 * 获取消息列表
 * @param userId
 */
export function getMsgList(userId: string) {
    console.log(userId)
    return request.get<number>('/message/list/' + userId)
}

/**
 * 获取维度消息的数量
 * @param chatId
 */
export function notifi(chatId: string) {
    return request.get('/message/notifi/' + chatId);
}

// export function getMsgDetail(uid: number) {
//     return request.get<string, MessageDetail[]>('/message/detail/'+uid)
// }

export function getUnReadMessage(uid: string) {
    return request.get<Map<string,Message[]>>('/message/unread/'+uid)
}
