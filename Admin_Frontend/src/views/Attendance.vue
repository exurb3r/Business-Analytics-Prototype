<script setup>
import { ref, watch, onMounted } from "vue";

const logs = ref([]);
const loading = ref(false);
const error = ref("");
const dateFilter = ref("all");
const selectedDate = ref("");

const fetchLogs = async () => {
  loading.value = true;
  error.value = "";
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("No admin token found");
    const res = await fetch(
      `http://localhost:3500/admins/attendance?filter=${dateFilter.value}&date=${selectedDate.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    logs.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

watch([dateFilter, selectedDate], fetchLogs);
onMounted(fetchLogs);

const initials = (name) =>
  name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric"
  }) : "—";

const formatTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const money = (val) => `₱${Number(val || 0).toFixed(2)}`;

const statusClass = (statusArr) => {
  if (!statusArr || statusArr.length === 0) return "badge-default";
  const s = statusArr[0];
  if (s === "Absent")    return "badge-absent";
  if (s === "Late")      return "badge-late";
  if (s === "Undertime") return "badge-ut";
  if (s === "Overtime")  return "badge-ot";
  return "badge-present";
};

const selectedLog = ref(null);
const openLog = (log) => (selectedLog.value = log);
const closeModal = () => (selectedLog.value = null);
</script>

<template>
<div class="attendance-wrap">

  <div class="attendance-header">
    <h2>Payroll Logbook</h2>
    <p>Attendance and payroll records</p>
  </div>

  <!-- FILTER -->
  <div class="attendance-filter">
    <select v-model="dateFilter" class="filter-select">
      <option value="all">All Records</option>
      <option value="today">Today</option>
      <option value="custom">Custom Date</option>
    </select>
    <input
      v-if="dateFilter === 'custom'"
      type="date"
      v-model="selectedDate"
      class="filter-date"
    />
  </div>

  <p v-if="loading" class="state-msg">Loading records...</p>
  <p v-if="error" class="state-msg error-msg">{{ error }}</p>

  <!-- TABLE -->
  <div class="attendance-table-wrap">
    <table class="attendance-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Date</th>
          <th>Time In</th>
          <th>Time Out</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="log in logs"
          :key="log.id"
          class="attendance-row"
          @click="openLog(log)"
        >
          <td>
            <div class="attendance-emp">
              <div class="attendance-avatar">{{ initials(log.name) }}</div>
              <div>
                <div class="attendance-name">{{ log.name }}</div>
                <div class="attendance-role">{{ log.position }}</div>
              </div>
            </div>
          </td>
          <td>{{ formatDate(log.date) }}</td>
          <td>{{ formatTime(log.timeIn) }}</td>
          <td>{{ formatTime(log.timeOut) }}</td>
          <td>
            <span class="attendance-badge" :class="statusClass(log.status)">
              {{ log.status?.join(" + ") || "N/A" }}
            </span>
          </td>
        </tr>
        <tr v-if="!loading && logs.length === 0">
          <td colspan="5" class="attendance-empty">No records found</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div v-if="selectedLog" class="attendance-overlay" @click.self="closeModal">
    <div class="attendance-modal">

      <button class="attendance-close" @click="closeModal">×</button>

      <!-- Employee Info -->
      <div class="modal-head">
        <div class="attendance-avatar big">{{ initials(selectedLog.name) }}</div>
        <div class="modal-head-info">
          <h3>{{ selectedLog.name }}</h3>
          <p>{{ selectedLog.position }}</p>
        </div>
      </div>

      <div class="modal-divider"></div>

      <!-- Time Info -->
      <div class="modal-section-label">Attendance</div>
      <div class="modal-info-grid">
        <div class="modal-info-item">
          <span class="info-label">Date</span>
          <span class="info-value">{{ formatDate(selectedLog.date) }}</span>
        </div>
        <div class="modal-info-item">
          <span class="info-label">Time In</span>
          <span class="info-value">{{ formatTime(selectedLog.timeIn) }}</span>
        </div>
        <div class="modal-info-item">
          <span class="info-label">Time Out</span>
          <span class="info-value">{{ formatTime(selectedLog.timeOut) }}</span>
        </div>
        <div class="modal-info-item" v-if="selectedLog.breakOut">
          <span class="info-label">Break Out</span>
          <span class="info-value">{{ formatTime(selectedLog.breakOut) }}</span>
        </div>
        <div class="modal-info-item" v-if="selectedLog.breakReturn">
          <span class="info-label">Break Return</span>
          <span class="info-value">{{ formatTime(selectedLog.breakReturn) }}</span>
        </div>
        <div class="modal-info-item">
          <span class="info-label">Status</span>
          <span class="attendance-badge" :class="statusClass(selectedLog.status)">
            {{ selectedLog.status?.join(" + ") || "N/A" }}
          </span>
        </div>
      </div>

      <div class="modal-divider"></div>

      <!-- Payroll Breakdown -->
      <div class="modal-section-label">Payroll Breakdown</div>
      <template v-if="selectedLog.payroll">
        <div class="pay-rows">
          <div class="pay-row deduct">
            <span>Late deduction</span>
            <span>-{{ money(selectedLog.payroll.lateDeduct) }}</span>
          </div>
          <div class="pay-row deduct">
            <span>Undertime deduction</span>
            <span>-{{ money(selectedLog.payroll.utDeduct) }}</span>
          </div>
          <div class="pay-row add">
            <span>Overtime pay</span>
            <span>+{{ money(selectedLog.payroll.otAdd) }}</span>
          </div>
          <div class="pay-row add">
            <span>Night differential</span>
            <span>+{{ money(selectedLog.payroll.nightDiff) }}</span>
          </div>
          <div class="pay-row total">
            <span>Day Total</span>
            <span>{{ money(selectedLog.payroll.total) }}</span>
          </div>
        </div>
      </template>
      <p v-else class="no-payroll">No payroll data available.</p>

    </div>
  </div>

</div>
</template>

<style scoped>
.attendance-wrap {
  width: 100%;
  color: white;
}

/* Header */
.attendance-header { margin-bottom: 20px; }
.attendance-header h2 { font-size: 22px; font-weight: 700; margin: 0 0 4px 0; color: white; }
.attendance-header p  { color: #6b80a8; font-size: 13px; margin: 0; }

/* Filter */
.attendance-filter {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-select,
.filter-date {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid #1e2d4a;
  background: #151c2e;
  color: white;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}
.filter-select:focus,
.filter-date:focus { border-color: #1e6bff; }

/* State messages */
.state-msg  { color: #6b80a8; font-size: 13px; margin-bottom: 12px; }
.error-msg  { color: #f04040; }

/* Table */
.attendance-table-wrap {
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid #1e2d4a;
}
.attendance-table {
  width: 100%;
  border-collapse: collapse;
  background: #151c2e;
}
.attendance-table th {
  color: #6b80a8;
  font-size: 11px;
  font-weight: 600;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #1e2d4a;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.attendance-table td {
  padding: 12px 16px;
  font-size: 13px;
  color: #c5d4f0;
  border-bottom: 1px solid #0d1424;
  vertical-align: middle;
}
.attendance-row { cursor: pointer; transition: background .15s; }
.attendance-row:hover td { background: #1a2340; }
.attendance-row:last-child td { border-bottom: none; }

/* Employee cell */
.attendance-emp   { display: flex; align-items: center; gap: 10px; }
.attendance-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(30,107,255,.2); color: #5b9aff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.attendance-avatar.big { width: 46px; height: 46px; font-size: 15px; }
.attendance-name  { font-size: 13px; font-weight: 600; color: white; }
.attendance-role  { font-size: 11px; color: #6b80a8; margin-top: 2px; }

/* Badges */
.attendance-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-present { background: rgba(30,107,255,.15);  color: #5b9aff; }
.badge-late    { background: rgba(232,160,32,.15);  color: #e8a020; }
.badge-absent  { background: rgba(240,64,64,.15);   color: #f04040; }
.badge-ot      { background: rgba(29,191,143,.15);  color: #1dbf8f; }
.badge-ut      { background: rgba(168,85,247,.15);  color: #a855f7; }
.badge-default { background: rgba(107,128,168,.15); color: #6b80a8; }

.attendance-empty {
  text-align: center; color: #6b80a8;
  padding: 40px; font-size: 13px;
}

/* Modal overlay */
.attendance-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}

/* Modal box */
.attendance-modal {
  background: #151c2e;
  border: 1px solid #1e2d4a;
  border-radius: 20px;
  padding: 28px;
  width: 460px;
  max-width: 92vw;
  max-height: 88vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attendance-close {
  position: absolute; top: 16px; right: 18px;
  background: none; border: none;
  color: #6b80a8; font-size: 22px;
  cursor: pointer; line-height: 1;
  padding: 0;
  transition: color .15s;
}
.attendance-close:hover { color: white; }

/* Modal head */
.modal-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-right: 32px;
}
.modal-head-info h3 { color: white; margin: 0 0 4px 0; font-size: 17px; font-weight: 600; }
.modal-head-info p  { color: #6b80a8; margin: 0; font-size: 13px; }

.modal-divider { border: none; border-top: 1px solid #1e2d4a; margin: 0; }

.modal-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #6b80a8;
}

/* Info grid */
.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-label { font-size: 11px; color: #6b80a8; }
.info-value { font-size: 14px; color: white; font-weight: 500; }

/* Pay rows */
.pay-rows { display: flex; flex-direction: column; gap: 8px; }
.pay-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 8px;
}
.pay-row.deduct { background: rgba(240,64,64,.08); }
.pay-row.deduct span:last-child { color: #f04040; font-weight: 600; }
.pay-row.add    { background: rgba(29,191,143,.08); }
.pay-row.add span:last-child    { color: #1dbf8f; font-weight: 600; }
.pay-row.total  {
  background: rgba(30,107,255,.1);
  border: 1px solid rgba(30,107,255,.2);
  margin-top: 4px;
}
.pay-row.total span:first-child { font-weight: 600; color: white; }
.pay-row.total span:last-child  { font-size: 16px; font-weight: 700; color: #5b9aff; }

.pay-row span:first-child { color: #c5d4f0; }

.no-payroll { color: #6b80a8; font-size: 13px; margin: 0; }
</style>