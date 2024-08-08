import request from "@/utils/request";



export interface ChatRelationForm{
    sendUid: string;
    receiverUid: string;
}

export interface ChatRelation{
    nickname: string,
    avatar: string,
    uid: string,
    chatId:string,
    unread?:number
}

export function createChatRelation(relation:ChatRelationForm){
    return request.post<string>('/chat/relation',relation);
}

export function getChatRelationByChatId(chatId:string,uid:string){
    return request.get<ChatRelation>('/chat/chatIdRelation/'+chatId+"/"+uid)
}

export function getAllChatRelation(uid:string){
    return request.get<string[]>('/chat/relationAll/'+uid)
}
