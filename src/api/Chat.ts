import {BasePage, PageDataRes, PageRes} from "@/types/global";
import request from "@/utils/request";
import qs from 'query-string';
import {MessageDetail} from "@/api/Message";


export interface ChatRelationReq {
    chatId: number;
    sendUid: number;
    receiverUid: number;
    receiverNickname: string;
    receiverAvatar: string;
    // content: string;
}
export interface ChatRelationForm{
    sendUid: string;
    receiverUid: string;
}

export function getChatRelationByUid(uid: string){
    return request.get<MessageDetail[]>('/chat/relation/'+uid);
}

export function createChatRelation(relation:ChatRelationForm){
    return request.post<string>('/chat/relation',relation);
}

export function getChatRelationByChatId(chatId:string){
    return request.get<ChatRelationReq>('/chat/chatIdRelation/'+chatId)
}
