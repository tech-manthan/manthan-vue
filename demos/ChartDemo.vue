<script setup lang="ts">
import Chart from '../src/components/Chart.vue';

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({ month, revenue: 30 + i * 3 }));
const series = [{ key: 'revenue', label: 'Revenue' }];
</script>

<template>
  <Chart type="area" :data="data" x="month" :series="series" :height="200" />
</template>
