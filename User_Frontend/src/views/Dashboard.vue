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
  import { ref } from "vue";
  import DashboardCharts from "../components/DashboardCharts.vue";

  const adminName = localStorage.getItem("employeeCredentials")
    ? JSON.parse(localStorage.getItem("employeeCredentials")).username
    : "Admin";

  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const stats = [
    {
      label: "Total Log-ins Today",
      value: 87,
      icon: "🟢",
      subtitle: "Employees who clocked in today.",
      breakdown: [
        { label: "On Time", value: 73, percent: 84 },
        { label: "Late", value: 14, percent: 16 },
      ]
    },
    {
      label: "Total Late Today",
      value: 14,
      icon: "🕐",
      subtitle: "Employees who clocked in past their shift start.",
      breakdown: [
        { label: "1–15 mins", value: 8, percent: 57 },
        { label: "16–30 mins", value: 4, percent: 29 },
        { label: "30+ mins", value: 2, percent: 14 },
      ]
    },
    {
      label: "Total Absent Today",
      value: 9,
      icon: "🔴",
      subtitle: "Employees with no attendance record today.",
      breakdown: [
        { label: "No Notice", value: 5, percent: 56 },
        { label: "Filed Leave", value: 4, percent: 44 },
      ]
    },
    {
      label: "Total Overtime",
      value: 22,
      icon: "⏫",
      subtitle: "Employees who worked beyond their shift.",
      breakdown: [
        { label: "< 1 hour", value: 10, percent: 45 },
        { label: "1–2 hours", value: 8, percent: 37 },
        { label: "2+ hours", value: 4, percent: 18 },
      ]
    },
    {
      label: "Total Undertime",
      value: 11,
      icon: "⏬",
      subtitle: "Employees who clocked out before shift end.",
      breakdown: [
        { label: "< 30 mins", value: 6, percent: 55 },
        { label: "30–60 mins", value: 3, percent: 27 },
        { label: "60+ mins", value: 2, percent: 18 },
      ]
    },
  ];

  const recentActivity = [
    { id: 1, type: "in",     message: "Maria Santos clocked in at 8:02 AM",           time: "4 mins ago" },
    { id: 2, type: "late",   message: "Roven Cruz clocked in",                         tag: "LATE +1h14m", time: "12 mins ago · 9:14 AM" },
    { id: 3, type: "out",    message: "Jun Dela Rosa clocked out at 5:00 PM",          time: "2 hours ago" },
    { id: 4, type: "ot",     message: "Abegail Reyes logged overtime",                 tag: "+1h 30m OT",  time: "3 hours ago" },
    { id: 5, type: "ut",     message: "Kurt Mendez clocked out early",                 tag: "-45m UT",     time: "4 hours ago" },
    { id: 6, type: "absent", message: "Jochelle Luna has no attendance record today",  time: "Today" },
  ];

  const attendanceLog = [
    { id: 1, name: "Maria Santos",  timeIn: "8:02 AM", timeOut: "5:00 PM", status: "present", statusLabel: "Present",   remarks: "On time" },
    { id: 2, name: "Roven Cruz",    timeIn: "9:14 AM", timeOut: "5:00 PM", status: "late",    statusLabel: "Late",      remarks: "+1h 14m late" },
    { id: 3, name: "Abegail Reyes", timeIn: "8:00 AM", timeOut: "6:30 PM", status: "ot",      statusLabel: "Overtime",  remarks: "+1h 30m OT" },
    { id: 4, name: "Kurt Mendez",   timeIn: "8:00 AM", timeOut: "4:15 PM", status: "ut",      statusLabel: "Undertime", remarks: "-45m UT" },
    { id: 5, name: "Jochelle Luna", timeIn: "—",       timeOut: "—",       status: "absent",  statusLabel: "Absent",    remarks: "No log recorded" },
  ];

  const activeModal = ref(null);
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