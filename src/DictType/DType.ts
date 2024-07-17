export interface Type {
    typeId : number,
    typeName : string,
    createTime : string,
    check:boolean
}

export interface  Tag {
    tagId : number,
    typeId : number,
    tagName : string
    createTime : string
    check:boolean
}
