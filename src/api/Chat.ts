import {BasePage, PageDataRes, PageRes} from "@/types/global";
import request from "@/utils/request";
import qs from 'query-string';
import {MessageDetail} from "@/api/Message";


export interface ChatRelationReq {
    chatId: number;
    sendId: number;
    receiverId: number;
    content: string;
}

export function getChatRelationByUid(uid: string){
    return request.get<MessageDetail[]>('/chat/relation/'+uid);
}
