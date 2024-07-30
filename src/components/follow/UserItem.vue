<template>
  <ul class="user_item">
    用户列表
    <li v-for="(item,index) in followList" :key="index">
      <div class="item">
        <div class="item_left">
          <el-avatar :size="'large'"></el-avatar>
        </div>
        <div class="item_center">
            <div>
              {{item.followNickname}}
            </div>
            <div>
              这个人很懒什么都没留下.
            </div>
        </div>
        <div class="item_right">
            <div>
              <el-button @click="followToUser(item.userId)">
                关注
              </el-button>
              <el-button>
                取消关注
              </el-button>

            </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">

import follow from "@/components/follow/Follow.vue";
import {onMounted, ref} from "vue";
import {Fans, Follow, FollowEntity, getFans} from "@/api/Fans";
import {useUserStore} from "@/store";
import {ElMessage} from "element-plus";
import Item from "@/components/Item.vue";

const props = defineProps(
    {
      type: {
        type: Number,
        required: true
      }
    }
)
const followList = ref<Fans[]>([]);
const userStatus = useUserStore();
const followUser = ref<FollowEntity>();
onMounted(async () => {
  if (props.type == 1){
    //fans
    if (userStatus.user!.userId) {
      const {data} = await getFans(userStatus.user!.userId as number)
      followList.value = data.records
      // followUser.value?.userId = userStatus.user!.userId as number
    } else {
      ElMessage.error("用户未登录")
    }
  }else{
    //follow
  }

})

const followToUser = async (uid : number) => {
  // followUser.value?.followUserId = uid as number;
  //   await follow();
}
</script>

<style scoped>
.user_item {
  list-style: none;
  height: 100px;
}
.user_item li{
  width: 80vw;
  height: 100px;
}
.item{
  display: flex;
  padding: 5px;
  align-items: center;
  height: 100px;
}
.item_left{
  width: 10vw;
  background-color: #39c522;
}
.item_right{
  width: 10vw;
  background-color: #00f4ab;
}
.item_center{
  width: 60vw;
  background-color: #409eff;
}
</style>
