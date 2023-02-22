<template>
  <view> hello world </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Api } from '@/utils/request';

onMounted(async () => {
  const response = await Api.get(
    'https://www.fastmock.site/mock/44fe0cb9dc5cc6efe04273590f7a2328/v1/api/getUserInfo'
  );
  console.log(response);
});
</script>

<style lang="scss"></style>
