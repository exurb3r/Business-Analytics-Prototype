<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const activeTab = ref<'overview' | 'attendance' | 'lateness' | 'overtime'>('overview')

const tabs = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'attendance', label: '🟢 Attendance' },
  { key: 'lateness', label: '🕐 Lateness' },
  { key: 'overtime', label: '⏫ Overtime' }
]

const ACCENT = '#1e6bff'
const MUTED = '#2a2a2a'
const TEXT = '#aaa'

const chartData = {
  attendance: {
    daily: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [87,92,104,96,110,71,30] },
    weekly: { labels: ['W1','W2','W3','W4'], data: [632,688,702,719] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [2450,2680,2310,2890,3100,3320] }
  },
  late: {
    daily: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [11,9,13,8,14,6,2] },
    weekly: { labels: ['W1','W2','W3','W4'], data: [62,58,66,71] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [210,198,175,233,241,258] }
  },
  overtime: {
    daily: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [15,18,22,14,26,9,3] },
    weekly: { labels: ['W1','W2','W3','W4'], data: [93,101,88,110] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [390,420,360,445,480,512] }
  },
  undertime: {
    daily: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [6,7,9,5,10,3,1] },
    weekly: { labels: ['W1','W2','W3','W4'], data: [34,31,37,40] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [110,98,103,126,134,142] }
  }
}

type DataKey = keyof typeof chartData
type Period = 'daily' | 'weekly' | 'monthly'

const periods = ref<Record<string, Period>>({
  'ov-att': 'weekly',
  'ov-late': 'weekly',
  'ov-ot': 'weekly',
  attendance: 'weekly',
  late: 'weekly',
  overtime: 'weekly'
})

const chartInstances = ref<Record<string, Chart>>({})

function highlightColors(data:number[]){
  const max = Math.max(...data)
  return data.map(v=>v===max?ACCENT:MUTED)
}

function buildChart(canvasId:string,dataKey:DataKey,periodKey:string){
  const canvas=document.getElementById(canvasId) as HTMLCanvasElement
  if(!canvas)return
  const p=periods.value[periodKey]
  const d=chartData[dataKey][p]
  const colors=highlightColors(d.data)

  if(chartInstances.value[canvasId]){
    chartInstances.value[canvasId].destroy()
  }

  chartInstances.value[canvasId]=new Chart(canvas,{
    type:'bar',
    data:{
      labels:d.labels,
      datasets:[{
        data:d.data,
        backgroundColor:colors,
        borderColor:colors,
        borderRadius:6,
        borderSkipped:false
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:ctx=>' '+(ctx.raw as number).toLocaleString()}}
      },
      scales:{
        x:{ticks:{color:TEXT,font:{size:12}},grid:{color:'#1f1f1f'},border:{color:'#333'}},
        y:{ticks:{color:TEXT,font:{size:11}},grid:{color:'#1f1f1f'},border:{color:'#333'}}
      }
    }
  })
}

const chartDefs=[
  {id:'ov-att-chart',key:'attendance',periodKey:'ov-att'},
  {id:'ov-late-chart',key:'late',periodKey:'ov-late'},
  {id:'ov-ot-chart',key:'overtime',periodKey:'ov-ot'},
  {id:'att-chart',key:'attendance',periodKey:'attendance'},
  {id:'late-chart',key:'late',periodKey:'late'},
  {id:'ot-chart',key:'overtime',periodKey:'overtime'}
]

function initCharts(){
  chartDefs.forEach(def=>buildChart(def.id,def.key as DataKey,def.periodKey))
}

function setPeriod(periodKey:string,p:Period){
  periods.value[periodKey]=p
  const def=chartDefs.find(d=>d.periodKey===periodKey)
  if(!def)return
  const c=chartInstances.value[def.id]
  if(!c)return
  const d=chartData[def.key as DataKey][p]
  const colors=highlightColors(d.data)
  c.data.labels=d.labels
  c.data.datasets[0].data=d.data
  ;(c.data.datasets[0] as any).backgroundColor=colors
  ;(c.data.datasets[0] as any).borderColor=colors
  c.update()
}

onMounted(()=>{setTimeout(initCharts,100)})
watch(activeTab,()=>{setTimeout(initCharts,100)})

