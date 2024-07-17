<template>
    <div>
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
      </div>
    </div>
</template>

<script lang="ts" setup>
const download = (url:string) => {
  console.log("下载" + url);
  window.open(url)
}
</script>

<style scoped>

</style>
