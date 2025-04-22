<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
</script>
<template>
   <PageWrapper>
    <div class="demo-datetime-picker">
    <div class="line" />
    <div class="block">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD HH:mm:ss"
        date-format="YYYY/MM/DD ddd"
        time-format="A hh:mm:ss"
      />
    </div>
  </div>
    </PageWrapper>
</template>
<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
}
.line {
  /* width: 1px; */
  background-color: var(--el-border-color);
}
</style>