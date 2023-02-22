<template>
  <view
    class="yky-icon"
    :class="computedIconClass"
    :style="computedIconStyle"
    @click="onIconClick"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import mergeClass from '@/utils/mergeClass';
import mergeStyle from '@/utils/mergeStyle';
import addUnit from '@/utils/addUnit';

interface IconProps {
  // 自定义类名
  customClass?: string | Array<any> | Record<string, any>;
  // 自定义样式
  customStyle?: string | Array<any> | Record<string, any>;
  // 类名前缀
  prefix?: string;
  // 图标名称
  name: string;
  // 图标颜色
  color?: string;
  // 图标大小
  size?: number | string;
}

const props = withDefaults(defineProps<IconProps>(), {
  prefix: 'iconfont'
});
const emits = defineEmits(['click']);

const computedIconClass = computed(() => {
  const prefix = props.prefix || 'iconfont';
  const iconClass = props.name ? `${prefix}-${props.name}` : '';
  return mergeClass(prefix, iconClass, props.customClass);
});

const computedIconStyle = computed(() => {
  return mergeStyle(
    {
      fontSize: addUnit(props.size),
      color: props.color
    },
    props.customStyle
  );
});

function onIconClick(event: any) {
  emits('click', event);
}
</script>

<style lang="scss">
@import 'index.scss';
</style>
