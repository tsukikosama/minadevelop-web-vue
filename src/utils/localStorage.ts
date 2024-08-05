export function getLocalStorage(key:string){
    if(!localStorage.getItem(key)){
        return null;
    }
    let date = localStorage.getItem(key);

    return JSON.parse(date!);
}

export function setLocalStorage(key: string, value:any){
    let date = JSON.stringify(value);
    localStorage.setItem(key, date);
}


