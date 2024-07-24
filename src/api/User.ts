import {BasePage, PageRes} from "@/types/global";
import request from "@/utils/request";
import qs from "query-string";

export interface User {
    userId : string
    nickname: string;
    email: string;
    avatar : string;
    isValid:number;
    createTime:string
}

export function getUserList(){
    return request.get<User[]>('/user/list',{
        params:{},
    })
}
