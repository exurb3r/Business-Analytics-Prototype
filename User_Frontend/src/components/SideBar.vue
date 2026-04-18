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
      <div class="logo-box">B</div>
      <div>
        <p class="brand">Hotdog ni MD</p>
        <span class="sub">Admin Controls</span>
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
        <span> My Payrolls </span>
      </router-link>

      <router-link to="/attendance" class="link">
        <CalendarClock class="icon" />
        <span>My Attendance</span>
      </router-link>


      <router-link to="/notifications" class="link">
        <Bell class="icon" />
        <span>Notifications</span>
      </router-link>

      <p class="section">OTHER</p>

      <router-link to="/reports" class="link">
        <BarChart3 class="icon" />
        <span>Reports</span>
      </router-link>

      <router-link to="/settings" class="link">
        <Settings class="icon" />
        <span>Settings</span>
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

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
}
.logo-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #1e6bff, #0a3fa8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
}
.brand {
  color: white;
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
  gap: 3px;
  overflow-y: auto;
  padding-right: 2px;
}
.nav::-webkit-scrollbar        { width: 4px; }
.nav::-webkit-scrollbar-track  { background: transparent; }
.nav::-webkit-scrollbar-thumb  { background: transparent; border-radius: 10px; }
.nav:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); }
.nav { scrollbar-width: thin; scrollbar-color: transparent transparent; }
.nav:hover { scrollbar-color: rgba(255,255,255,.1) transparent; }

/* SECTION LABEL */
.section {
  font-size: 9px;
  color: #3d5278;
  margin-top: 16px;
  margin-bottom: 4px;
  letter-spacing: 1.2px;
  padding-left: 10px;
}

/* LINK */
.link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 9px;
  color: #6b80a8;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  transition: all .15s ease;
}
.icon {
  width: 15px;
  height: 15px;
  opacity: .8;
}
.link:hover {
  background: rgba(255,255,255,.04);
  color: #c5d4f0;
}
.link.router-link-exact-active {
  background: rgba(30,107,255,.15);
  color: #5b9aff;
  font-weight: 500;
}
.link.router-link-exact-active::before {
  content: "";
  position: absolute;
  left: -4px;
  height: 50%;
  width: 3px;
  background: #1e6bff;
  border-radius: 4px;
}

/* LOGOUT */
.logout {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px;
  border-radius: 9px;
  border: 1px solid #1e2d4a;
  background: transparent;
  color: #6b80a8;
  font-size: 13px;
  cursor: pointer;
  transition: .15s;
}
.logout:hover {
  background: rgba(30,107,255,.08);
  color: #5b9aff;
  border-color: #1e6bff;
}
</style>