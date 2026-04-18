<template>
  <div class="calendar-container">

    <!-- Header -->
    <div class="page-header">
      <h2>Calendar</h2>
      <div class="view-toggle">
        <button :class="['toggle-btn', { active: view === 'month' }]" @click="view = 'month'">Month</button>
        <button :class="['toggle-btn', { active: view === 'week' }]" @click="view = 'week'">Week</button>
      </div>
    </div>

    <!-- Navigation -->
    <div class="cal-nav">
      <button class="nav-btn" @click="prev">&#8592;</button>
      <div class="nav-center">
        <select v-model="currentMonth" class="nav-select">
          <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
        </select>
        <select v-model="currentYear" class="nav-select">
          <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <button class="nav-btn" @click="next">&#8594;</button>
      <button class="today-btn" @click="goToday">Today</button>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="legend-item reg">● Regular Holiday</span>
      <span class="legend-item spc">● Special Non-Working</span>
      <span class="legend-item swh">● Special Working</span>
    </div>

    <!-- Month View -->
    <div class="month-grid" v-if="view === 'month'">
      <div class="day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>
      <div
        v-for="(day, index) in monthDays"
        :key="index"
        :class="['day-cell',
          { empty: !day },
          { today: day && isToday(day) },
          { 'has-holiday': day && getHoliday(day) }
        ]"
        @click="day && openDay(day)"
      >
        <span class="day-number" v-if="day">{{ day }}</span>
        <template v-if="day && getHoliday(day)">
          <span class="hol-dot" :class="typeClass(getHoliday(day).type)"></span>
          <div class="hol-name" :class="typeClass(getHoliday(day).type)">
            {{ getHoliday(day).name }}
          </div>
        </template>
      </div>
    </div>

    <!-- Week View -->
    <div class="week-view" v-if="view === 'week'">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        :class="['week-day', { today: isToday(day.date), 'has-holiday': getHolidayByFull(day.fullDate) }]"
        @click="openDayFull(day.fullDate, day.date)"
      >
        <div class="week-day-label">{{ day.label }}</div>
        <div class="week-day-number">{{ day.date }}</div>
        <div class="week-events">
          <div
            v-if="getHolidayByFull(day.fullDate)"
            class="week-event"
            :class="typeClass(getHolidayByFull(day.fullDate).type)"
          >
            {{ getHolidayByFull(day.fullDate).name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Day Detail Modal -->
    <div class="modal-overlay" v-if="selectedDay !== null" @click.self="selectedDay = null">
      <div class="modal">
        <h3>{{ formatSelectedDay }}</h3>
        <div v-if="selectedHoliday" class="event-item" :class="typeClass(selectedHoliday.type)">
          <span class="event-badge" :class="typeClass(selectedHoliday.type)">{{ selectedHoliday.type }}</span>
          <div class="event-info">
            <span class="event-title">{{ selectedHoliday.name }}</span>
          </div>
        </div>
        <p class="no-events" v-else>No holidays on this day.</p>
        <button class="btn-close" @click="selectedDay = null">Close</button>
      </div>
    </div>

  </div>
</template>

<script>
// ── HOLIDAY TEMPLATES (month-day → holiday info) ──────────────────────────
// Since all years share the same holidays, we store only MM-DD keys.
// Chinese New Year and Easter-related dates vary yearly — those are hardcoded
// with specific years and will only show for those years.
const FIXED_HOLIDAYS = {
  '01-01': { name: "New Year's Day",                         type: 'Regular Holiday' },
  '04-09': { name: 'Day of Valor (Araw ng Kagitingan)',       type: 'Regular Holiday' },
  '05-01': { name: 'Labor Day',                              type: 'Regular Holiday' },
  '06-12': { name: 'Independence Day',                       type: 'Regular Holiday' },
  '08-21': { name: 'Ninoy Aquino Day',                       type: 'Special Non-Working Holiday' },
  '08-31': { name: 'National Heroes Day',                    type: 'Regular Holiday' },
  '11-01': { name: "All Saints' Day",                        type: 'Special Non-Working Holiday' },
  '11-02': { name: "All Souls' Day",                         type: 'Special Working Holiday' },
  '11-30': { name: 'Bonifacio Day',                          type: 'Regular Holiday' },
  '12-24': { name: 'Christmas Eve',                          type: 'Special Working Holiday' },
  '12-25': { name: 'Christmas Day',                          type: 'Regular Holiday' },
  '12-30': { name: 'Rizal Day',                              type: 'Regular Holiday' },
  '12-31': { name: 'Last Day of the Year',                   type: 'Special Non-Working Holiday' },
};

// Year-specific holidays (moveable feasts, Chinese New Year, etc.)
const YEAR_SPECIFIC_HOLIDAYS = {
  '2026-02-17': { name: 'Chinese New Year',    type: 'Special Non-Working Holiday' },
  '2026-04-02': { name: 'Maundy Thursday',     type: 'Regular Holiday' },
  '2026-04-03': { name: 'Good Friday',         type: 'Regular Holiday' },
  '2026-04-04': { name: 'Black Saturday',      type: 'Special Non-Working Holiday' },
  '2027-01-02': { name: "Day After New Year's Day", type: 'Special Working Holiday' },
};

export default {
  data() {
    return {
      view: 'month',
      now: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      currentWeekStart: null,
      selectedDay: null,
      selectedFullDate: null,
      dayLabels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      monthNames: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ],
    }
  },

  computed: {
    yearRange() {
      const y = new Date().getFullYear()
      const years = []
      for (let i = y - 3; i <= y + 5; i++) years.push(i)
      return years
    },
    monthDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const days = []
      for (let i = 0; i < firstDay; i++) days.push(null)
      for (let d = 1; d <= daysInMonth; d++) days.push(d)
      return days
    },
    weekDays() {
      const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const start = this.currentWeekStart || this.getWeekStart(new Date())
      const days = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push({ label: dayNames[d.getDay()], date: d.getDate(), fullDate: d })
      }
      return days
    },
    formatSelectedDay() {
      if (this.selectedDay === null) return ''
      const fd = this.selectedFullDate || new Date(this.currentYear, this.currentMonth, this.selectedDay)
      return fd.toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    selectedHoliday() {
      if (this.selectedDay === null) return null
      const fd = this.selectedFullDate || new Date(this.currentYear, this.currentMonth, this.selectedDay)
      return this.resolveHoliday(fd)
    }
  },

  methods: {
    pad(n) { return String(n).padStart(2, '0') },

    resolveHoliday(date) {
      const fullKey = `${date.getFullYear()}-${this.pad(date.getMonth()+1)}-${this.pad(date.getDate())}`
      const monthDay = `${this.pad(date.getMonth()+1)}-${this.pad(date.getDate())}`
      // Year-specific takes priority over fixed
      return YEAR_SPECIFIC_HOLIDAYS[fullKey] || FIXED_HOLIDAYS[monthDay] || null
    },

    getHoliday(day) {
      return this.resolveHoliday(new Date(this.currentYear, this.currentMonth, day))
    },

    getHolidayByFull(fullDate) {
      return this.resolveHoliday(fullDate)
    },

    typeClass(type) {
      if (type === 'Regular Holiday') return 'reg'
      if (type === 'Special Non-Working Holiday') return 'spc'
      return 'swh'
    },

    isToday(day) {
      return (
        day === this.now.getDate() &&
        this.currentMonth === this.now.getMonth() &&
        this.currentYear === this.now.getFullYear()
      )
    },

    getWeekStart(date) {
      const d = new Date(date)
      d.setDate(d.getDate() - d.getDay())
      return d
    },

    prev() {
      if (this.view === 'month') {
        if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear-- }
        else this.currentMonth--
      } else {
        const start = this.currentWeekStart || this.getWeekStart(new Date())
        start.setDate(start.getDate() - 7)
        this.currentWeekStart = new Date(start)
        this.currentMonth = this.currentWeekStart.getMonth()
        this.currentYear = this.currentWeekStart.getFullYear()
      }
    },

    next() {
      if (this.view === 'month') {
        if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++ }
        else this.currentMonth++
      } else {
        const start = this.currentWeekStart || this.getWeekStart(new Date())
        start.setDate(start.getDate() + 7)
        this.currentWeekStart = new Date(start)
        this.currentMonth = this.currentWeekStart.getMonth()
        this.currentYear = this.currentWeekStart.getFullYear()
      }
    },

    goToday() {
      this.currentYear  = this.now.getFullYear()
      this.currentMonth = this.now.getMonth()
      this.currentWeekStart = this.getWeekStart(new Date())
    },

    openDay(day) {
      this.selectedDay      = day
      this.selectedFullDate = new Date(this.currentYear, this.currentMonth, day)
    },

    openDayFull(fullDate, day) {
      this.selectedDay      = day
      this.selectedFullDate = fullDate
    },
  },

  mounted() {
    this.currentWeekStart = this.getWeekStart(new Date())
  }
}
</script>

