<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const emp = {
  id: route.params.id,
  name: route.query.name,
  rate: Number(route.query.rate)
};

const payroll = {
  month:"April 2026",
  basic: emp.rate || 0,

  less:{
    late:500,
    undertime:300,
    absent:1000,
    damages:200,
    advancements:1500
  },

  add:{
    overtime:800,
    holidayRegular:1200,
    holidaySpecial:600,
    nightDiff:400,
    otHoliday:500
  },

  deductions:{
    sss:500,
    hdmf:200,
    philhealth:300,
    tax:700
  }
};

const totalLess = Object.values(payroll.less).reduce((a,b)=>a+b,0);
const totalAdd = Object.values(payroll.add).reduce((a,b)=>a+b,0);
const afterLess = payroll.basic - totalLess;
const afterAdd = afterLess + totalAdd;
const gross = afterAdd;
const totalDeduct = Object.values(payroll.deductions).reduce((a,b)=>a+b,0);
const net = gross - totalDeduct;
</script>

<template>
<div class="employees-wrap">

<div class="employees-header">
<h2>{{ emp.name }}</h2>
<p>{{ payroll.month }}</p>
</div>

<table class="payroll-table">

<tbody>

<tr>
<td class="left"><h3>Basic Pay</h3></td>
<td class="middle"></td>
<td class="right">₱{{ payroll.basic.toLocaleString() }}</td>
</tr>

<tr>
<td class="left"><h3>Less</h3></td>
<td class="middle">
<div>Late — ₱{{ payroll.less.late }}</div>
<div>Undertime — ₱{{ payroll.less.undertime }}</div>
<div>Absent — ₱{{ payroll.less.absent }}</div>
<div>Damages — ₱{{ payroll.less.damages }}</div>
<div>Advancements — ₱{{ payroll.less.advancements }}</div>
</td>
<td class="right">₱{{ totalLess }}</td>
</tr>

<tr class="subtotal">
<td class="left">After Less</td>
<td></td>
<td class="right">₱{{ afterLess }}</td>
</tr>

<tr>
<td class="left"><h3>Add</h3></td>
<td class="middle">
<div>Overtime — ₱{{ payroll.add.overtime }}</div>
<div>Holiday (Regular) — ₱{{ payroll.add.holidayRegular }}</div>
<div>Holiday (Special) — ₱{{ payroll.add.holidaySpecial }}</div>
<div>Night Differential — ₱{{ payroll.add.nightDiff }}</div>
<div>OT Holiday — ₱{{ payroll.add.otHoliday }}</div>
</td>
<td class="right">₱{{ totalAdd }}</td>
</tr>

<tr class="subtotal">
<td class="left">After Add</td>
<td></td>
<td class="right">₱{{ afterAdd }}</td>
</tr>

<tr class="gross">
<td class="left"><h3>Gross Income</h3></td>
<td></td>
<td class="right">₱{{ gross }}</td>
</tr>

<tr>
<td class="left"><h3>Less</h3></td>
<td class="middle">
<div>SSS — ₱{{ payroll.deductions.sss }}</div>
<div>HDMF — ₱{{ payroll.deductions.hdmf }}</div>
<div>PhilHealth — ₱{{ payroll.deductions.philhealth }}</div>
<div>Withholding Tax — ₱{{ payroll.deductions.tax }}</div>
</td>
<td class="right">₱{{ totalDeduct }}</td>
</tr>

<tr class="net">
<td class="left"><h3>Net Income</h3></td>
<td></td>
<td class="right">₱{{ net }}</td>
</tr>

</tbody>

</table>

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

/* TABLE */

.payroll-table{
width:100%;
margin-top:20px;
border-collapse:collapse;
background:#020617;
border:1px solid #1e293b;
}

.payroll-table td{
padding:14px 16px;
border-top:1px solid #1e293b;
vertical-align:top;
}

.left{
width:220px;
color:#cbd5f5;
}

.middle{
color:#94a3b8;
font-size:13px;
line-height:1.6;
}

.right{
width:200px;
text-align:right;
font-weight:600;
}

/* HIERARCHY */

h3{
font-size:14px;
font-weight:600;
color:#e5e7eb;
}

.subtotal td{
border-top:2px solid #1e293b;
font-weight:500;
color:#e5e7eb;
}

.gross td{
border-top:2px solid #334155;
font-weight:700;
}

.net td{
border-top:3px solid #1d4ed8;
font-size:16px;
font-weight:700;
color:#60a5fa;
}
</style>