

export interface BasePage {
    current: number;
    pageSize: number;
    total?: number;
}
export interface PageDataRes<T> {
    data: T

}
export interface PageRes<T> {
    // data: any;
    errorMsg : string;
    success : boolean;
    total : number;
    code: number;
    records: T[]
}
