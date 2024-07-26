export function getLocalStorage(key:string){
    if(!localStorage.getItem(key)){
        return null;
    }
    let date = localStorage.getItem(key);

    return JSON.parse(date!);
}

export function setLocalStorage(key: string, value:any){
    console.log("缓存成功")
    console.log("key" + key)
    console.log("value" + value)
    let date = JSON.stringify(value);
    localStorage.setItem(key, date);
}
