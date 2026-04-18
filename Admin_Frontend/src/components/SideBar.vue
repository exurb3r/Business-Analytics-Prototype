<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Clock,
  BarChart3,
  Bell,
  Settings,
  LogOut
} from "lucide-vue-next"

const router = useRouter()
const handleLogout = () => {
  localStorage.removeItem("adminToken")
  localStorage.removeItem("adminCredentials")
  router.replace("/login")
}
</script>

<template>
  <aside class="sidebar">

    <!-- LOGO -->
    <div class="logo">
      <div class="logo-box">
        <BarChart3 class="logo-icon" />
      </div>
      <div class="logo-text">
        <p class="brand">DCCP Payroll</p>
        <span class="sub">Admin Panel</span>
      </div>
    </div>

    <!-- NAV -->
    <nav class="nav">

      <p class="section">MAIN</p>

      <router-link to="/dashboard" class="link">
        <LayoutDashboard class="icon" />
        <span>Dashboard</span>
      </router-link>

      <p class="section">MANAGEMENT</p>

      <router-link to="/employeeslist" class="link">
        <Users class="icon" />
        <span>Employees</span>
      </router-link>

      <router-link to="/attendance" class="link">
        <CalendarClock class="icon" />
        <span>Attendance</span>
      </router-link>

      <!-- 🔥 FIXED ICON -->
      <router-link to="/addemployee" class="link">
        <Users class="icon" />
        <span>Add Employee</span>
      </router-link>

      <!-- 🔥 BETTER ICON -->
      <router-link to="/calendar" class="link">
        <Clock class="icon" />
        <span>Calendar</span>
      </router-link>

      <p class="section">OTHER</p>

      <router-link to="/testdata" class="link">
        <BarChart3 class="icon" />
        <span>Test Data</span>
      </router-link>

    </nav>

    <!-- LOGOUT -->
    <button class="logout" @click="handleLogout">
      <LogOut class="icon" />
      Logout
    </button>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a0d14, #0f1421);
  border-right: 1px solid #1e2d4a;
}
/* LOGO IMPROVED */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.logo-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e6bff, #0a3fa8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(30,107,255,.35);
}

.logo-icon {
  width: 18px;
  height: 18px;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand {
  color: #e4eaf8;
  font-weight: 700;
  font-size: 14px;
  margin: 0;
}

.sub {
  font-size: 10px;
  color: #6b80a8;
  letter-spacing: .4px;
}

.brand {
  color: #e4eaf8;
  font-weight: 700;
  font-size: 14px;
  margin: 0;
}

.sub {
  font-size: 10px;
  color: #6b80a8;
  letter-spacing: .4px;
}

/* NAV */
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding-right: 2px;
}

/* SECTION LABEL */
.section {
  font-size: 9px;
  color: #3d5278;
  margin-top: 16px;
  margin-bottom: 6px;
  letter-spacing: 1.3px;
  padding-left: 10px;
}

/* LINKS */
.link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 10px;
  color: #6b80a8;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  transition: all .18s ease;
}

/* ICON */
.icon {
  width: 16px;
  height: 16px;
  opacity: .75;
  transition: 0.2s;
}

/* HOVER */
.link:hover {
  background: rgba(255,255,255,.05);
  color: #c5d4f0;
  transform: translateX(3px);
}

.link:hover .icon {
  opacity: 1;
}

/* ACTIVE */
.link.router-link-exact-active {
  background: linear-gradient(90deg, rgba(30,107,255,.25), rgba(30,107,255,.05));
  color: #5b9aff;
  font-weight: 500;
  box-shadow: inset 0 0 8px rgba(30,107,255,.15);
}

.link.router-link-exact-active .icon {
  opacity: 1;
}

/* LEFT BAR INDICATOR */
.link.router-link-exact-active::before {
  content: "";
  position: absolute;
  left: -6px;
  height: 60%;
  width: 3px;
  background: #1e6bff;
  border-radius: 4px;
  box-shadow: 0 0 6px #1e6bff;
}

/* SCROLLBAR */
.nav::-webkit-scrollbar {
  width: 4px;
}
.nav::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.08);
  border-radius: 10px;
}

/* LOGOUT (🔥 IMPROVED) */
.logout {
  margin-top: auto; /* stick bottom */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #1e2d4a;
  background: rgba(255,255,255,0.02);
  color: #6b80a8;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s ease;
}

.logout:hover {
  background: rgba(239,68,68,.08);
  color: #ef4444;
  border-color: #ef4444;
  transform: translateY(-1px);
}
</style>