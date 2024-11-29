<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="nss.png" style="width: 250px; height: auto">
    <!-- Canvas element for Chart.js -->
    <canvas ref="salesChart"></canvas>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { Chart } from 'chart.js'

const startDate = '2024.01.01' // eller generer dynamisk
const endDate = '2024.12.31' // eller generer dynamisk
const FETCH_PROSJEKT_URL = `${process.env.API}/Salgsstatistikk/Retrieve/${startDate}/${endDate}`

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const salesChartRef = ref(null)

    onMounted(() => {
      fetchSalesData().then(data => {
        if (salesChartRef.value) {
          createChart(salesChartRef.value, data)
        }
      })
    })
    async function fetchSalesData () {
      try {
        const response = await fetch(FETCH_PROSJEKT_URL)
        if (!response.ok) throw new Error('Network response was not ok')
        return await response.json()
      } catch (error) {
        console.error('Error fetching sales data:', error)
        return [] // Return empty array in case of error
      }
    }

    function createChart (canvasElement, salesData) {
      const ctx = canvasElement.getContext('2d')
      const labels = salesData.map(item => item.label)
      const values = salesData.map(item => item.value)

      Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Salgsstatistikk',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    return {
      salesChartRef
    }
  }
})
</script>
