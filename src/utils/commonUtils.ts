/**
 * 清楚对象的全部值
 * @param key
 */
export function clearObject(key:any){
    Object.keys(key).forEach(item => key[item] = '')
}

/**
 * 格式化日期对象
 * @param date
 * @param formatStr
 */
export const formatDate = (date: Date, format = 'yyyy-MM-dd HH:mm:ss'): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const formatMap: { [key: string]: any } = {
        yyyy: year.toString(),
        MM: month.toString().padStart(2, '0'),
        dd: day.toString().padStart(2, '0'),
        HH: hour.toString().padStart(2, '0'),
        mm: minute.toString().padStart(2, '0'),
        ss: second.toString().padStart(2, '0')
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (match) => formatMap[match])
}

