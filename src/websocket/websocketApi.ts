import {Message} from "@/api/Message";

/**
 * 给系统发送消息
 * @param msg
 * @constructor
 */
export function SystemMsg(msg: string) {
    let SystemMsg: Message = {
        msgSend: "",
        msgReceiver: "",
        content: msg,
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
export function UserMsg( sendUid:  string, receverUid: string, msg: string,chatId?:string|undefined) {
    let UserMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        content: msg,
        msgType: 1,
        chatId : chatId,

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
export function GroupMsg(sendUid: string, receverUid: string, msg: string) {
    let GroupMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        content: msg,
        msgType: 2
    }
    return GroupMsg;
}

export function HeartMsg(uid: string) {
    let GroupMsg: Message = {
        msgSend: uid,
        msgReceiver: "-1",
        content: "ping",
        msgType: -99
    }
    return GroupMsg;
}
