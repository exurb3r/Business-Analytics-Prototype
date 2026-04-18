<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const token = localStorage.getItem("adminToken");

// ✅ EMPLOYEE
const emp = {
  email: route.params.email,
  name: route.query.name,
  rate: Number(route.query.rate)
};

// ✅ FORMAT FUNCTION (🔥 MAIN FIX)
const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// ✅ STATE
const payroll = ref(null);
const loading = ref(false);
const error = ref("");

// ✅ FETCH
const fetchPayroll = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(
      `http://localhost:3500/admins/getlistofpayrolls/payroll/${emp.email}/${route.query.month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message;
      return;
    }

    payroll.value = data;

  } catch (err) {
    console.error(err);
    error.value = "Server error";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPayroll);

// ✅ COMPUTATIONS
const totalLess = () =>
  payroll.value
    ? payroll.value.lessPay.lateDeduction +
      payroll.value.lessPay.undertimeDeduction +
      payroll.value.lessPay.absentDeduction +
      payroll.value.lessPay.damages +
      payroll.value.lessPay.advancements
    : 0;

const totalAdd = () =>
  payroll.value
    ? payroll.value.addPay.overtimePay +
      payroll.value.addPay.regularHolidayPay +
      payroll.value.addPay.specialHolidayPay +
      payroll.value.addPay.nightDifferentialPay +
      payroll.value.addPay.otherAdditions
    : 0;

const afterLess = () =>
  payroll.value ? payroll.value.basicPay - totalLess() : 0;

const afterAdd = () =>
  payroll.value ? afterLess() + totalAdd() : 0;

const totalDeduct = () =>
  payroll.value
    ? payroll.value.mandatoryDeductions.sssContribution +
      payroll.value.mandatoryDeductions.hdmfContribution +
      payroll.value.mandatoryDeductions.philHealthContribution +
      payroll.value.mandatoryDeductions.withholdingTax
    : 0;
</script>

<template>
<div class="employees-wrap">

  <div class="employees-header">
    <h2>{{ emp.name }}</h2>
    <p>{{ payroll?.month }}</p>
  </div>

  <div v-if="loading" class="empty">Loading...</div>
  <div v-if="error" class="error">{{ error }}</div>

  <table v-if="payroll" class="payroll-table">
    <tbody>

      <!-- BASIC -->
      <tr>
        <td class="left"><h3>Basic Pay</h3></td>
        <td></td>
        <td class="right">₱{{ formatMoney(payroll.basicPay) }}</td>
      </tr>

      <!-- LESS -->
      <tr>
        <td class="left"><h3>Less</h3></td>
        <td class="middle">
          <div>Late — ₱{{ formatMoney(payroll.lessPay.lateDeduction) }}</div>
          <div>Undertime — ₱{{ formatMoney(payroll.lessPay.undertimeDeduction) }}</div>
          <div>Absent — ₱{{ formatMoney(payroll.lessPay.absentDeduction) }}</div>
          <div>Damages — ₱{{ formatMoney(payroll.lessPay.damages) }}</div>
          <div>Advancements — ₱{{ formatMoney(payroll.lessPay.advancements) }}</div>
        </td>
        <td class="right">₱{{ formatMoney(totalLess()) }}</td>
      </tr>

      <tr class="subtotal">
        <td>After Less</td>
        <td></td>
        <td class="right">₱{{ formatMoney(afterLess()) }}</td>
      </tr>

      <!-- ADD -->
      <tr>
        <td class="left"><h3>Add</h3></td>
        <td class="middle">
          <div>Overtime — ₱{{ formatMoney(payroll.addPay.overtimePay) }}</div>
          <div>Holiday (Regular) — ₱{{ formatMoney(payroll.addPay.regularHolidayPay) }}</div>
          <div>Holiday (Special) — ₱{{ formatMoney(payroll.addPay.specialHolidayPay) }}</div>
          <div>Night Differential — ₱{{ formatMoney(payroll.addPay.nightDifferentialPay) }}</div>
          <div>Other Additions — ₱{{ formatMoney(payroll.addPay.otherAdditions) }}</div>
        </td>
        <td class="right">₱{{ formatMoney(totalAdd()) }}</td>
      </tr>

      <tr class="subtotal">
        <td>After Add</td>
        <td></td>
        <td class="right">₱{{ formatMoney(afterAdd()) }}</td>
      </tr>

      <!-- GROSS -->
      <tr class="gross">
        <td><h3>Gross Income</h3></td>
        <td></td>
        <td class="right">₱{{ formatMoney(payroll.grossPay) }}</td>
      </tr>

      <!-- DEDUCTIONS -->
      <tr>
        <td class="left"><h3>Deductions</h3></td>
        <td class="middle">
          <div>SSS — ₱{{ formatMoney(payroll.mandatoryDeductions.sssContribution) }}</div>
          <div>HDMF — ₱{{ formatMoney(payroll.mandatoryDeductions.hdmfContribution) }}</div>
          <div>PhilHealth — ₱{{ formatMoney(payroll.mandatoryDeductions.philHealthContribution) }}</div>
          <div>Withholding Tax — ₱{{ formatMoney(payroll.mandatoryDeductions.withholdingTax) }}</div>
        </td>
        <td class="right">₱{{ formatMoney(totalDeduct()) }}</td>
      </tr>

      <!-- NET -->
      <tr class="net">
        <td><h3>Net Income</h3></td>
        <td></td>
        <td class="right">₱{{ formatMoney(payroll.netPay) }}</td>
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

.left{width:220px;color:#cbd5f5;}
.middle{color:#94a3b8;font-size:13px;line-height:1.6;}
.right{width:200px;text-align:right;font-weight:600;}

h3{font-size:14px;font-weight:600;color:#e5e7eb;}

.subtotal td{
border-top:2px solid #1e293b;
font-weight:500;
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

.empty, .error{
margin-top:20px;
color:#94a3b8;
}
</style>