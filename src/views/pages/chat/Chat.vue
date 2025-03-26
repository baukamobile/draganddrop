<script lang="ts" setup>
import PageWrapper from '@/components/PageWrapper.vue'
import StatisticsSection from '@/components/pages/dashboard/StatisticsSection.vue'
import SalesSection from '@/components/pages/dashboard/SalesSection.vue'
import LatestSection from '@/components/pages/dashboard/LatestSection.vue'
import Button from '@/components/Button.vue'

import { Search } from '@element-plus/icons-vue' // Import the specific icon you need
import { ref } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
  import type { TimelineItemProps } from 'element-plus'

  import { Calendar } from '@element-plus/icons-vue'
    import dayjs from 'dayjs'
  
  const valuedate = ref(Date.now() + 1000 * 60 * 60 * 7)
  const valuedate1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2)
  const valuedate2 = ref(dayjs().add(1, 'month').startOf('month'))
  
  function reset() {
    value1.value = Date.now() + 1000 * 60 * 60 * 24 * 2
  }
  
  interface ActivityType extends Partial<TimelineItemProps> {
    content: string
  }
  
  const activities: ActivityType[] = [
    {
      content: 'Custom icon',
      timestamp: '2018-04-12 20:46',
      size: 'large',
      type: 'primary',
      icon: MoreFilled,
    },
    {
      content: 'Custom color',
      timestamp: '2018-04-03 20:46',
      color: '#0bbd87',
    },
    {
      content: 'Custom size',
      timestamp: '2018-04-03 20:46',
      size: 'large',
    },
    {
      content: 'Custom hollow',
      timestamp: '2018-04-03 20:46',
      type: 'primary',
      hollow: true,
    },
    {
      content: 'Default node',
      timestamp: '2018-04-03 20:46',
    },
  ]
const value1 = ref()
const value2 = ref()
// import { ref } from 'vue'
  
  interface Option {
    key: number
    label: string
    disabled: boolean
  }
  
  const generateData = () => {
    const data: Option[] = []
    for (let i = 1; i <= 15; i++) {
      data.push({
        key: i,
        label: `Option ${i}`,
        disabled: i % 4 === 0,
      })
    }
    return data
  }
  
  const data = ref<Option[]>(generateData())
  const value = ref([])
</script>

<template>
    <PageWrapper>
        <template #header>
            <div
                class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <h2 class="text-xl font-semibold leading-tight">Чаты</h2>
                
            </div>
            <el-icon><Search /></el-icon> <!-- Use the imported Search icon -->
            <!-- <template> -->
  <div class="example-basic">
    <el-time-picker v-model="value1" placeholder="Arbitrary time" />
    <el-time-picker
      v-model="value2"
      arrow-control
      placeholder="Arbitrary time"
    />
  </div>
  <el-transfer v-model="value" :data="data" />
<!-- </template> -->

<!-- <script lang="ts" setup>

</script> -->

<el-timeline style="max-width: 600px">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
    <el-row>
      <el-col :span="8">
        <el-countdown title="Start to grab" :valuedate="value" />
      </el-col>
      <el-col :span="8">
        <el-countdown
          title="Remaining VIP time"
          format="HH:mm:ss"
          :valuedate="valuedate1"
        />
        <el-button class="countdown-footer" type="primary" @click="reset">
          Reset
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-countdown format="DD [days] HH:mm:ss" :value="valuedate2">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              <el-icon style="margin-right: 4px" :size="12">
                <Calendar />
              </el-icon>
              Still to go until next month
            </div>
          </template>
        </el-countdown>
        <div class="countdown-footer">{{ valuedate2.format('YYYY-MM-DD') }}</div>
      </el-col>
    </el-row>
        </template>
    </PageWrapper>
</template>
<style>
.example-basic .el-date-editor {
  margin: 8px;
}
</style>

<!-- <template>

  </template>
  
  <script lang="ts" setup>
 
  </script> -->
  



  <!-- <template>
    
  </template> -->
  
  <!-- <script lang="ts" setup>
  
  </script>
   -->
  
  <style scoped>
  .el-col {
    text-align: center;
  }
  
  .countdown-footer {
    margin-top: 8px;
  }
  </style>
  