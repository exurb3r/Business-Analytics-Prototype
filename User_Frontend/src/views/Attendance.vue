<script setup>
import { ref, computed } from "vue";

const employees = [
{ id:1, name:"Maria Santos", position:"Senior Cashier", schedule:"Mon–Fri 8:00 AM – 5:00 PM", rate:90, nightWorker:false },
{ id:2, name:"Jose Reyes", position:"Warehouse Staff", schedule:"Mon–Fri 10:00 PM – 6:00 AM", rate:75, nightWorker:true },
{ id:3, name:"Ana Cruz", position:"HR Coordinator", schedule:"Mon–Fri 8:00 AM – 5:00 PM", rate:120, nightWorker:false },
{ id:4, name:"Carlos Lim", position:"Delivery Rider", schedule:"Mon–Fri 8:00 AM – 5:00 PM", rate:65, nightWorker:false }
];

const logs = ref([
{ id:101, empId:1, date:"2026-04-16", timeIn:"08:05", timeOut:"18:30", breakOut:"12:00", breakReturn:"13:00", status:["Late","Overtime"] },
{ id:102, empId:2, date:"2026-04-16", timeIn:"22:00", timeOut:"06:00", breakOut:"02:00", breakReturn:"02:30", status:["On-time"] },
{ id:103, empId:3, date:"2026-04-15", timeIn:"08:00", timeOut:"16:00", breakOut:"12:00", breakReturn:"13:00", status:["Undertime"] },
{ id:104, empId:4, date:"2026-04-14", timeIn:null, timeOut:null, breakOut:null, breakReturn:null, status:["Absent"] }
]);

const dateFilter = ref("all");
const selectedDate = ref("");

const filteredLogs = computed(()=>{
if(dateFilter.value==="all") return logs.value;
const today = new Date().toDateString();
if(dateFilter.value==="today"){
return logs.value.filter(l=>new Date(l.date).toDateString()===today);
}
if(dateFilter.value==="custom" && selectedDate.value){
return logs.value.filter(l=>new Date(l.date).toDateString()===new Date(selectedDate.value).toDateString());
}
return logs.value;
});

const initials = (name)=> name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
const formatDate = (date)=> new Date(date).toLocaleDateString();

const toMin = (t)=>{
if(!t) return 0;
const [h,m] = t.split(":").map(Number);
return h*60+m;
};

const computePay = (log,emp)=>{
if(log.status.includes("Absent")){
return { lateDeduct:0, utDeduct:0, otAdd:0, nightDiff:0, total:0 };
}
const rate = emp.rate;
const perMin = rate/60;
const schedStart = 8*60;
const schedEnd = 17*60;

let inMin = toMin(log.timeIn);
let outMin = toMin(log.timeOut);
if(outMin<inMin) outMin+=1440;

const breakMin = log.breakOut ? toMin(log.breakReturn)-toMin(log.breakOut) : 60;
const worked = outMin-inMin-breakMin;

const lateMin = Math.max(0,inMin-schedStart);
const utMin = Math.max(0,schedEnd-outMin);
const otMin = Math.max(0,worked-(8*60));

const lateDeduct = lateMin*perMin;
const utDeduct = utMin*perMin;
const otAdd = otMin*perMin*1.25;
const nightDiff = emp.nightWorker ? worked*perMin*0.10 : 0;

const total = Math.max(0,rate - lateDeduct - utDeduct + otAdd + nightDiff);

return { lateDeduct, utDeduct, otAdd, nightDiff, total };
};

const selectedLog = ref(null);
const openLog = (log)=> selectedLog.value = log;
const closeModal = ()=> selectedLog.value = null;
</script>

<template>
<div class="attendance-wrap">

<div class="attendance-header">
<h2>Payroll Logbook</h2>
<p>Attendance and payroll records</p>
</div>

<div class="attendance-filter">
<select v-model="dateFilter">
<option value="all">All</option>
<option value="today">Today</option>
<option value="custom">Custom</option>
</select>
<input v-if="dateFilter==='custom'" type="date" v-model="selectedDate"/>
</div>

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
<tr v-for="log in filteredLogs" :key="log.id" class="attendance-row" @click="openLog(log)">
<td>
<div class="attendance-emp">
<div class="attendance-avatar">
{{ initials(employees.find(e=>e.id===log.empId).name) }}
</div>
<div>
<div class="attendance-name">{{ employees.find(e=>e.id===log.empId).name }}</div>
<div class="attendance-role">{{ employees.find(e=>e.id===log.empId).position }}</div>
</div>
</div>
</td>
<td>{{ formatDate(log.date) }}</td>
<td>{{ log.timeIn || "-" }}</td>
<td>{{ log.timeOut || "-" }}</td>
<td><span class="attendance-badge">{{ log.status.join(" + ") }}</span></td>
</tr>

