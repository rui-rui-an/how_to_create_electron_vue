<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import { onMounted } from 'vue'
onMounted(async () => {
  let res = await window.myApi.handleSend('liaoruiruirurirui')
  console.log(res)
})
const toMin = () => {
  window.myApi.windowMin()
}
const toBig = () => {
  window.myApi.windowMax()
}
const toClose = () => {
  window.myApi.windowClose()
}
</script>

<template>
  <main>
    <div class="hearder">
      <span @click="toMin">最小化</span>
      <span @click="toBig">最大化</span>
      <span @click="toClose">关闭</span>
    </div>
    <div class="main">主要内容</div>
    <!-- <TheWelcome /> -->
  </main>
</template>

<style scoped>
.hearder {
  -webkit-app-region: drag;
  background-color: #ccc;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.hearder span {
  margin: 0 16px;
  border: 1px solid rgb(35, 34, 34);
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.main {
  height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
