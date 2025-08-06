<template>
  <div class="main" :style="style">
    <div class="today-use">
      <span class="today-label">今日已用:</span><span class="today-value">{{ data?.today }}</span>
    </div>

    <div class="today-bg">
      <div class="today-inner"></div>
    </div>

    <div class="last-use">
      <span class="last-label">过去已用:</span><span class="last-value">{{ data?.last }}</span>
    </div>

    <div class="last-bg">
      <div class="last-inner"></div>
    </div>

    <div class="un-used">
      <span class="un-label">流量剩余:</span><span class="un-value">{{ data?.left }}</span>
    </div>

    <div class="un-bg">
      <div class="un-inner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import calcuProgress from './utils/calcuProgress'

interface ItrafficInfo {
  today: string
  last: string
  left: string
}
const getData = (): Promise<ItrafficInfo> => window.electron.ipcRenderer.invoke('on-get-data')

const data = ref<ItrafficInfo>({
  today: '',
  last: '',
  left: ''
})

const style = computed(() => {
  const progressObj = calcuProgress(data.value!)
  return {
    '--todayPro': progressObj.today,
    '--lastPro': progressObj.last,
    '--unPro': progressObj.left
  }
})

onMounted(async () => {
  data.value = await getData()
  window.electron.ipcRenderer.on('on-data-change', (_, value) => {
    data.value = value
  })
})
</script>

<style scoped lang="scss">
.main {
  font-size: 14px;
  padding: 10px;
  .today-use {
    display: flex;
    justify-content: space-between;
    span {
      display: block;
    }
    .today-value {
      font-size: 12px;
      font-weight: 600;
      color: #f74c56;
      border: 1px solid #ff6895;
      border-radius: 3px;
      background-color: #fff3f2;
      padding: 0 2px;
    }
  }
  .last-use {
    display: flex;
    justify-content: space-between;
    span {
      display: block;
    }
    .last-value {
      font-size: 12px;
      font-weight: 600;
      color: #f87245;
      border: 1px solid #e5c319;
      border-radius: 3px;
      background-color: #fef3ea;
      padding: 0 2px;
    }
  }
  .un-used {
    display: flex;
    justify-content: space-between;
    span {
      display: block;
    }
    .un-value {
      font-size: 12px;
      font-weight: 600;
      color: #70cc42;
      border: 1px solid #7eea19;
      border-radius: 3px;
      background-color: #f7fff0;
      padding: 0 2px;
    }
  }
  .today-label::before {
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: #ff6895;
    border-radius: 5px;
    margin-right: 6px;
  }
  .last-label::before {
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: #e99f14;
    border-radius: 5px;
    margin-right: 6px;
  }
  .un-label::before {
    content: '';
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: #7eea19;
    border-radius: 5px;
    margin-right: 6px;
  }

  .today-bg {
    margin: 2px 0;
    width: 100%;
    height: 13px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    .today-inner {
      width: var(--todayPro);
      height: 100%;
      border-radius: 5px;
      background-color: #ff6895;
    }
  }

  .last-bg {
    margin: 2px 0;
    width: 100%;
    height: 13px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    .last-inner {
      width: var(--lastPro);
      height: 100%;
      border-radius: 5px;
      background-color: #e99f14;
    }
  }
  .un-bg {
    margin: 2px 0;
    width: 100%;
    height: 13px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    .un-inner {
      width: var(--unPro);
      height: 100%;
      border-radius: 5px;
      background-color: #7eea19;
    }
  }
}
</style>
