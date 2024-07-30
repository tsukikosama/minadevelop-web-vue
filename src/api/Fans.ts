import request from "@/utils/request";
import qs from "query-string";

export interface Fans {
    userId: number,
    followUserId: number,
    createTime: string;
    nickname: string;
    avatar: string;
    followNickname: string,
    followAvatar: string;
}
export interface FollowEntity{
    userId: number,
    followUserId: number,
    isFollow: number,
}
export function getFans(Uid: number){
    return request.get<Fans[]>('/fans/fansList/'+Uid)
}

export function follow(follow:FollowEntity){
    return request.post('/fans/follow/',{
        param: follow
    })
}
