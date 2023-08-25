<template>
  <a-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
  >
    <template #title="{ value: val, title }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree-select>
  <div>
    <a-steps
      label-placement="vertical"
      :current="1"
      :items="[
        {
          title: 'Finished',
          description,
        },
        {
          title: 'In Progress',
          description,
          subTitle: 'Left 00:00:08',
        },
        {
          title: 'Waiting',
          description,
        },
      ]"
    ></a-steps>
    <a-steps
      v-model:current="current"
      status="error"
      :items="[
        {
          title: 'Finished',
          description,
        },
        {
          title: 'In Process',
          description,
        },
        {
          title: 'Waiting',
          description,
        },
      ]"
    ></a-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import type { TreeSelectProps } from "ant-design-vue";
const value = ref<string>();

const current = ref<number>(1);
const description = "This is a description.";
const treeData = ref<TreeSelectProps["treeData"]>([
  {
    title: "parent 1",
    value: "parent 1",
    children: [
      {
        title: "parent 1-0",
        value: "parent 1-0",
        children: [
          {
            title: "my leaf",
            value: "leaf1",
          },
          {
            title: "your leaf",
            value: "leaf2",
          },
        ],
      },
      {
        title: "parent 1-1",
        value: "parent 1-1",
      },
    ],
  },
]);
watch(value, () => {
  console.log(value.value);
});
</script>
