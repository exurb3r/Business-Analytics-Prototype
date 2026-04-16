<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  name:"",
  email:"",
  contact:"",
  contactPerson:"",
  contactPersonNumber:"",
  position:"",
  timeIn:"",
  timeOut:"",
  breakStart:"",
  breakEnd:"",
  workingDays:[],
  basicPay:""
});

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const toggleDay = (day)=>{
  if(form.value.workingDays.includes(day)){
    form.value.workingDays = form.value.workingDays.filter(d=>d!==day);
  }else{
    form.value.workingDays.push(day);
  }
};

const submit = ()=>{
  if(!form.value.name || !form.value.email){
    alert("Name and Email are required");
    return;
  }

  console.log("Employee Data:", form.value);

  router.push({ name:"Employees" });
};
</script>

<template>
<div class="employees-wrap">

<div class="employees-header">
<h2>Add Employee</h2>
<p>Fill in employee details</p>
</div>

<form class="employees-form" @submit.prevent="submit">

<!-- PERSONAL -->
<div class="section">
<h3>Personal Information</h3>

<div class="grid">
<input v-model="form.name" placeholder="Full Name"/>
<input v-model="form.email" placeholder="Email"/>
<input v-model="form.contact" placeholder="Contact Number"/>
</div>

<div class="grid">
<input v-model="form.contactPerson" placeholder="Emergency Contact Person"/>
<input v-model="form.contactPersonNumber" placeholder="Emergency Contact Number"/>
</div>
</div>

<!-- EMPLOYMENT -->
<div class="section">
<h3>Employment Details</h3>

<div class="grid">
<input v-model="form.position" placeholder="Position"/>
<input v-model="form.basicPay" type="number" placeholder="Basic Pay"/>
</div>
</div>

<!-- SCHEDULE -->
<div class="section">
<h3>Schedule</h3>

<div class="grid">
<div>
<label>Time In</label>
<input type="time" v-model="form.timeIn"/>
</div>

<div>
<label>Time Out</label>
<input type="time" v-model="form.timeOut"/>
</div>

<div>
<label>Break Start</label>
<input type="time" v-model="form.breakStart"/>
</div>

<div>
<label>Break End</label>
<input type="time" v-model="form.breakEnd"/>
</div>
</div>

<div class="days">
<label>Working Days</label>
<div class="days-list">
<div 
v-for="day in days" 
:key="day"
class="day"
:class="{active: form.workingDays.includes(day)}"
@click="toggleDay(day)"
>
{{ day }}
</div>
</div>
</div>

</div>

<!-- ACTION -->
<div class="actions">
<button type="submit">Save Employee</button>
</div>

</form>

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
color:#fff;
font-weight:600;
}
.employees-header p{
color:#94a3b8;
font-size:13px;
margin-top:4px;
}

/* FORM */
.employees-form{
margin-top:20px;
display:flex;
flex-direction:column;
gap:20px;
}

.section{
background:#020617;
border:1px solid #1e293b;
border-radius:12px;
padding:18px;
}

.section h3{
margin-bottom:12px;
font-size:14px;
color:#cbd5f5;
}

/* GRID */
.grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
margin-bottom:12px;
}

input{
padding:10px;
border-radius:8px;
border:1px solid #1e293b;
background:#020617;
color:#fff;
}

/* DAYS */
.days label{
display:block;
margin-bottom:6px;
font-size:13px;
color:#94a3b8;
}

.days-list{
display:flex;
flex-wrap:wrap;
gap:8px;
}

.day{
padding:6px 10px;
border-radius:6px;
border:1px solid #1e293b;
cursor:pointer;
font-size:12px;
color:#94a3b8;
}

.day.active{
background:#1d4ed8;
color:#fff;
border-color:#1d4ed8;
}

/* ACTION */
.actions{
display:flex;
justify-content:flex-end;
}

button{
background:#1d4ed8;
border:none;
padding:10px 16px;
border-radius:8px;
color:#fff;
cursor:pointer;
}
button:hover{
background:#2563eb;
}
</style>