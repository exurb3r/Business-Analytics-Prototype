<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

// ✅ TOKEN
const token = localStorage.getItem("adminToken");

// ✅ EMPLOYEE
const emp = {
  email: route.params.email,
  name: route.query.name,
  rate: Number(route.query.rate),
  position: route.query.position || "Software Engineer"
};

// ✅ STATE
const payrolls = ref([]);
const loading = ref(false);
const error = ref("");

// ✅ FETCH
const fetchPayrolls = async () => {
  loading.value = true;
  error.value = "";

  // 🔥 TOKEN CHECK
  if (!token) {
    error.value = "Unauthorized. Please login again.";
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3500/admins/getlistofpayrolls/payrolls/${emp.email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    // 🔥 HANDLE AUTH ERROR
    if (res.status === 401 || res.status === 403) {
      error.value = "Session expired. Please login again.";
      localStorage.removeItem("adminToken");
      return;
    }

    if (!res.ok) {
      error.value = data.message || "Failed to fetch payrolls";
      payrolls.value = [];
      return;
    }

    payrolls.value = data;

  } catch (err) {
    console.error(err);
    error.value = "Server connection error";
  } finally {
    loading.value = false;
  }
};

// ✅ LOAD
onMounted(fetchPayrolls);

// ✅ NAVIGATE (🔥 FIX: ENCODE MONTH)
const openPayroll = (p) => {
  router.push({
    name: "Payroll",
    params: { email: emp.email },
    query: {
      name: emp.name,
      rate: emp.rate,
      month: encodeURIComponent(p.month) // 🔥 IMPORTANT FIX
    }
  });
};
</script>

<template>
<div class="wrap">

  <div class="page-header">
    <div>
      <div class="header-eyebrow">Payroll Management</div>
      <h2>{{ emp.name }}</h2>
      <p>{{ emp.position }}</p>
    </div>
  </div>

  <!-- ERROR -->
  <div v-if="error" class="error-box">
    {{ error }}
  </div>

  <!-- SUMMARY -->
  <div class="stats-row">
    <div class="box">
      <div class="box-icon">💰</div>
      <div>
        <p>Basic Pay</p>
        <h3>₱{{ emp.rate.toLocaleString() }}</h3>
      </div>
    </div>

    <div class="box">
      <div class="box-icon">📄</div>
      <div>
        <p>Total Payrolls</p>
        <h3>{{ payrolls.length }}</h3>
      </div>
    </div>
  </div>

  <!-- LOADING -->
  <div v-if="loading" class="empty-state">
    Loading payrolls...
  </div>

  <!-- TABLE -->
  <div v-else class="table-card">
    <table class="emp-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Basic</th>
          <th>Gross</th>
          <th>Net</th>
          <th class="center">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in payrolls" :key="p._id" class="emp-row">

          <td>{{ p.month }}</td>

          <td class="muted">
            ₱{{ p.basicPay?.toLocaleString() }}
          </td>

          <td class="muted">
            ₱{{ p.grossPay?.toLocaleString() }}
          </td>

          <td>
            <span class="badge present">
              ₱{{ p.netPay?.toLocaleString() }}
            </span>
          </td>

          <td class="center">
            <button class="view-btn" @click="openPayroll(p)">
              View →
            </button>
          </td>

        </tr>

        <tr v-if="payrolls.length === 0 && !loading">
          <td colspan="5" class="empty-state">
            No payroll records found
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
</template>

<style scoped>
.wrap {
  padding: 32px 28px;
  background: #080e1a;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* HEADER */
.page-header {
  margin-bottom: 24px;
}
.header-eyebrow {
  font-size: 11px;
  color: #3b82f6;
  margin-bottom: 4px;
  font-family: 'DM Mono', monospace;
}
.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
}
.page-header p {
  font-size: 13px;
  color: #64748b;
}

/* STATS */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.box {
  background: #151c2e;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid #1e2d4a;
  display: flex;
  gap: 14px;
}
.box-icon {
  font-size: 22px;
}
.box p {
  color: #6b80a8;
  font-size: 12px;
}
.box h3 {
  color: white;
  font-size: 20px;
}

/* TABLE */
.table-card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 14px;
  overflow: hidden;
}

.emp-table {
  width: 100%;
  border-collapse: collapse;
}

.emp-table th {
  padding: 12px;
  color: #475569;
  font-size: 11px;
  border-bottom: 1px solid #1a2540;
  text-align: left;
}

.emp-table td {
  padding: 12px;
  border-top: 1px solid #131f35;
}

.emp-row:hover {
  background: #111c30;
}

.muted {
  color: #64748b;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  background: rgba(30,107,255,.15);
  color: #5b9aff;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #1e2d45;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.view-btn:hover {
  border-color: #3b82f6;
  color: #93c5fd;
}

.center {
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #475569;
}
</style>