const stats=ref([
  {label:'Total Log-ins Today',value:'87',icon:'🟢',change:'+6%',up:true},
  {label:'Late Employees',value:'14',icon:'🕐',change:'+2%',up:false},
  {label:'Overtime Today',value:'22',icon:'⏫',change:'+4%',up:true},
  {label:'Undertime',value:'11',icon:'⏬',change:'-1%',up:true}
])

const recentActivity=ref([
  {id:1,type:'in',message:'Maria Santos clocked in',time:'2 mins ago'},
  {id:2,type:'late',message:'Roven Cruz clocked in late',time:'12 mins ago'},
  {id:3,type:'out',message:'Jun Dela Rosa clocked out',time:'1 hour ago'},
  {id:4,type:'ot',message:'Abegail Reyes logged overtime',time:'3 hours ago'},
  {id:5,type:'ut',message:'Kurt Mendez left early',time:'4 hours ago'}
])
</script>

<template>
<div class="reports-container">

<div class="welcome-box">
<div class="welcome-overlay">
<div>
<p class="welcome-text">Reports & Analytics</p>
<h2 class="welcome-name">Attendance System</h2>
<p class="welcome-date">Operational metrics · April 2026</p>
</div>
<div class="welcome-badge">REPORTS</div>
</div>
</div>

<div class="controls-row">
<div class="nav-tabs">
<button v-for="tab in tabs" :key="tab.key"
class="nav-tab"
:class="{active:activeTab===tab.key}"
@click="activeTab=tab.key as any">{{tab.label}}</button>
</div>
</div>

<div v-if="activeTab==='overview'">

<div class="stats-row">
<div v-for="s in stats" :key="s.label" class="box">
<div class="box-icon">{{s.icon}}</div>
<div class="box-body">
<p>{{s.label}}</p>
<h3>{{s.value}}</h3>
</div>
<span class="box-change" :class="s.up?'up':'down'">{{s.change}}</span>
</div>
</div>

<div class="two-col">

<div class="panel">
<div class="panel-header">
<h4 class="panel-title">🟢 Attendance</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['ov-att']===p}"
@click="setPeriod('ov-att',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap"><canvas id="ov-att-chart"></canvas></div>
</div>

<div class="panel">
<div class="panel-header">
<h4 class="panel-title">🕐 Lateness</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['ov-late']===p}"
@click="setPeriod('ov-late',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap"><canvas id="ov-late-chart"></canvas></div>
</div>

</div>

<div class="two-col" style="margin-top:20px;">

<div class="panel">
<div class="panel-header">
<h4 class="panel-title">⏫ Overtime</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['ov-ot']===p}"
@click="setPeriod('ov-ot',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap"><canvas id="ov-ot-chart"></canvas></div>
</div>

<div class="panel">
<h4 class="panel-title">⚡ Recent activity</h4>
<ul class="activity-list">
<li v-for="item in recentActivity" :key="item.id" class="activity-item">
<span class="activity-dot" :class="item.type"></span>
<div>
<p class="activity-main">{{item.message}}</p>
<p class="activity-time">{{item.time}}</p>
</div>
</li>
</ul>
</div>

</div>

</div>

<div v-if="activeTab==='attendance'">
<div class="panel">
<div class="panel-header">
<h4 class="panel-title">Attendance trend</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['attendance']===p}"
@click="setPeriod('attendance',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap large"><canvas id="att-chart"></canvas></div>
</div>
</div>

<div v-if="activeTab==='lateness'">
<div class="panel">
<div class="panel-header">
<h4 class="panel-title">Late employees</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['late']===p}"
@click="setPeriod('late',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap large"><canvas id="late-chart"></canvas></div>
</div>
</div>

<div v-if="activeTab==='overtime'">
<div class="panel">
<div class="panel-header">
<h4 class="panel-title">Overtime</h4>
<div class="period-group">
<button v-for="p in ['daily','weekly','monthly']"
:key="p"
class="period-btn"
:class="{active:periods['overtime']===p}"
@click="setPeriod('overtime',p as Period)">{{p}}</button>
</div>
</div>
<div class="chart-wrap large"><canvas id="ot-chart"></canvas></div>
</div>
</div>

