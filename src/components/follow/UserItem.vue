<template>
  <ul class="user_item">
    用户列表
    <li v-for="(item,index) in followList" :key="index">
      <div class="item">
        <div class="item_left">
          <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
          >
            <el-span>{{item.nickname}}</el-span>
            <el-button>关注</el-button>
            <el-button @click="sendMsg(item)">私信</el-button>
            <template #reference>
              <el-avatar :size="'large'"></el-avatar>
            </template>
          </el-popover>

        </div>
        <div class="item_center">
          <div>
            {{ item.nickname }}
          </div>
          <div>
            这个人很懒什么都没留下.
          </div>
        </div>
        <div class="item_right">
          <div>
<!--            v-bind:type="item.isBackFollow == 1 ? 'success' : 'danger'"-->
            <el-button @click="followToUser(item)" v-bind:type="item.isBackFollow == 1 ? 'success' : 'danger'">
              关注
            </el-button>
<!--            <el-button @click=notFollow(item)>-->
<!--              取消关注-->
<!--            </el-button>-->

          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">

import follow from "@/components/follow/Follow.vue";
import {onMounted, ref,getCurrentInstance} from "vue";
import {Fans, FollowEntity, followUserByUid, getFans, getFollows, notFollowUserByUid} from "@/api/Fans";
import {useUserStore} from "@/store";
import {ElMessage} from "element-plus";
import Item from "@/components/Item.vue";
import {ChatRelationForm, createChatRelation} from "@/api/Chat";


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
const followUser = ref<FollowEntity>({
  followUserId: -1,
  userId: -1,
  isFollow: -1
});
const relationForm = ref<ChatRelationForm>({
  sendUid: "",
  receiverUid: "",
})
const globalProperties = getCurrentInstance()!.appContext.config.globalProperties;
onMounted(async () => {
  // console.log("type:",props.type)
  if (props.type == 1) {
    //fans
    if (userStatus.user!.userId) {
      const {data} = await getFans(userStatus.user!.userId as number)
      followList.value = data.records
      followUser.value!.userId = userStatus.user!.userId as number
    } else {
      ElMessage.error("用户未登录")
    }
  } else {
    //follow
    if (userStatus.user!.userId) {
      const {data} = await getFollows(userStatus.user!.userId as number)
      followList.value = data.records
      followUser.value!.userId = userStatus.user!.userId as number
    } else {
      ElMessage.error("用户未登录")
    }
  }

})

const followToUser = async (user: Fans) => {
  user.isBackFollow = user.isBackFollow^1
  followUser.value!.followUserId = user.userId as number;
  followUser.value.isFollow = user.isFollow^1;
  // followUser.value!.isFollow = user;
  await followUserByUid(followUser.value!);
  if (user.isBackFollow == 1 ){
    ElMessage.success("关注成功")
  }else{
    ElMessage.success("取消关注成功")
  }
}
const sendMsg = async (uid:Fans) => {
  // console.log(uid)
  if (userStatus.user!.userId) {
    relationForm.value!.receiverUid = uid.userId as string;
    relationForm.value!.sendUid = userStatus.user!.userId as string
    const {data} = await createChatRelation(relationForm.value);
    // console.log("data",data);
    globalProperties.$router.push({path: '/chat', query: {
        chatId: data,
        // chatUser:JSON.stringify(uid)
    }
    })
  } else {
    ElMessage.error("用户未登录")
  }
}
</script>

<style scoped>
.user_item {
  list-style: none;
  height: 100px;
}

.user_item li {
  width: 80vw;
  height: 100px;
}

.item {
  display: flex;
  padding: 5px;
  align-items: center;
  height: 100px;
}

.item_left {
  width: 10vw;
  background-color: #39c522;
}

.item_right {
  width: 10vw;
  background-color: #00f4ab;
}

.item_center {
  width: 60vw;
  background-color: #409eff;
}
</style>
