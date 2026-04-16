<template>
<div class="notif-container">

<div class="notif-header">
<div>
<h2 class="notif-title">Operations Notifications</h2>
<p class="notif-sub">Monitor employee activity, attendance, and system events</p>
</div>
<button class="btn-readall" @click="markAllRead">Mark all as read</button>
</div>

<div class="filter-tabs">
<button
v-for="tab in tabs" :key="tab.value"
class="tab" :class="{ active: activeFilter === tab.value }"
@click="activeFilter = tab.value"
>
{{ tab.label }}
<span class="tab-count" v-if="tab.value === 'all'">{{ notifications.length }}</span>
<span class="tab-count unread" v-if="tab.value === 'unread' && unreadCount > 0">{{ unreadCount }}</span>
</button>
</div>

<div class="panel">

<div
v-for="notif in filteredNotifs"
:key="notif.id"
class="notif-item"
:class="{ unread: !notif.read }"
>

<div class="notif-indicator" :class="notif.type"></div>

<div class="notif-body">
<div class="notif-top">
<span class="notif-type">{{ formatType(notif.type) }}</span>
<span class="notif-time">{{ notif.time }}</span>
</div>

<p class="notif-message">{{ notif.message }}</p>
</div>

<div class="notif-actions">
<button v-if="!notif.read" @click="markAsRead(notif.id)">Read</button>
<button v-else @click="markAsUnread(notif.id)">Unread</button>
<button class="delete" @click="deleteNotif(notif.id)">Delete</button>
</div>

</div>

<div v-if="filteredNotifs.length === 0" class="empty">
No notifications available
</div>

</div>

</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNotifications } from "../utils/useNotifications";

const { notifications, unreadCount, markAsRead, markAsUnread, markAllRead, deleteNotif } = useNotifications();

const activeFilter = ref("all");

const tabs = [
{ label:"All", value:"all" },
{ label:"Unread", value:"unread" },
{ label:"Attendance", value:"attendance" },
{ label:"Activity", value:"activity" },
{ label:"System", value:"system" }
];

const filteredNotifs = computed(()=>{
if(activeFilter.value==="all") return notifications.value;
if(activeFilter.value==="unread") return notifications.value.filter(n=>!n.read);

return notifications.value.filter(n=>{
if(activeFilter.value==="attendance") return ["late","absent"].includes(n.type);
if(activeFilter.value==="activity") return ["login","checkout"].includes(n.type);
if(activeFilter.value==="system") return n.type==="system";
});
});

const formatType = (type)=>{
if(type==="late") return "Late";
if(type==="absent") return "Absent";
if(type==="login") return "Login";
if(type==="checkout") return "Checkout";
return "System";
};
</script>

<style scoped>
*{box-sizing:border-box;margin:0;padding:0}

.notif-container{
padding:28px;
background:#0b1220;
color:#e5e7eb;
min-height:100vh;
font-family:system-ui;
}

/* HEADER */
.notif-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:24px;
}

.notif-title{
font-size:22px;
font-weight:600;
color:#fff;
}
.notif-sub{
font-size:13px;
color:#94a3b8;
margin-top:4px;
}

.btn-readall{
background:#1e293b;
border:1px solid #334155;
color:#cbd5f5;
padding:8px 14px;
border-radius:8px;
cursor:pointer;
font-size:12px;
}
.btn-readall:hover{
background:#1d4ed8;
color:#fff;
border-color:#1d4ed8;
}

/* TABS */
.filter-tabs{
display:flex;
gap:8px;
margin-bottom:20px;
}

.tab{
background:#020617;
border:1px solid #1e293b;
color:#94a3b8;
padding:7px 14px;
border-radius:20px;
cursor:pointer;
font-size:12px;
display:flex;
gap:6px;
align-items:center;
}
.tab.active{
background:#1d4ed8;
color:#fff;
border-color:#1d4ed8;
}
.tab-count{
background:#1e293b;
padding:2px 6px;
border-radius:999px;
font-size:11px;
}
.tab-count.unread{
background:#2563eb;
color:#fff;
}

/* PANEL */
.panel{
background:#020617;
border:1px solid #1e293b;
border-radius:12px;
overflow:hidden;
}

/* ITEM */
.notif-item{
display:flex;
gap:14px;
padding:16px 18px;
border-top:1px solid #1e293b;
align-items:flex-start;
}
.notif-item:first-child{
border-top:none;
}
.notif-item:hover{
background:#020617;
}
.notif-item.unread{
background:#0f172a;
}

/* INDICATOR */
.notif-indicator{
width:4px;
border-radius:2px;
}

.notif-indicator.late{ background:#f59e0b; }
.notif-indicator.absent{ background:#ef4444; }
.notif-indicator.login{ background:#22c55e; }
.notif-indicator.checkout{ background:#3b82f6; }
.notif-indicator.system{ background:#64748b; }

/* BODY */
.notif-body{
flex:1;
}

.notif-top{
display:flex;
justify-content:space-between;
margin-bottom:4px;
}

.notif-type{
font-size:12px;
color:#94a3b8;
text-transform:uppercase;
}

.notif-time{
font-size:11px;
color:#64748b;
}

.notif-message{
font-size:14px;
color:#e5e7eb;
}

/* ACTIONS */
.notif-actions{
display:flex;
gap:6px;
}

.notif-actions button{
background:#1e293b;
border:none;
padding:6px 10px;
border-radius:6px;
font-size:12px;
color:#cbd5f5;
cursor:pointer;
}
.notif-actions button:hover{
background:#1d4ed8;
color:#fff;
}
.notif-actions .delete:hover{
background:#7f1d1d;
}

/* EMPTY */
.empty{
text-align:center;
padding:40px;
color:#64748b;
font-size:13px;
}
</style>