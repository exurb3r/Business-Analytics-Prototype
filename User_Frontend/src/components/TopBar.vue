```vue
<template>
  <div class="topbar">

    <!-- LEFT SECTION -->
    <div class="topbar-left">

      <!-- System label -->
      <div class="page-eyebrow">
        Administrator Panel
      </div>

      <!-- Page Title -->
      <div class="title-row">
        <h2 class="page-title">
          {{ $route.name }}
        </h2>

        <!-- Optional breadcrumb slot -->
        <span class="breadcrumb">
          System / {{ $route.name }}
        </span>
      </div>

    </div>


    <!-- RIGHT SECTION -->
    <div class="topbar-right">

      <!-- Server Status -->
      <div class="system-status">
        <span class="status-dot"></span>
        System Online
      </div>


      <!-- Clock -->
      <div class="clock">
        {{ time }}
      </div>


      <!-- Divider -->
      <div class="divider"></div>


      <!-- Admin Identity Chip -->
      <div class="admin-chip">

        <!-- Text -->
        <div class="admin-text">
          <span class="admin-name">
            {{ adminName }}
          </span>

          <span class="admin-role">
            Administrator
          </span>
        </div>


        <!-- Avatar -->
        <div class="avatar">
          <img
            v-if="adminPhoto"
            :src="adminPhoto"
            alt="Admin Photo"
          />

          <span v-else>
            {{ adminLetter }}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";

/* ---------------------------------------
   ADMIN DATA
----------------------------------------*/

const adminName = localStorage.getItem("adminCredentials")
  ? JSON.parse(localStorage.getItem("adminCredentials")).username
  : "Administrator";

const adminLetter = adminName.charAt(0).toUpperCase();

const adminPhoto = null;


/* ---------------------------------------
   CLOCK
----------------------------------------*/

const time = ref("");

let clockInterval = null;

const updateClock = () => {
  const now = new Date();

  time.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(() => {

  updateClock();

  clockInterval = setInterval(() => {
    updateClock();
  }, 1000);

});


onUnmounted(() => {

  clearInterval(clockInterval);

});
</script>


<style scoped>

/* ---------------------------------------
   TOPBAR CONTAINER
----------------------------------------*/

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 64px;

  padding: 0 28px;

  background: #0a0d14;

  border-bottom: 1px solid #1e2d4a;

  flex-shrink: 0;

  position: relative;

  z-index: 50;
}



/* ---------------------------------------
   LEFT AREA
----------------------------------------*/

.topbar-left {
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 2px;
}



/* ---------------------------------------
   PANEL LABEL
----------------------------------------*/

.page-eyebrow {

  font-size: 10px;

  letter-spacing: 1.5px;

  text-transform: uppercase;

  font-weight: 600;

  color: #2f7bff;

  opacity: 0.8;

}



/* ---------------------------------------
   TITLE ROW
----------------------------------------*/

.title-row {

  display: flex;

  align-items: center;

  gap: 14px;

}



/* ---------------------------------------
   PAGE TITLE
----------------------------------------*/

.page-title {

  font-size: 18px;

  font-weight: 700;

  color: white;

  margin: 0;

  letter-spacing: 0.3px;

}



/* ---------------------------------------
   BREADCRUMB
----------------------------------------*/

.breadcrumb {

  font-size: 12px;

  color: #5c6f91;

  letter-spacing: 0.2px;

}



/* ---------------------------------------
   RIGHT AREA
----------------------------------------*/

.topbar-right {

  display: flex;

  align-items: center;

  gap: 18px;

}



/* ---------------------------------------
   SYSTEM STATUS
----------------------------------------*/

.system-status {

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 12px;

  color: #7a8fb6;

}



.status-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #2fff88;

  box-shadow: 0 0 6px rgba(47,255,136,0.7);

}



/* ---------------------------------------
   CLOCK
----------------------------------------*/

.clock {

  font-size: 13px;

  color: #6b80a8;

  font-variant-numeric: tabular-nums;

  letter-spacing: 0.5px;

}



/* ---------------------------------------
   DIVIDER
----------------------------------------*/

.divider {

  width: 1px;

  height: 26px;

  background: #22345b;

}



/* ---------------------------------------
   ADMIN CHIP
----------------------------------------*/

.admin-chip {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 5px 6px 5px 14px;

  border-radius: 40px;

  border: 1px solid #1e2d4a;

  background: #0f1625;

  transition: all 0.15s ease;

  cursor: default;

}



/* hover interaction */

.admin-chip:hover {

  background: #141e33;

  border-color: #2f7bff;

}



/* ---------------------------------------
   ADMIN TEXT
----------------------------------------*/

.admin-text {

  display: flex;

  flex-direction: column;

  align-items: flex-end;

  gap: 1px;

}



/* NAME */

.admin-name {

  color: #dbe6ff;

  font-size: 13px;

  font-weight: 600;

  line-height: 1;

}



/* ROLE */

.admin-role {

  font-size: 10px;

  color: #2f7bff;

  letter-spacing: 0.4px;

  line-height: 1;

}



/* ---------------------------------------
   AVATAR
----------------------------------------*/

.avatar {

  width: 34px;

  height: 34px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 13px;

  color: white;

  background: linear-gradient(
    135deg,
    #1e6bff,
    #0a3fa8
  );

  border: 1px solid rgba(30,107,255,0.4);

  overflow: hidden;

}



/* IMAGE */

.avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}



/* ---------------------------------------
   RESPONSIVE
----------------------------------------*/

@media (max-width: 900px) {

  .breadcrumb {
    display: none;
  }

  .system-status {
    display: none;
  }

}



@media (max-width: 600px) {

  .clock {
    display: none;
  }

  .admin-role {
    display: none;
  }

}
</style>