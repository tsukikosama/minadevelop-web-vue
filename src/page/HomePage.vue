<template>
  <div>

    <MyHeader></MyHeader>
    <div class="cc_flex-hr">
      <router-view></router-view>
<!--      <Item></Item>-->
<!--      <HotInfo></HotInfo>-->
    </div>
  </div>

</template>

<script lang="ts" setup>

import MyHeader from "../components/MyHeader.vue";
import Content from "../components/Login.vue";
import Item from "@/components/Item.vue";
import HotInfo from "@/components/HotInfo.vue";
  name:"home"
  component:{
    MyHeader
  }


</script>

<style  scoped>
  .cc_flex-hr{
    width: 80vw;
    margin: 10px auto;
    display: flex;
  }
</style>
