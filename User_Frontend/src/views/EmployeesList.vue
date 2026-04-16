<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const search = ref("");
const sortKey = ref("name");
const sortAsc = ref(true);

const employees = ref([
{ id:1, name:"Maria Santos", email:"maria@email.com", contact:"09171234567", position:"Senior Cashier", rate:15000 },
{ id:2, name:"Jose Reyes", email:"jose@email.com", contact:"09179876543", position:"Warehouse Staff", rate:13000 },
{ id:3, name:"Ana Cruz", email:"ana@email.com", contact:"09175678901", position:"HR Coordinator", rate:18000 },
{ id:4, name:"Carlos Lim", email:"carlos@email.com", contact:"09174561234", position:"Delivery Rider", rate:12000 }
]);

const filtered = computed(()=>{
let data = employees.value.filter(e =>
e.name.toLowerCase().includes(search.value.toLowerCase())
);

data.sort((a,b)=>{
let valA = a[sortKey.value];
let valB = b[sortKey.value];

if(typeof valA === "string") valA = valA.toLowerCase();
if(typeof valB === "string") valB = valB.toLowerCase();

if(valA < valB) return sortAsc.value ? -1 : 1;
if(valA > valB) return sortAsc.value ? 1 : -1;
return 0;
});

return data;
});

const setSort = (key)=>{
if(sortKey.value === key){
sortAsc.value = !sortAsc.value;
}else{
sortKey.value = key;
sortAsc.value = true;
}
};

const openPayroll = (emp)=>{
router.push({ name:"Payroll", params:{ id:emp.id }, query:{ name:emp.name, rate:emp.rate } });
};
</script>

<template>
<div class="employees-wrap">

<div class="employees-header">
<h2>Employee Management</h2>
<p>Manage employees and payroll access</p>
</div>

<div class="employees-toolbar">
<input v-model="search" placeholder="Search employee..." />
</div>

<div class="employees-table-wrap">

<table class="employees-table">

<thead>
<tr>
<th @click="setSort('name')">Employee</th>
<th>Email</th>
<th>Contact</th>
<th>Position</th>
<th @click="setSort('rate')" class="right">Basic Pay</th>
<th class="center">Action</th>
</tr>
</thead>

<tbody>

<tr 
v-for="emp in filtered" 
:key="emp.id"
class="employees-row"
>

<td @click="openPayroll(emp)" class="clickable">
<div class="emp-name">{{ emp.name }}</div>
</td>

<td>{{ emp.email }}</td>
<td>{{ emp.contact }}</td>
<td>{{ emp.position }}</td>

<td class="right">₱{{ emp.rate.toLocaleString() }}</td>

<td class="center">
<button class="view-btn" @click="openPayroll(emp)">View</button>
</td>

</tr>

<tr v-if="filtered.length===0">
<td colspan="6" class="empty">No employees found</td>
</tr>

</tbody>

</table>

</div>

</div>
</template>

<style scoped>
*{box-sizing:border-box;margin:0;padding:0}

.employees-wrap{
padding:28px;
background:#0b1220;
color:#e5e7eb;
min-height:100vh;
font-family:system-ui;
}

/* HEADER */
.employees-header h2{
font-size:22px;
font-weight:600;
color:#fff;
}
.employees-header p{
font-size:13px;
color:#94a3b8;
margin-top:4px;
}

/* TOOLBAR */
.employees-toolbar{
margin:18px 0;
}
.employees-toolbar input{
width:280px;
padding:10px;
border-radius:8px;
border:1px solid #1e293b;
background:#020617;
color:#fff;
}

/* TABLE */
.employees-table-wrap{
background:#020617;
border:1px solid #1e293b;
border-radius:12px;
overflow:hidden;
}

.employees-table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.employees-table thead{
background:#020617;
}

.employees-table th{
text-align:left;
padding:14px;
color:#64748b;
font-weight:500;
border-bottom:1px solid #1e293b;
cursor:pointer;
}

.employees-table td{
padding:14px;
border-top:1px solid #1e293b;
}

.employees-row:hover{
background:#020617;
}

/* ALIGNMENT */
.right{text-align:right}
.center{text-align:center}

/* NAME */
.emp-name{
font-weight:500;
color:#fff;
}

/* CLICKABLE */
.clickable{
cursor:pointer;
}

/* BUTTON */
.view-btn{
background:#1d4ed8;
border:none;
color:white;
padding:6px 12px;
border-radius:6px;
cursor:pointer;
font-size:12px;
}
.view-btn:hover{
background:#2563eb;
}

/* EMPTY */
.empty{
text-align:center;
padding:20px;
color:#64748b;
}
</style>