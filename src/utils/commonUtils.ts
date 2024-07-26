/**
 * 清楚对象的全部值
 * @param key
 */
export function clearObject(key:any){
    Object.keys(key).forEach(item => key[item] = '')
}

