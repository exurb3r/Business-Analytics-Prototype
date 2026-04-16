<template>
  <div style="display: flex; gap: 1.5rem; padding: 0 0 1.5rem;">

    <!-- Weekly Attendance Bar + Line Chart -->
    <div style="flex: 2; background: #151c2e; border-radius: 14px; border: 1px solid #1e2d4a; padding: 1.5rem;">
      <h3 style="color: #e4eaf8; margin: 0 0 1rem; font-size: 14px; font-weight: 600;">Weekly Attendance Overview</h3>
      <apexchart type="bar" :options="barOptions" :series="barSeries" height="260" />
    </div>

    <!-- Today's Breakdown Donut -->
    <div style="flex: 1; background: #151c2e; border-radius: 14px; border: 1px solid #1e2d4a; padding: 1.5rem;">
      <h3 style="color: #e4eaf8; margin: 0 0 1rem; font-size: 14px; font-weight: 600;">Today's Status Breakdown</h3>
      <apexchart type="donut" :options="donutOptions" :series="donutSeries" height="260" />
    </div>

  </div>
</template>

<script setup>
/* Weekly bar chart — Log-ins (bar) + Late (line) */
const barSeries = [
  { name: "Log-ins",   type: "bar",  data: [82, 91, 85, 87, 79, 44, 21] },
  { name: "Late",      type: "bar",  data: [10, 7,  11, 14, 13, 6,  2]  },
  { name: "Absent",    type: "bar",  data: [8,  4,  9,  9,  11, 30, 49] },
  { name: "Overtime",  type: "line", data: [18, 22, 19, 22, 15, 5,  2]  },
  { name: "Undertime", type: "line", data: [8,  5,  9,  11, 13, 4,  1]  },
];

const barOptions = {
  chart: {
    background: "transparent",
    toolbar: { show: false },
    stacked: false,
  },
  colors: ["#1e6bff", "#e8a020", "#f04040", "#1dbf8f", "#a855f7"],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: { style: { colors: "#6b80a8", fontSize: "12px" } },
    axisBorder: { color: "#1e2d4a" },
    axisTicks: { color: "#1e2d4a" },
  },
  yaxis: [
    {
      title: { text: "Headcount", style: { color: "#6b80a8" } },
      labels: { style: { colors: "#6b80a8" } },
    },
    {
      opposite: true,
      title: { text: "OT / UT", style: { color: "#6b80a8" } },
      labels: { style: { colors: "#6b80a8" } },
    },
  ],
  grid: { borderColor: "#1e2d4a" },
  legend: { labels: { colors: "#c5d4f0" } },
  tooltip: { theme: "dark" },
  stroke: {
    width: [0, 0, 0, 2, 2],
    curve: "smooth",
  },
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: "55%" }
  },
  dataLabels: { enabled: false },
};

/* Donut — today's statuses */
const donutSeries = [87, 14, 9, 22, 11];
const donutOptions = {
  labels: ["Present", "Late", "Absent", "Overtime", "Undertime"],
  colors: ["#1e6bff", "#e8a020", "#f04040", "#1dbf8f", "#a855f7"],
  chart: { background: "transparent" },
  legend: { labels: { colors: "#c5d4f0" }, position: "bottom" },
  tooltip: { theme: "dark" },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            color: "#c5d4f0",
            fontSize: "13px",
            formatter: () => "143"
          },
          value: {
            color: "#ffffff",
            fontSize: "22px",
            fontWeight: "700",
          }
        }
      }
    }
  }
};
</script>