import request from "@/utils/request";
import qs from 'query-string';

export interface Message {
    msgSend : string
    msgReceiver: string;
    msgContent: string;
    msgType:number
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
    return request.get('/message/detail/'+userId)
}

