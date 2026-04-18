<script setup>
import { ref, onMounted } from "vue";

/* =========================
   STATE
========================= */
const barSeries = ref([
  { name: "Log-ins",   type: "bar",  data: [] },
  { name: "Late",      type: "bar",  data: [] },
  { name: "Absent",    type: "bar",  data: [] },
  { name: "Overtime",  type: "line", data: [] },
  { name: "Undertime", type: "line", data: [] },
]);

const donutSeries = ref([]);

/* =========================
   FETCH FROM BACKEND
========================= */
const fetchDashboard = async () => {
  try {
    const res = await fetch("http://localhost:3500/admins/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    /* 🔥 MAP WEEKLY */
    barSeries.value[0].data = data.weekly.logins;
    barSeries.value[1].data = data.weekly.late;
    barSeries.value[2].data = data.weekly.absent;
    barSeries.value[3].data = data.weekly.overtime;
    barSeries.value[4].data = data.weekly.undertime;

    /* 🔥 MAP DONUT */
    donutSeries.value = [
      data.today.present,
      data.today.late,
      data.today.absent,
      data.today.overtime,
      data.today.undertime
    ];

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
};

onMounted(fetchDashboard);

/* =========================
   OPTIONS
========================= */
const barOptions = {
  chart: {
    background: "transparent",
    toolbar: { show: false },
  },
  colors: ["#1e6bff", "#e8a020", "#f04040", "#1dbf8f", "#a855f7"],
  xaxis: {
    categories: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], // 🔥 MATCH BACKEND
    labels: { style: { colors: "#6b80a8", fontSize: "12px" } },
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
            formatter: () =>
              donutSeries.value.reduce((a, b) => a + b, 0) // 🔥 dynamic total
          }
        }
      }
    }
  }
};
</script>

<template>
  <div class="charts-wrap">

    <!-- BAR + LINE -->
    <div class="card large">
      <h3>Weekly Attendance Overview</h3>
      <apexchart
        type="bar"
        :options="barOptions"
        :series="barSeries"
        height="260"
      />
    </div>

    <!-- DONUT -->
    <div class="card small">
      <h3>Today's Status Breakdown</h3>
      <apexchart
        type="donut"
        :options="donutOptions"
        :series="donutSeries"
        height="260"
      />
    </div>

  </div>
</template>

<style scoped>
.charts-wrap {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
}

/* CARDS */
.card {
  background: #151c2e;
  border-radius: 14px;
  border: 1px solid #1e2d4a;
  padding: 1.5rem;
  transition: 0.2s;
}

.card:hover {
  border-color: #3b82f6;
}

.card.large {
  flex: 2;
}

.card.small {
  flex: 1;
}

h3 {
  color: #e4eaf8;
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
}
</style>