<template>
  <div>
    up:
    <UserItem :type=2>

    </UserItem>
  </div>
</template>

<script lang="ts" setup>
   import UserItem from "@/components/follow/UserItem.vue";
</script>

<style scoped>
  .user_item {
    list-style: none;
  }
</style>
