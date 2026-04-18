<template>
  <div class="dashboard-container">

    <!-- Welcome Box -->
    <div class="welcome-box">
      <div class="welcome-overlay">
        <div>
          <p class="welcome-text">Welcome back</p>
          <h2 class="welcome-name">{{ adminName }}</h2>
          <p class="welcome-date">{{ today }}</p>
        </div>
        <div class="welcome-badge">BUSINESS ADMIN</div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="box" v-for="stat in stats" :key="stat.label" @click="openModal(stat)">
        <div class="box-icon">{{ stat.icon }}</div>
        <div>
          <p>{{ stat.label }}</p>
          <h3>{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <DashboardCharts />

    <!-- Bottom Row -->
    <div class="bottom-row">

      <!-- Recent Activity -->
      <div class="panel">
        <h4 class="panel-title">Recent Activity</h4>
        <ul class="activity-list">
          <li v-for="item in recentActivity" :key="item.id" class="activity-item">
            <span class="activity-dot" :class="item.type"></span>
            <div>
              <p class="activity-main">
                {{ item.message }}
                <span v-if="item.tag" class="activity-tag" :class="'tag-' + item.type">{{ item.tag }}</span>
              </p>
              <p class="activity-time">{{ item.time }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Time-In / Time-Out Log -->
      <div class="panel">
        <h4 class="panel-title">Time-In / Time-Out Log</h4>
        <table class="log-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in attendanceLog" :key="emp.id">
              <td>
                <div class="emp-cell">
                  <div class="emp-avatar">{{ emp.name.split(' ').map(n => n[0]).join('') }}</div>
                  {{ emp.name }}
                </div>
              </td>
              <td>{{ emp.timeIn }}</td>
              <td>{{ emp.timeOut }}</td>
              <td><span class="badge" :class="emp.status">{{ emp.statusLabel }}</span></td>
              <td class="remarks">{{ emp.remarks }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="activeModal" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-icon">{{ activeModal.icon }}</span>
          <h3>{{ activeModal.label }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-value">{{ activeModal.value }}</div>
        <p class="modal-subtitle">{{ activeModal.subtitle }}</p>
        <ul class="modal-breakdown">
          <li v-for="item in activeModal.breakdown" :key="item.label" class="breakdown-item">
            <span class="breakdown-label">{{ item.label }}</span>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: item.percent + '%' }"></div>
            </div>
            <span class="breakdown-value">{{ item.value }}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DashboardCharts from "../components/DashboardCharts.vue";

/* ── AUTH ─────────────────────────────────────────────────────────── */
const adminName = localStorage.getItem("adminCredentials")
  ? JSON.parse(localStorage.getItem("adminCredentials")).username
  : "Admin";

const today = new Date().toLocaleDateString("en-PH", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

const token = localStorage.getItem("adminToken");
const API   = "http://localhost:3500";

/* ── STATE ────────────────────────────────────────────────────────── */
const todayData     = ref({ present: 0, late: 0, absent: 0, overtime: 0, undertime: 0 });
const attendanceLog = ref([]);
const recentActivity = ref([]);
const activeModal   = ref(null);

/* ── STATS (computed from live todayData) ─────────────────────────── */
const stats = computed(() => [
  {
    label: "Total Log-ins Today",
    value: todayData.value.present,
    icon: "🟢",
    subtitle: "Employees who clocked in today.",
    breakdown: [
      { label: "On Time", value: todayData.value.present - todayData.value.late, percent: todayData.value.present ? Math.round(((todayData.value.present - todayData.value.late) / todayData.value.present) * 100) : 0 },
      { label: "Late",    value: todayData.value.late,    percent: todayData.value.present ? Math.round((todayData.value.late    / todayData.value.present) * 100) : 0 },
    ]
  },
  {
    label: "Total Late Today",
    value: todayData.value.late,
    icon: "🕐",
    subtitle: "Employees who clocked in past their shift start.",
    breakdown: [
      { label: "Late", value: todayData.value.late, percent: 100 },
    ]
  },
  {
    label: "Total Absent Today",
    value: todayData.value.absent,
    icon: "🔴",
    subtitle: "Employees with no attendance record today.",
    breakdown: [
      { label: "Absent", value: todayData.value.absent, percent: 100 },
    ]
  },
  {
    label: "Total Overtime",
    value: todayData.value.overtime,
    icon: "⏫",
    subtitle: "Employees who worked beyond their shift.",
    breakdown: [
      { label: "Overtime", value: todayData.value.overtime, percent: 100 },
    ]
  },
  {
    label: "Total Undertime",
    value: todayData.value.undertime,
    icon: "⏬",
    subtitle: "Employees who clocked out before shift end.",
    breakdown: [
      { label: "Undertime", value: todayData.value.undertime, percent: 100 },
    ]
  },
]);

/* ── HELPERS ──────────────────────────────────────────────────────── */
const fmt = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-PH", {
    hour: "2-digit", minute: "2-digit", hour12: true
  });
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return "Today";
};

const getStatus = (log) => {
  if (log.absent)        return { status: "absent",  statusLabel: "Absent"    };
  if (log.overtime > 0)  return { status: "ot",      statusLabel: "Overtime"  };
  if (log.undertime > 0) return { status: "ut",      statusLabel: "Undertime" };
  if (log.latetime > 0)  return { status: "late",    statusLabel: "Late"      };
  return                        { status: "present", statusLabel: "Present"   };
};

const getRemarks = (log) => {
  if (log.absent)        return "No log recorded";
  const parts = [];
  if (log.latetime > 0)  parts.push(`+${log.latetime}m late`);
  if (log.overtime > 0)  parts.push(`+${log.overtime}m OT`);
  if (log.undertime > 0) parts.push(`-${log.undertime}m UT`);
  return parts.length ? parts.join(", ") : "On time";
};

const buildActivity = (logs) => {
  // Sort by most recent timeIn first, take top 6
  return [...logs]
    .filter(l => l.timeIn || l.absent)
    .sort((a, b) => new Date(b.timeIn || b.date) - new Date(a.timeIn || a.date))
    .slice(0, 6)
    .map((log, i) => {
      if (log.absent) {
        return {
          id: i, type: "absent",
          message: `${log.employeeName} has no attendance record today`,
          time: "Today"
        };
      }
      if (log.overtime > 0) {
        return {
          id: i, type: "ot",
          message: `${log.employeeName} logged overtime`,
          tag: `+${log.overtime}m OT`,
          time: timeAgo(log.timeIn)
        };
      }
      if (log.undertime > 0) {
        return {
          id: i, type: "ut",
          message: `${log.employeeName} clocked out early`,
          tag: `-${log.undertime}m UT`,
          time: timeAgo(log.timeIn)
        };
      }
      if (log.latetime > 0) {
        return {
          id: i, type: "late",
          message: `${log.employeeName} clocked in`,
          tag: `LATE +${log.latetime}m`,
          time: `${timeAgo(log.timeIn)} · ${fmt(log.timeIn)}`
        };
      }
      return {
        id: i, type: "in",
        message: `${log.employeeName} clocked in at ${fmt(log.timeIn)}`,
        time: timeAgo(log.timeIn)
      };
    });
};

/* ── FETCH ────────────────────────────────────────────────────────── */
const fetchDashboard = async () => {
  try {
    const res = await fetch(`${API}/admins/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) { console.error(data.message); return; }

    todayData.value = data.today;

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
};

const fetchTodayLogs = async () => {
  try {
    const res = await fetch(`${API}/admins/dashboard/today-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) { console.error(data.message); return; }

    // Build attendance log table
    attendanceLog.value = data.logs.map((log, i) => ({
      id:          i,
      name:        log.employeeName,
      timeIn:      fmt(log.timeIn),
      timeOut:     fmt(log.timeOut),
      ...getStatus(log),
      remarks:     getRemarks(log),
    }));

    // Build recent activity feed
    recentActivity.value = buildActivity(data.logs);

  } catch (err) {
    console.error("Today logs fetch error:", err);
  }
};

onMounted(() => {
  fetchDashboard();
  fetchTodayLogs();
});

/* ── MODAL ────────────────────────────────────────────────────────── */
const openModal  = (stat) => { activeModal.value = stat; };
const closeModal = ()     => { activeModal.value = null; };
</script>

<style scoped>
.dashboard-container { width: 100%; }

/* Welcome */
.welcome-box {
  border-radius: 16px;
  margin-bottom: 25px;
  border: 1px solid #1e2d4a;
  background: linear-gradient(120deg, #081535 0%, #0d2160 60%, #0d1836 100%);
  overflow: hidden;
  min-height: 130px;
}
.welcome-overlay {
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 130px;
}
.welcome-text  { color: #6b80a8; margin: 0 0 4px 0; font-size: 13px; }
.welcome-name  { color: white; margin: 0 0 6px 0; font-size: 24px; font-weight: 700; }
.welcome-date  { color: #6b80a8; margin: 0; font-size: 13px; }
.welcome-badge {
  background: rgba(30,107,255,.25);
  border: 1px solid rgba(30,107,255,.5);
  color: #5b9aff;
  padding: 8px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 1px;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 25px;
}
.box {
  background: #151c2e; padding: 18px;
  border-radius: 14px; border: 1px solid #1e2d4a;
  transition: .2s ease; display: flex;
  align-items: center; gap: 14px; cursor: pointer;
}
.box:hover { transform: translateY(-4px); border-color: #1e6bff; background: #1a2340; }
.box-icon { font-size: 24px; }
.box p    { color: #6b80a8; margin: 0 0 5px 0; font-size: 12px; }
.box h3   { color: white; margin: 0; font-size: 26px; font-weight: 700; }

/* Bottom Row */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-top: 25px;
}
.panel {
  background: #151c2e; border-radius: 14px;
  border: 1px solid #1e2d4a; padding: 20px;
}
.panel-title { color: white; margin: 0 0 16px 0; font-size: 14px; font-weight: 600; }

/* Activity */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1e2d4a; }
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 9px; height: 9px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.activity-dot.in     { background: #1e6bff; }
.activity-dot.out    { background: #6b80a8; }
.activity-dot.late   { background: #e8a020; }
.activity-dot.ot     { background: #1dbf8f; }
.activity-dot.ut     { background: #a855f7; }
.activity-dot.absent { background: #f04040; }
.activity-main { color: #ddd; margin: 0 0 3px 0; font-size: 13px; }
.activity-time { color: #6b80a8; margin: 0; font-size: 11px; }
.activity-tag {
  display: inline-block;
  font-size: 10px; font-weight: 600;
  padding: 2px 7px; border-radius: 99px; margin-left: 6px;
}
.tag-ot     { background: rgba(29,191,143,.15); color: #1dbf8f; }
.tag-ut     { background: rgba(168,85,247,.15);  color: #a855f7; }
.tag-late   { background: rgba(232,160,32,.15);  color: #e8a020; }
.tag-absent { background: rgba(240,64,64,.15);   color: #f04040; }

/* Log Table */
.log-table { width: 100%; border-collapse: collapse; }
.log-table th { color: #6b80a8; font-size: 11px; text-align: left; padding: 7px 10px; border-bottom: 1px solid #1e2d4a; }
.log-table td { color: #ddd; font-size: 12px; padding: 10px; border-bottom: 1px solid #141929; }
.log-table tr:last-child td { border-bottom: none; }
.emp-cell { display: flex; align-items: center; gap: 9px; }
.emp-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(30,107,255,.2); color: #5b9aff;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600; flex-shrink: 0;
}
.remarks { color: #6b80a8; font-size: 11px; }
.badge { padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 600; }
.badge.present { background: rgba(30,107,255,.15);  color: #5b9aff; }
.badge.late    { background: rgba(232,160,32,.15);   color: #e8a020; }
.badge.absent  { background: rgba(240,64,64,.15);    color: #f04040; }
.badge.ot      { background: rgba(29,191,143,.15);   color: #1dbf8f; }
.badge.ut      { background: rgba(168,85,247,.15);   color: #a855f7; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: flex; align-items: center; justify-content: center; z-index: 999;
}
.modal {
  background: #151c2e; border: 1px solid #1e2d4a;
  border-radius: 20px; padding: 32px;
  width: 420px; max-width: 90vw;
}
.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.modal-icon   { font-size: 28px; }
.modal-header h3 { color: white; margin: 0; flex: 1; font-size: 18px; }
.modal-close { background: none; border: none; color: #6b80a8; font-size: 18px; cursor: pointer; padding: 4px 8px; }
.modal-close:hover { color: white; }
.modal-value    { color: #1e6bff; font-size: 48px; font-weight: 700; margin-bottom: 4px; }
.modal-subtitle { color: #6b80a8; font-size: 13px; margin: 0 0 24px 0; }
.modal-breakdown { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.breakdown-item  { display: flex; align-items: center; gap: 12px; }
.breakdown-label { color: #6b80a8; font-size: 13px; width: 110px; flex-shrink: 0; }
.breakdown-bar-wrap { flex: 1; background: #1e2d4a; border-radius: 99px; height: 7px; overflow: hidden; }
.breakdown-bar { height: 100%; background: #1e6bff; border-radius: 99px; transition: width .4s ease; }
.breakdown-value { color: white; font-size: 13px; font-weight: 600; width: 30px; text-align: right; }
</style>