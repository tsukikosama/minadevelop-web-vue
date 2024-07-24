<template>
  <div class="cc_flex">
    <div >
      类型分类: <el-radio-group v-model="checkedType"  size="large">
      <el-radio-button v-for="(item,index) in types" :key="index" :label=item.typeName :value=item.typeId @change="checkType(item)" />

    </el-radio-group>
      <!--    类型分类:<el-check-tag v-for="(item,index) in types" :key="index" :checked="item.check" types="primary" >-->
      <!--      {{item.typeName}}-->
      <!--    </el-check-tag>-->
    </div>
    <div>

      标签分类:
      <el-radio-group v-model="checkedTag"  size="large">
        <el-radio-button v-for="(item,index) in tags" :key="index" :label=item.tagName :value=item.tagName @change="showTag(item)" />
      </el-radio-group>

    </div>
    <div>
      <Item></Item>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {ComponentInternalInstance, getCurrentInstance, onBeforeMount, reactive, ref} from "vue";
import {Tag, Type} from "@/DictType_nouse/DType";
import request from "@/utils/request";
import {ElNotification} from "element-plus";
import Item from "@/components/Item.vue";


    const { appContext } = getCurrentInstance() as ComponentInternalInstance;
    let types:Array<Type> = reactive([])

    /**
     *  获取全部的type分类
     */
    let tags:Array<Tag> = reactive([]);
    onBeforeMount(() => {
       request.get('/type/list').then((res) =>{

         types.push(...res.data)
       }).catch((e) =>{
         ElNotification.error("网络异常")
       })
    })

    let checkedType = ref({})
    let checkedTag = ref({})

    const checkType = (item:any) => {
      console.log(item.typeId)
      checkedType.value = item.typeId
      tags.splice(0,tags.length)
      //发送请求获取tag子标签
      request.get('/tag/list/'+item.typeId).then((res) => {
          tags.push(...res.data)
      })
    }
    const showTag = (item:any) => {
      checkedType.value = item.typeId
      request.get("/tag/list/"+item.tagId).then((res) => {
          if (res.data){
            //不为空触发全局事件
            appContext.config.globalProperties.$mitt.emit('checkItem',res.data)
          }
      })
    }
</script>

<style scoped>
    .cc_flex{
      display: flex;
      flex-direction: column;
    }
    .cc_flex div{
      margin: 5px;
    }
</style>
