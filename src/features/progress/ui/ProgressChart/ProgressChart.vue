<template>
  <div class="progress-chart">
    <div class="progress-chart__container" :style="{ width: `${size}px`, height: `${size}px` }">
      <canvas ref="chartCanvas"></canvas>
      <div class="progress-chart__center">
        <div v-if="showPercentage" class="progress-chart__percentage h2">
          {{ Math.round(chartData.progress) }}%
        </div>
      </div>
    </div>

    <h3 class="progress-chart__title h2">{{ chartData.subject }}</h3>
  </div>
</template>

<script setup>
import { useChart } from '@/shared/lib/charts/useChart';
import { computed, ref } from 'vue';



const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      subject: '',
      progress: 0,
      color: '#4CAF50',
      backgroundColor: '#E0E0E0'
    })
  },
  size: {
    type: Number,
    default: 200
  },
  showPercentage: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null);

const chartConfig = computed(() => ({
  type: 'doughnut',
  data: {
    datasets: [{
      data: [props.chartData.progress, 100 - props.chartData.progress],
      backgroundColor: [
        '#ff7aa2', // Filled color (green)
        '#ffc4d6',
        '#6d23b6'
      ],
      borderWidth: 6,
      cutout: '70%'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
}));



useChart(chartCanvas, chartConfig.value)
</script>

<style scopedc lang="scss" scoped>
.progress-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.progress-chart__container {
  position: relative;
  cursor: pointer;
}

.progress-chart__container canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Центрирование процентов */
.progress-chart__center {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  /* Чтобы можно было кликать на график */
}
</style>