</div>
</template>

<style scoped>
.reports-container{width:100%}

.welcome-box{
border-radius:16px;
margin-bottom:25px;
border:1px solid #1e2d4a;
background:linear-gradient(120deg,#081535 0%,#0d2160 60%,#0d1836 100%);
overflow:hidden;
min-height:130px
}

.welcome-overlay{
padding:28px;
display:flex;
justify-content:space-between;
align-items:center;
min-height:130px
}

.welcome-text{color:#6b80a8;margin:0 0 4px 0;font-size:13px}
.welcome-name{color:white;margin:0 0 6px 0;font-size:24px;font-weight:700}
.welcome-date{color:#6b80a8;margin:0;font-size:13px}

.welcome-badge{
background:rgba(30,107,255,.25);
border:1px solid rgba(30,107,255,.5);
color:#5b9aff;
padding:8px 16px;
border-radius:20px;
font-size:12px;
font-weight:700;
letter-spacing:1px
}

.controls-row{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
gap:12px;
flex-wrap:wrap
}

.nav-tabs{display:flex;gap:6px}

.nav-tab{
background:#151c2e;
border:1px solid #1e2d4a;
color:#6b80a8;
padding:8px 16px;
border-radius:20px;
font-size:13px;
cursor:pointer;
transition:.2s
}

.nav-tab:hover{border-color:#1e6bff;color:#fff}
.nav-tab.active{background:#1e6bff;border-color:#1e6bff;color:white}

.stats-row{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:16px;
margin-bottom:25px
}

.box{
background:#151c2e;
padding:18px;
border-radius:14px;
border:1px solid #1e2d4a;
display:flex;
align-items:center;
gap:14px;
transition:.2s;
cursor:pointer
}

.box:hover{transform:translateY(-3px);border-color:#1e6bff;background:#1a2340}

.box-icon{font-size:24px}

.box-body p{color:#6b80a8;margin:0 0 5px 0;font-size:12px}
.box-body h3{color:white;margin:0;font-size:24px;font-weight:700}

.box-change{font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px}
.box-change.up{background:#133c2f;color:#4ade80}
.box-change.down{background:#3b1f1f;color:#f87171}

.two-col{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px
}

.panel{
background:#151c2e;
border-radius:14px;
border:1px solid #1e2d4a;
padding:20px
}

.panel-title{color:white;margin:0 0 16px 0;font-size:14px;font-weight:600}

.chart-wrap{position:relative;width:100%;height:220px}
.chart-wrap.large{height:280px}

.panel-header{
display:flex;
align-items:center;
justify-content:space-between;
margin-bottom:16px;
flex-wrap:wrap;
gap:10px
}

.period-group{
display:flex;
background:#0e1628;
border:1px solid #1e2d4a;
border-radius:20px;
padding:3px;
gap:2px
}

.period-btn{
background:none;
border:none;
color:#6b80a8;
padding:5px 13px;
border-radius:16px;
font-size:12px;
cursor:pointer
}

.period-btn.active{background:#1e6bff;color:white}
.period-btn:hover{color:white}

.activity-list{list-style:none;padding:0;margin:0}

.activity-item{
display:flex;
align-items:flex-start;
gap:12px;
padding:10px 0;
border-bottom:1px solid #1e2d4a
}

.activity-item:last-child{border-bottom:none}

.activity-dot{
width:9px;
height:9px;
border-radius:50%;
margin-top:4px
}

.activity-dot.in{background:#1e6bff}
.activity-dot.out{background:#6b80a8}
.activity-dot.late{background:#e8a020}
.activity-dot.ot{background:#1dbf8f}
.activity-dot.ut{background:#a855f7}

.activity-main{color:#ddd;margin:0 0 3px 0;font-size:13px}
.activity-time{color:#6b80a8;margin:0;font-size:11px}

@media(max-width:900px){
.two-col{grid-template-columns:1fr}
.stats-row{grid-template-columns:repeat(2,1fr)}
}

@media(max-width:600px){
.stats-row{grid-template-columns:1fr 1fr}
.nav-tabs{flex-wrap:wrap}
}
</style>