import request from "@/utils/request";
import qs from "query-string";

export interface Fans {
    userId: string | string,
    createTime: string;
    nickname: string;
    avatar: string;
    isFollow: number,
    isBackFollow:number
}
export interface FollowEntity{
    userId: string,
    followUserId: string,
    isFollow: number,
}
export function getFans(Uid: number){
    return request.get<Fans[]>('/fans/fansList/'+Uid)
}

export function getFollows(Uid: number){
    return request.get<Fans[]>('/fans/followList/'+Uid)
}
export function followUserByUid(follow:FollowEntity){
    return request.post('/fans/follow', follow
    )
}

export function notFollowUserByUid(follow: FollowEntity){
    return request.post('/fans/notFollow', follow)
}
