import {BasePage, PageDataRes, PageRes} from "@/types/global";
import request from "@/utils/request";
import qs from 'query-string';


export interface Product {
    productId: string;
    productName: string;
    productTime: string;
    uid: string;
    count: number;
    zipPsd:string;
    hasPsd: number;
    fileUrl: string;
    productPrice: string;
    tagId: string;
}

export function getItemPageReq(page: BasePage){
    return request.get<PageRes<Product>>('/product/list',{
        params:{

        },
        paramsSerializer:() =>{
            return qs.stringify(page)
        }
    })
}
