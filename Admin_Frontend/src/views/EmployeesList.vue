<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const search = ref("");
const sortKey = ref("firstname");
const sortAsc = ref(true);
const employees = ref([]);
const loading = ref(false);
const error = ref("");

const fetchEmployees = async () => {
  error.value = "";
  loading.value = true;
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("http://localhost:3500/admins/employees/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      error.value = "Unauthorized. Please log in again.";
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      error.value = data.message || "Failed to load employees.";
      return;
    }

    employees.value = data;
  } catch (err) {
    error.value = "Could not connect to the server.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEmployees);

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  let data = employees.value.filter((e) => {
    const fullName = `${e.firstname} ${e.lastname}`.toLowerCase();
    return (
      fullName.includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q)
    );
  });

  data = [...data].sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortAsc.value ? -1 : 1;
    if (valA > valB) return sortAsc.value ? 1 : -1;
    return 0;
  });

  return data;
});
const openEdit = (emp) => {
  router.push({
    name: "EditEmployee",
    params: { email: emp.email } // ✅ correct
  });
};

const setSort = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const sortIcon = (key) => {
  if (sortKey.value !== key) return "⇅";
  return sortAsc.value ? "↑" : "↓";
};

const initials = (emp) =>
  `${emp.firstname?.[0] ?? ""}${emp.lastname?.[0] ?? ""}`.toUpperCase();

// avatar color based on name
const avatarColor = (emp) => {
  const colors = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626"];
  const idx = ((emp.firstname?.charCodeAt(0) ?? 0) + (emp.lastname?.charCodeAt(0) ?? 0)) % colors.length;
  return colors[idx];
};

const openPayroll = (emp) => {
  router.push({
    name: "middlepage",
    params: { email: emp.email }, // ✅ use email
    query: {
      name: `${emp.firstname} ${emp.lastname}`,
      rate: emp.basicPay,
      position: emp.position
    }
  });
};
</script>

<template>
  <div class="wrap">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <div class="header-eyebrow">Human Resources</div>
        <h2>Employee Management</h2>
        <p>Manage employee records and payroll access</p>
      </div>
      <button class="btn-add" @click="router.push({ name: 'Add Employee' })">
        <span class="plus">+</span> Add Employee
      </button>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </span>
        <input v-model="search" placeholder="Search by name, email or position…" />
      </div>
      <div class="toolbar-meta">
        <span class="count-badge">{{ filtered.length }} employee{{ filtered.length !== 1 ? "s" : "" }}</span>
        <button class="btn-refresh" @click="fetchEmployees" :disabled="loading" title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="{ spinning: loading }"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        </button>
      </div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="alert-error">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {{ error }}
    </div>

    <!-- TABLE -->
    <div class="table-card">

      <!-- SKELETON -->
      <template v-if="loading">
        <div class="skeleton-row" v-for="i in 5" :key="i">
          <div class="skeleton avatar-skel"></div>
          <div class="skel-lines">
            <div class="skeleton line-a"></div>
            <div class="skeleton line-b"></div>
          </div>
          <div class="skeleton line-c"></div>
          <div class="skeleton line-c"></div>
          <div class="skeleton line-d"></div>
        </div>
      </template>

      <table v-else class="emp-table">
        <thead>
          <tr>
            <th class="sortable" @click="setSort('firstname')">
              Employee <span class="sort-icon">{{ sortIcon("firstname") }}</span>
            </th>
            <th>Email</th>
            <th>Contact</th>
            <th class="sortable" @click="setSort('position')">
              Position <span class="sort-icon">{{ sortIcon("position") }}</span>
            </th>
            <th class="right sortable" @click="setSort('basicPay')">
              Basic Pay <span class="sort-icon">{{ sortIcon("basicPay") }}</span>
            </th>
            <th class="center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(emp, i) in filtered" :key="emp._id" class="emp-row" :style="{ animationDelay: `${i * 40}ms` }">

            <td>
              <div class="emp-identity" @click="openPayroll(emp)">
                <div class="avatar" :style="{ background: avatarColor(emp) }">{{ initials(emp) }}</div>
                <div>
                  <div class="emp-name">{{ emp.firstname }} {{ emp.lastname }}</div>
                  <div class="emp-user">@{{ emp.username }}</div>
                </div>
              </div>
            </td>

            <td class="muted">{{ emp.email }}</td>
            <td class="muted">{{ emp.contactNum }}</td>

            <td>
              <span class="position-tag">{{ emp.position }}</span>
            </td>

            <td class="right pay-val">₱{{ emp.basicPay?.toLocaleString() }}</td>

            <td class="center action-cell">

              <button class="edit-btn" @click="openEdit(emp)">
                Edit
              </button>

              <button class="view-btn" @click="openPayroll(emp)">
                View Payroll
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

            </td>

          </tr>

          <tr v-if="filtered.length === 0 && !loading">
            <td colspan="6" class="empty-state">
              <div class="empty-icon">🔍</div>
              <div>No employees found</div>
              <span>Try adjusting your search</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.wrap {
  padding: 32px 28px;
  background: #080e1a;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* HEADER */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}
.header-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #3b82f6;
  margin-bottom: 4px;
  font-family: 'DM Mono', monospace;
}
.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
  letter-spacing: -0.3px;
}
.page-header p {
  font-size: 13px;
  color: #64748b;
  margin-top: 3px;
}
.btn-add {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(59,130,246,0.25);
  transition: opacity 0.15s, transform 0.1s;
  flex-shrink: 0;
}
.btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-add .plus { font-size: 16px; font-weight: 400; line-height: 1; }

