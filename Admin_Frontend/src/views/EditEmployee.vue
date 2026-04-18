<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref("");
const success = ref("");
const token = localStorage.getItem("adminToken");

// ✅ CLEAN FORM (NO EXTRA FIELDS)
const form = ref({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  contactNum: "",
  address: "",
  contactPerson: "",
  contactPersonNum: "",
  position: "",
  basicPay: "",
  timeIn: "",
  timeOut: "",
  breakStart: "",
  breakEnd: "",
  workingDays: []
});

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];


// 🔥 FETCH EMPLOYEE (FIXED)
const fetchEmployee = async () => {
  error.value = "";

  try {
    const res = await fetch(
      `http://localhost:3500/admins/updateEmployee/${route.params.email}`, // ✅ FIXED
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message || "Failed to fetch employee";
      return;
    }

    form.value = {
      firstname: data.firstname || "",
      lastname: data.lastname || "",
      username: data.username || "",
      email: data.email || "",
      contactNum: data.contactNum || "",
      address: data.address || "",
      contactPerson: data.contactPerson || "",
      contactPersonNum: data.contactPersonNum || "",
      position: data.position || "",
      basicPay: data.basicPay || "",
      timeIn: data.timeIn || "",
      timeOut: data.timeOut || "",
      breakStart: data.breakStart || "",
      breakEnd: data.breakEnd || "",
      workingDays: (data.workingDays || []).map(d => d.day)
    };

  } catch (err) {
    console.error(err);
    error.value = "Server error while fetching employee";
  }
};


// 🔥 TOGGLE WORKING DAYS
const toggleDay = (day) => {
  if (form.value.workingDays.includes(day)) {
    form.value.workingDays =
      form.value.workingDays.filter(d => d !== day);
  } else {
    form.value.workingDays.push(day);
  }
};


// 🔥 UPDATE EMPLOYEE
const submit = async () => {
  error.value = "";
  success.value = "";

  try {
    loading.value = true;

    // ✅ CLEAN PAYLOAD (ONLY WHAT BACKEND NEEDS)
    const payload = {
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      username: form.value.username,
      email: form.value.email,
      contactNum: form.value.contactNum,
      address: form.value.address,
      contactPerson: form.value.contactPerson,
      contactPersonNum: form.value.contactPersonNum,
      position: form.value.position,
      basicPay: Number(form.value.basicPay),
      timeIn: form.value.timeIn,
      timeOut: form.value.timeOut,
      breakStart: form.value.breakStart,
      breakEnd: form.value.breakEnd,
      workingDays: form.value.workingDays.map(d => ({ day: d }))
    };

    const res = await fetch(
      `http://localhost:3500/admins/updateEmployee/${route.params.email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message || "Update failed";
      return;
    }

    success.value = "Employee updated successfully";

    setTimeout(() => {
      router.push({ name: "Employees" });
    }, 1000);

  } catch (err) {
    console.error(err);
    error.value = "Server error during update";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEmployee);
</script>


<template>
<div class="wrap">

  <div class="page-header">
    <h2>Edit Employee</h2>
    <p>Update employee information</p>
  </div>

  <div v-if="error" class="alert error">{{ error }}</div>
  <div v-if="success" class="alert success">{{ success }}</div>

  <div class="card">

    <!-- 👤 BASIC INFO -->
    <div class="section">
      <h3>Basic Information</h3>
      <div class="grid">
        <input v-model="form.firstname" placeholder="First name" />
        <input v-model="form.lastname" placeholder="Last name" />
        <input v-model="form.username" placeholder="Username" />
        <input v-model="form.email" placeholder="Email" />
      </div>
    </div>

    <!-- 📞 CONTACT -->
    <div class="section">
      <h3>Contact Details</h3>
      <div class="grid">
        <input v-model="form.contactNum" placeholder="Contact number" />
        <input v-model="form.address" placeholder="Address" />
        <input v-model="form.contactPerson" placeholder="Emergency contact" />
        <input v-model="form.contactPersonNum" placeholder="Emergency number" />
      </div>
    </div>

    <!-- 💼 JOB -->
    <div class="section">
      <h3>Job Information</h3>
      <div class="grid">
        <input v-model="form.position" placeholder="Position" />
        <input v-model="form.basicPay" type="number" placeholder="Basic Pay" />
      </div>
    </div>

    <!-- 📅 WORKING DAYS -->
    <div class="section">
      <h3>Working Days</h3>
      <div class="days">
        <button
          v-for="d in days"
          :key="d"
          type="button"
          :class="{ active: form.workingDays.includes(d) }"
          @click="toggleDay(d)"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <!-- ⏰ TIME -->
    <div class="section">
      <h3>Schedule</h3>
      <div class="grid">
        <input v-model="form.timeIn" type="time" />
        <input v-model="form.timeOut" type="time" />
        <input v-model="form.breakStart" type="time" />
        <input v-model="form.breakEnd" type="time" />
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <button class="btn secondary" @click="router.back()">Cancel</button>
      <button class="btn primary" @click="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Update Employee" }}
      </button>
    </div>

  </div>

</div>
</template>
<style scoped>
.wrap {
  padding: 32px;
  background: #0b1220;
  color: #e2e8f0;
  min-height: 100vh;
}

/* HEADER */
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  font-size: 22px;
  font-weight: 600;
}
.page-header p {
  color: #94a3b8;
  font-size: 14px;
}

/* CARD */
.card {
  background: #111827;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* SECTION */
.section {
  margin-bottom: 22px;
}
.section h3 {
  margin-bottom: 10px;
  font-size: 14px;
  color: #94a3b8;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* INPUT */
input {
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  background: #020617;
  color: white;
  transition: 0.2s;
}
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* DAYS */
.days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.days button {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #1e293b;
  background: #020617;
  color: #94a3b8;
  transition: 0.2s;
}
.days button:hover {
  border-color: #3b82f6;
}
.days button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* ALERT */
.alert {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}
.alert.error {
  background: #7f1d1d;
  color: #fecaca;
}
.alert.success {
  background: #064e3b;
  color: #6ee7b7;
}

/* ACTIONS */
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* BUTTONS */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}
.btn.primary {
  background: #3b82f6;
  color: white;
}
.btn.primary:hover {
  background: #2563eb;
}
.btn.secondary {
  background: #1e293b;
  color: #cbd5f5;
}
.btn.secondary:hover {
  background: #334155;
}
</style>