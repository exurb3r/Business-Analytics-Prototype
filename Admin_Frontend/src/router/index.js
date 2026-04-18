import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '../layout/AppLayout.vue'

import Dashboard      from '../views/Dashboard.vue'
import Notifications  from '../views/Notifications.vue'
import Reports        from '../views/Reports.vue'
import Settings       from '../views/Settings.vue'
import AdminLogin     from '../views/Login.vue'
import Attendance from '../views/Attendance.vue'
import EmployeeList from '../views/EmployeesList.vue'
import PayrollView from '../views/PayrollView.vue'
import AddEmployee from '../views/AddEmployee.vue'
import TestData from '../views/TestData.vue'
import Middlepage from '../views/Middlepage.vue'
import EditEmployee from '../views/EditEmployee.vue'
import Calendar from '../views/Calendar.vue'

const routes = [
  // ✅ LOGIN (NO SIDEBAR)
  {
    path: '/login',
    name: 'Admin Login',
    component: AdminLogin
  },

  // ✅ APP (WITH SIDEBAR LAYOUT)
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'notifications', name: 'Notifications', component: Notifications },
      { path: 'reports', name: 'Reports & Analytics', component: Reports },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'attendance', name: 'Attendance', component: Attendance },
      { path: 'employeeslist', name: 'Employee List', component: EmployeeList},
      { path: 'payroll/:email', name: 'Payroll', component: PayrollView },
      { path: 'addemployee', name: 'Add Employee', component: AddEmployee },
      { path: 'testdata', name: 'Test Data', component: TestData},
      { path: "/employee/:email/payrolls", name: "middlepage", component: Middlepage},
      { path: '/editemployee/:email', name: 'EditEmployee', component: EditEmployee },
      { path: '/calendar', name: 'Calendar', component: Calendar}
      
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("adminToken")

  if (to.path !== '/login' && !token) {
    next('/login')
  } 
  else if (to.path === '/login' && token) {
    next('/dashboard')
  } 
  else {
    next()
  }
})

export default router