<style scoped>
.calendar-container { width: 100%; }

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-header h2 { color: white; margin: 0; font-size: 22px; font-weight: 700; }

.view-toggle {
  display: flex;
  border: 1px solid #1e2d4a;
  border-radius: 10px;
  overflow: hidden;
}
.toggle-btn {
  padding: 8px 20px;
  background: transparent;
  border: none;
  color: #6b80a8;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}
.toggle-btn.active {
  background: #1e2d4a;
  color: #5b9aff;
  font-weight: bold;
}

/* Nav */
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.nav-btn {
  background: #151c2e;
  border: 1px solid #1e2d4a;
  color: #5b9aff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}
.nav-btn:hover { background: #1e2d4a; }
.nav-center { display: flex; gap: 10px; align-items: center; }
.nav-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1e2d4a;
  background: #151c2e;
  color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}
.nav-select:focus { border-color: #1e6bff; }
.today-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #1e2d4a;
  background: #151c2e;
  color: #6b80a8;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.today-btn:hover { background: #1e2d4a; color: white; }

/* Legend */
.legend { display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
.legend-item { font-size: 13px; font-weight: 600; }
.legend-item.reg { color: #f04040; }
.legend-item.spc { color: #e8a020; }
.legend-item.swh { color: #1dbf8f; }

/* Month Grid */
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.day-label {
  text-align: center;
  color: #6b80a8;
  font-size: 12px;
  padding: 8px 0;
  font-weight: 600;
}
.day-cell {
  background: #151c2e;
  border: 1px solid #1e2d4a;
  border-radius: 10px;
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;
  overflow: hidden;
}
.day-cell.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}
.day-cell:not(.empty):hover { border-color: #1e6bff; background: #1a2340; }
.day-cell.today { border-color: #1e6bff; }

.day-number { color: white; font-size: 13px; font-weight: 600; display: block; }
.day-cell.today .day-number { color: #5b9aff; }

.hol-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-top: 5px;
}
.hol-dot.reg { background: #f04040; }
.hol-dot.spc { background: #e8a020; }
.hol-dot.swh { background: #1dbf8f; }

.hol-name {
  font-size: 10px;
  margin-top: 3px;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.hol-name.reg { color: #f88080; }
.hol-name.spc { color: #e8a020; }
.hol-name.swh { color: #1dbf8f; }

/* Week View */
.week-view {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}
.week-day {
  background: #151c2e;
  border: 1px solid #1e2d4a;
  border-radius: 12px;
  padding: 12px 8px;
  min-height: 160px;
  cursor: pointer;
  transition: 0.2s;
}
.week-day:hover { border-color: #1e6bff; background: #1a2340; }
.week-day.today { border-color: #1e6bff; }
.week-day-label { color: #6b80a8; font-size: 11px; text-align: center; margin-bottom: 4px; }
.week-day-number { color: white; font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 10px; }
.week-day.today .week-day-number { color: #5b9aff; }
.week-events { display: flex; flex-direction: column; gap: 4px; }
.week-event {
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 6px;
  line-height: 1.3;
}
.week-event.reg { background: rgba(240,64,64,.15);  color: #f88080; }
.week-event.spc { background: rgba(232,160,32,.15); color: #e8a020; }
.week-event.swh { background: rgba(29,191,143,.15); color: #1dbf8f; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: flex; align-items: center; justify-content: center; z-index: 999;
}
.modal {
  background: #151c2e;
  border: 1px solid #1e2d4a;
  border-radius: 16px;
  padding: 28px;
  width: 400px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal h3 { color: white; margin: 0; font-size: 16px; font-weight: 600; }

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
}
.event-item.reg { background: rgba(240,64,64,.1); }
.event-item.spc { background: rgba(232,160,32,.1); }
.event-item.swh { background: rgba(29,191,143,.1); }

.event-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.event-badge.reg { background: rgba(240,64,64,.2);  color: #f88080; }
.event-badge.spc { background: rgba(232,160,32,.2); color: #e8a020; }
.event-badge.swh { background: rgba(29,191,143,.2); color: #1dbf8f; }

.event-info { display: flex; flex-direction: column; gap: 3px; }
.event-title { color: white; font-size: 14px; font-weight: 600; }

.no-events { color: #6b80a8; text-align: center; padding: 16px 0; font-size: 13px; margin: 0; }

.btn-close {
  padding: 9px 22px;
  border-radius: 10px;
  border: 1px solid #1e2d4a;
  background: transparent;
  color: #6b80a8;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
  align-self: flex-end;
}
.btn-close:hover { background: #1e2d4a; color: white; }
</style>