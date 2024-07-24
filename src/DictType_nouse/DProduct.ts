export interface pros {
    productId: string;
    productName: string;
    productPrice: string;
    productTime: string;
    fileUrl : string;
    uid:string,
    hasPsd:number,
    zipPsd:string
}
declare global {
    interface Window {
        api?: any;
    }
}

