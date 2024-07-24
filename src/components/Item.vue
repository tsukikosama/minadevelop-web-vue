<template>
  <div class="cc_content">
    <div class="cc_item" v-for="i in ItemList">
      <div class="cc_left">
        <el-span>titile</el-span>
        <el-span>desc</el-span>
        <div>
          <el-span>type</el-span>
          <el-span>tag</el-span>
        </div>
        <div>
          <el-span>auth</el-span>
          <el-span>time</el-span>
        </div>
      </div>
      <div class="cc_right">
          <el-image></el-image>
      </div>
    </div>
    <el-button @click=" () => {
      console.log('fa')
      viewVisiable = !viewVisiable
    }">
      起飞
    </el-button>
      <AboutView
        v-model:visible="viewVisiable"
      >

      </AboutView>

    <el-pagination
        small
        background
        layout="prev, pager, next"
        class="cc_page"
        :page-count="30"
        @current-change="currentPage"
    />
  </div>

</template>

<script setup lang="ts">
    import {Item} from "@/DictType_nouse/DItem";
    import {ComponentInternalInstance, getCurrentInstance, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
    import request from "@/utils/request";
    import qs from "qs";
    import {BasePage} from "@/types/global";
    import {getItemPageReq, Product} from "@/api/Item";
    import AboutView from "@/views/AboutView.vue";


    const viewVisiable = ref(false);
    const ItemList = ref<Product[]>([])


    const { appContext } = getCurrentInstance() as ComponentInternalInstance;

    const page : BasePage = reactive({
      current : 1,
      pageSize : 10,
    })
      // appContext.config.globalProperties.$mitt.on('checkItem', (res:Item[]) => {
      //   ItemList.push(...res)
      // })
    onBeforeMount(() => {
      // request.get('/product/list',qs.parse(page)).then((res) => {
      //     ItemList.push(...res.data)
      // }).catch((e) => {
      //     console.log(e)
      // })
      fetchData()
    })

    const currentPage = (current : number)=>{
        page.current = current
        fetchData()
    }

    const fetchData = async ()=>{
       const  { data  } =  await getItemPageReq(page);
       console.log(data.records)
       ItemList.value = data.records
       // ItemList.value = data.Records

    }


</script>

<style scoped>
.cc_content{
  width: 80%;
  margin: 10px auto;
}
 .cc_item{
   display: flex;
   //flex-direction: column;
   min-width: 500px;
   max-width: 800px;
   justify-content: space-between;
   margin: 10px;
 }
 .cc_left{
    display: flex;
    flex-direction: column;
  }
 .cc_page{
   display: flex;
   min-width: 500px;
   max-width: 800px;
   justify-content: center;
 }
</style>
