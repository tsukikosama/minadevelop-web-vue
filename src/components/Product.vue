<template>
    <div class="product_content">
      <div class="product" v-for="(item,index) in pro" :key="index">
<!--        <span>{{ item }}</span>-->
<!--        <el-image>图片</el-image>-->
        <el-span>{{ item.productName }}</el-span>
        <el-span>{{item.productPrice}}</el-span>
        <el-span >
          <el-popover placement="right" width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px">Click to activate</el-button>
            </template>
            <el-table >
              <el-table-column width="150" property="date" label="date" />
              <el-table-column width="100"   property="name" label="name" />
              <el-table-column width="300" property="address" label="address" />
            </el-table>
          </el-popover>
          发布者
        </el-span>
        <el-button
            type="primary"
            link
            @click="download(item.fileUrl)"
        >
        下载
        </el-button>
        span
      </div>
      <div>
        <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            :action="submiturl"
            :multiple="false"
            accept=".rar,.zip"
            :on-success="uploadSuccess"
            limit="1"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>

          <template #tip>
            <div class="el-upload__tip">
              只支持上传压缩包
            </div>
          </template>
        </el-upload>
        <el-button @click="submitFile">提交</el-button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type { UploadInstance, UploadProps} from "element-plus";
import {ElNotification} from "element-plus";
import request from "@/utils/request";
import {pros} from "@/DictType/DProduct";
import axios from "axios";
import qs from "qs";
  const uploadRef = ref<UploadInstance>()
  let File = reactive({
    fileUrl: '',
    uid: '',
  });
  const download = (url:string) => {
    console.log("下载" + url);
    window.open(url)
  }
  let pro = reactive([] as pros[])
  onBeforeMount(() =>{
    request.get("/product/list").then((res) =>{
      pro.push(...res.data)
    })
  })
  const submiturl = 'http://localhost:8090/upload/file'
  const submitFile = () => {
    request.post("/product/save",File).then((res) =>{
  //   ElNotification.success("上传成功")
      qs.parse("asdasdasd")
    }).catch((e) =>{

    })
    // uploadRef.value!.submit();

  }
  const uploadSuccess: UploadProps['onSuccess'] = (
      response, uploadFile) => {
      // ElNotification.success("上传成功")
      // console.log(URL.createObjectURL(response))
      console.log(response)
      File.fileUrl = response
  }



  // const uploadZip = () => {
  //   request.post('/upload/file',)
  // }
</script>

<style scoped>
  .product{
    width: 200px;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  .product el-span{
    padding: 5px;
  }
  .download{
    color: #409eff;
  }
  .download:hover{
    cursor: pointer;
  }
</style>
