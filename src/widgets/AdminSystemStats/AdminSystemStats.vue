<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>

      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-dot primary"></span>
          {{ legendPrimary }}
        </div>
        <div class="legend-item">
          <span class="legend-dot secondary"></span>
          {{ legendSecondary }}
        </div>
      </div>
    </div>

    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const props = defineProps({
  title: String,
  labels: Array,
  primaryData: Array,
  secondaryData: Array,
  legendPrimary: String,
  legendSecondary: String
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.legendPrimary,
      data: props.primaryData,
      backgroundColor: "#EC8FB0",
      borderRadius: 12,
      borderSkipped: false,
      maxBarThickness: 18
    },
    {
      label: props.legendSecondary,
      data: props.secondaryData,
      backgroundColor: "#F7C8D9",
      borderRadius: 12,
      borderSkipped: false,
      maxBarThickness: 18
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#2A2A2A",
      padding: 10,
      borderRadius: 8
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#777",
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: "rgba(0,0,0,0.05)"
      },
      ticks: {
        color: "#777",
        font: {
          size: 12
        }
      }
    }
  }
};

</script>


<style scoped>
.chart-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: 350px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.chart-title {
  font-size: 20px;
  font-weight: 600;
}

.chart-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #777;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.primary {
  background: #EC8FB0;
}

.secondary {
  background: #F7C8D9;
}

/* 📱 Планшет */
@media (max-width: 1024px) {
  .chart-card {
    height: 300px;
    padding: 20px;
  }

  .chart-title {
    font-size: 18px;
  }
}

/* 📱 Телефон */
@media (max-width: 768px) {
  .chart-card {
    height: 260px;
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .chart-title {
    font-size: 16px;
  }

  .chart-legend {
    gap: 12px;
  }

  .legend-item {
    font-size: 12px;
  }
}

/* 📱 Маленькие телефоны */
@media (max-width: 480px) {
  .chart-card {
    height: 220px;
  }

  .chart-title {
    font-size: 15px;
  }
}
</style>

