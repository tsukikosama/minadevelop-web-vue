import {Message} from "@/api/Message";

/**
 * 给系统发送消息
 * @param msg
 * @constructor
 */
export function SystemMsg(msg: string) {
    let SystemMsg: Message = {
        msgSend: -1,
        msgReceiver: -1,
        msgContent: msg,
        msgType: 3,

    }
    return SystemMsg;
}

/**
 * 封装成用户消息
 * @param senduid
 * @param receverUid
 * @param msg
 * @constructor
 */
export function UserMsg( sendUid: number | string, receverUid: number | string, msg: string,chatId?: number | string,sendNickname?:string ,receiverNickname?:string) {
    let UserMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        msgContent: msg,
        msgType: 1,
        chatId : chatId,
        sendNickname: sendNickname,
        receiverNickname: receiverNickname,
    }
    return UserMsg;
}

/**
 * 封装成群消息
 * @param sendUid
 * @param receverUid
 * @param msg
 * @constructor
 */
export function GroupMsg(sendUid: number, receverUid: number, msg: string) {
    let GroupMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        msgContent: msg,
        msgType: 2
    }
    return GroupMsg;
}

export function HeartMsg(uid: number | string) {
    let GroupMsg: Message = {
        msgSend: uid,
        msgReceiver: -1,
        msgContent: "ping",
        msgType: -99
    }
    return GroupMsg;
}