/* TOOLBAR */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 360px;
}
.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  display: flex;
  align-items: center;
}
.search-wrap input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border-radius: 8px;
  border: 1px solid #1e2d45;
  background: #0d1526;
  color: #e2e8f0;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-wrap input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.search-wrap input::placeholder { color: #334155; }

.toolbar-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.count-badge {
  font-size: 12px;
  font-family: 'DM Mono', monospace;
  color: #475569;
  background: #0d1526;
  border: 1px solid #1a2540;
  padding: 4px 10px;
  border-radius: 6px;
}
.btn-refresh {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid #1a2540;
  background: #0d1526;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s;
}
.btn-refresh:hover { color: #93c5fd; border-color: #3b82f6; }
@keyframes spin { to { transform: rotate(360deg); } }
.spinning { animation: spin 0.8s linear infinite; }

/* ALERT */
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 9px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #fca5a5;
  font-size: 13px;
  margin-bottom: 16px;
}

/* TABLE CARD */
.table-card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 14px;
  overflow: hidden;
}

/* SKELETON */
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #131f35;
}
.skeleton {
  background: linear-gradient(90deg, #131f35 25%, #1a2a45 50%, #131f35 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}
@keyframes shimmer { to { background-position: -200% 0; } }
.avatar-skel { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.skel-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.line-a { height: 12px; width: 140px; }
.line-b { height: 10px; width: 80px; }
.line-c { height: 12px; width: 120px; }
.line-d { height: 10px; width: 70px; }

/* TABLE */
.emp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.emp-table thead tr {
  background: #080e1a;
}
.emp-table th {
  padding: 13px 16px;
  color: #475569;
  font-size: 11.5px;
  font-weight: 500;
  text-align: left;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #1a2540;
  text-transform: uppercase;
}
.emp-table th.sortable { cursor: pointer; user-select: none; }
.emp-table th.sortable:hover { color: #94a3b8; }
.sort-icon { font-size: 12px; opacity: 0.6; margin-left: 4px; }

/* ROW */
@keyframes rowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.emp-row {
  border-top: 1px solid #131f35;
  animation: rowIn 0.25s ease both;
  transition: background 0.12s;
}
.emp-row:hover { background: #111c30; }

.emp-table td {
  padding: 13px 16px;
  vertical-align: middle;
}

/* IDENTITY */
.emp-identity {
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}
.emp-name {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 13.5px;
}
.emp-user {
  font-size: 11.5px;
  color: #475569;
  font-family: 'DM Mono', monospace;
  margin-top: 1px;
}

.muted { color: #64748b; font-size: 13px; }

.position-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 5px;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.18);
  color: #93c5fd;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
}
.action-cell {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.edit-btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid #334155;
  background: #020617;
  color: #38bdf8;
  cursor: pointer;
  transition: 0.2s;
}

.edit-btn:hover {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.right { text-align: right; }
.center { text-align: center; }

.pay-val {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #a3e635;
  font-weight: 500;
}

/* VIEW BTN */
.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  background: transparent;
  border: 1px solid #1e2d45;
  border-radius: 6px;
  color: #64748b;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.view-btn:hover {
  border-color: #3b82f6;
  color: #93c5fd;
  background: rgba(59,130,246,0.07);
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 52px 20px;
  color: #475569;
}
.empty-icon { font-size: 28px; margin-bottom: 10px; }
.empty-state div { font-size: 14px; font-weight: 500; color: #64748b; margin-bottom: 4px; }
.empty-state span { font-size: 12px; color: #334155; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .wrap { padding: 20px 14px; }
  .page-header { flex-direction: column; }
  .emp-table th:nth-child(2),
  .emp-table td:nth-child(2),
  .emp-table th:nth-child(3),
  .emp-table td:nth-child(3) { display: none; }
}
</style>