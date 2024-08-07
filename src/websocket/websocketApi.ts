import {Message} from "@/api/Message";

/**
 * 给系统发送消息
 * @param msg
 * @constructor
 */
export function SystemMsg(uid:string,msg: string,nickname: string,avatar: string) {
    let SystemMsg: Message = {
        uid: uid,
        nickname:nickname,
        avatar:avatar,
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
export function UserMsg( uid:  string, nickname: string, msg: string,chatId?:string|undefined) {
    let UserMsg: Message = {
        uid: uid,
        nickname:nickname,
        // avatar:"",
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
export function GroupMsg(uid: string, nickname: string, msg: string) {
    let GroupMsg: Message = {
        uid: uid,
        nickname:"系统",
        avatar:"",
        content: msg,
        msgType: 2
    }
    return GroupMsg;
}

export function HeartMsg(uid: string) {
    let GroupMsg: Message = {
        uid: uid,
        nickname:"系统",
        avatar:"",
        content: "ping",
        msgType: -99,
        chatId:""
    }
    return GroupMsg;
}
