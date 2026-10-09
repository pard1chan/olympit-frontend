import { Chart } from "chart.js/auto";
import { onMounted, onUnmounted, ref, watch } from "vue";

export function useChart(canvasRef, config) {
  const chartInstance = ref(null);

  const createChart = () => {
    if (!canvasRef.value || chartInstance.value) return;

    const ctx = canvasRef.value.getContext("2d");
    chartInstance.value = new Chart(ctx, config);
  };

  const destroyChart = () => {
    if (chartInstance.value) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }
  };

  const updateChart = () => {
    destroyChart();
    createChart();
  };

  onMounted(createChart);
  onUnmounted(destroyChart);

  if (typeof config === "object" && "value" in config) {
    watch(
      () => config.value,
      (newConfig) => {
        if (chartInstance.value) {
          chartInstance.value.data.datasets[0].data = [
            newConfig.data.datasets[0].data[0],
            100 - newConfig.data.datasets[0].data[0],
          ];
          chartInstance.value.data.datasets[0].backgroundColor =
            newConfig.data.datasets[0].backgroundColor;
          chartInstance.value.update();
        }
      },
    );
  }

  return {
    chartInstance,
    updateChart,
    destroyChart,
  };
}
