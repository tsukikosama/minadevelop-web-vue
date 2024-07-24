import {Message} from "@/api/Message";

/**
 * 给系统发送消息
 * @param msg
 * @constructor
 */
export function SystemMsg(msg: string) {
    let SystemMsg: Message = {
        msgSend: "system",
        msgReceiver: "",
        msgContent: msg,
        msgType: 3
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
export function UserMsg(sendUid: string, receverUid: string ,msg: string){
    let UserMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        msgContent: msg,
        msgType: 1
    }
    return UserMsg;
}

/**
 * 反正成群消息
 * @param sendUid
 * @param receverUid
 * @param msg
 * @constructor
 */
export function GroupMsg(sendUid: string, receverUid: string ,msg: string){
    let GroupMsg: Message = {
        msgSend: sendUid,
        msgReceiver: receverUid,
        msgContent: msg,
        msgType: 2
    }
    return GroupMsg;
}