<tr v-if="filteredLogs.length===0">
<td colspan="5" class="attendance-empty">No records</td>
</tr>
</tbody>
</table>
</div>

<div v-if="selectedLog" class="attendance-overlay" @click.self="closeModal">
<div class="attendance-modal">

<button class="attendance-close" @click="closeModal">×</button>

<div class="attendance-modal-head">
<div class="attendance-avatar big">
{{ initials(employees.find(e=>e.id===selectedLog.empId).name) }}
</div>
<div>
<h3>{{ employees.find(e=>e.id===selectedLog.empId).name }}</h3>
<p>{{ employees.find(e=>e.id===selectedLog.empId).position }}</p>
</div>
</div>

<div class="attendance-grid">
<div><span>Date</span><b>{{ formatDate(selectedLog.date) }}</b></div>
<div><span>Schedule</span><b>{{ employees.find(e=>e.id===selectedLog.empId).schedule }}</b></div>
<div><span>Time In</span><b>{{ selectedLog.timeIn || "-" }}</b></div>
<div><span>Time Out</span><b>{{ selectedLog.timeOut || "-" }}</b></div>
</div>

<div class="attendance-pay">
<div class="row"><span>Late</span><b>-₱{{ computePay(selectedLog,employees.find(e=>e.id===selectedLog.empId)).lateDeduct.toFixed(2) }}</b></div>
<div class="row"><span>Undertime</span><b>-₱{{ computePay(selectedLog,employees.find(e=>e.id===selectedLog.empId)).utDeduct.toFixed(2) }}</b></div>
<div class="row"><span>Overtime</span><b>+₱{{ computePay(selectedLog,employees.find(e=>e.id===selectedLog.empId)).otAdd.toFixed(2) }}</b></div>
<div class="row"><span>Night</span><b>+₱{{ computePay(selectedLog,employees.find(e=>e.id===selectedLog.empId)).nightDiff.toFixed(2) }}</b></div>
<div class="row total"><span>Total</span><b>₱{{ computePay(selectedLog,employees.find(e=>e.id===selectedLog.empId)).total.toFixed(2) }}</b></div>
</div>

</div>
</div>

</div>
</template>

<style scoped>
*{box-sizing:border-box;margin:0;padding:0}

.attendance-wrap{
padding:24px;
font-family:system-ui;
background:#0b1220;
color:#e5e7eb;
min-height:100vh;
}

.attendance-header h2{
font-size:20px;
font-weight:600;
color:#ffffff;
}
.attendance-header p{
font-size:13px;
color:#94a3b8;
margin-top:4px;
}

.attendance-filter{
display:flex;
gap:10px;
margin:16px 0;
}
.attendance-filter select,
.attendance-filter input{
background:#0f172a;
border:1px solid #1e293b;
color:#e5e7eb;
padding:7px 10px;
border-radius:8px;
}

.attendance-table-wrap{
background:#0f172a;
border:1px solid #1e293b;
border-radius:12px;
overflow:hidden;
}

.attendance-table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.attendance-table thead{
background:#020617;
}
.attendance-table th{
padding:12px;
color:#64748b;
font-weight:500;
text-align:left;
}

.attendance-table td{
padding:12px;
border-top:1px solid #1e293b;
}

.attendance-row:hover{
background:#020617;
cursor:pointer;
}

.attendance-emp{
display:flex;
gap:10px;
align-items:center;
}

.attendance-avatar{
width:34px;
height:34px;
border-radius:50%;
background:#1d4ed8;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-size:12px;
font-weight:600;
}
.attendance-avatar.big{
width:44px;height:44px;
}

.attendance-name{font-weight:500}
.attendance-role{font-size:11px;color:#94a3b8}

.attendance-badge{
background:#1e3a8a;
color:#bfdbfe;
padding:4px 10px;
border-radius:999px;
font-size:11px;
}

.attendance-empty{
text-align:center;
padding:30px;
color:#64748b;
}

.attendance-overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,0.7);
display:flex;
align-items:center;
justify-content:center;
}

.attendance-modal{
background:#020617;
border:1px solid #1e293b;
padding:24px;
border-radius:14px;
width:480px;
max-width:90%;
}

.attendance-close{
background:none;
border:none;
color:white;
font-size:20px;
float:right;
cursor:pointer;
}

.attendance-modal-head{
display:flex;
gap:12px;
margin-bottom:16px;
}

.attendance-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:10px;
font-size:13px;
}
.attendance-grid span{
color:#94a3b8;
display:block;
}

.attendance-pay{
margin-top:16px;
font-size:13px;
}
.attendance-pay .row{
display:flex;
justify-content:space-between;
padding:6px 0;
}
.attendance-pay .total{
border-top:1px solid #1e293b;
margin-top:10px;
padding-top:10px;
font-weight:600;
}
</style>