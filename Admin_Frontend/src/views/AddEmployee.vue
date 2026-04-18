<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const success = ref("");
const token = localStorage.getItem("adminToken");

const form = ref({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
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
  workingDays: [],
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const toggleDay = (day) => {
  if (form.value.workingDays.includes(day)) {
    form.value.workingDays = form.value.workingDays.filter((d) => d !== day);
  } else {
    form.value.workingDays.push(day);
  }
};

const submit = async () => {
  error.value = "";
  success.value = "";

  const required = ["firstname","lastname","username","email","password","contactNum","address","position","basicPay","timeIn","timeOut","breakStart","breakEnd"];
  for (const field of required) {
    if (!form.value[field]) {
      error.value = `"${field}" is required.`;
      return;
    }
  }

  if (form.value.workingDays.length === 0) {
    error.value = "Please select at least one working day.";
    return;
  }

  // Backend expects workingDays as array of { day: "Monday" } objects (workingDaysSchema)
  const payload = {
    ...form.value,
    basicPay: Number(form.value.basicPay),
    workingDays: form.value.workingDays.map((d) => ({ day: d })),
  };

  try {
    loading.value = true;
    const res = await fetch("http://localhost:3500/admins/addemployee/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message || "Something went wrong.";
      return;
    }

    success.value = "Employee added successfully!";
    setTimeout(() => router.push({ name: "Employees" }), 1500);
  } catch (err) {
    error.value = "Could not connect to the server. Make sure the backend is running.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="wrap">

    <div class="page-header">
      <div class="header-accent"></div>
      <div>
        <h2>Add New Employee</h2>
        <p>Complete all fields to register an employee account</p>
      </div>
    </div>

    <!-- ALERTS -->
    <div v-if="error" class="alert alert-error">
      <span class="alert-icon">✕</span> {{ error }}
    </div>
    <div v-if="success" class="alert alert-success">
      <span class="alert-icon">✓</span> {{ success }}
    </div>

    <form class="emp-form" @submit.prevent="submit">

      <!-- PERSONAL -->
      <div class="card">
        <div class="card-label">
          <span class="card-num">01</span>
          <h3>Personal Information</h3>
        </div>

        <div class="grid-3">
          <div class="field">
            <label>First Name <span class="req">*</span></label>
            <input v-model="form.firstname" placeholder="e.g. Juan" />
          </div>
          <div class="field">
            <label>Last Name <span class="req">*</span></label>
            <input v-model="form.lastname" placeholder="e.g. dela Cruz" />
          </div>
          <div class="field">
            <label>Username <span class="req">*</span></label>
            <input v-model="form.username" placeholder="e.g. jdelacruz" />
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Email Address <span class="req">*</span></label>
            <input v-model="form.email" type="email" placeholder="e.g. juan@company.com" />
          </div>
          <div class="field">
            <label>Password <span class="req">*</span></label>
            <input v-model="form.password" type="password" placeholder="Min. 8 characters" />
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Contact Number <span class="req">*</span></label>
            <input v-model="form.contactNum" placeholder="e.g. 09XXXXXXXXX" />
          </div>
          <div class="field">
            <label>Address <span class="req">*</span></label>
            <input v-model="form.address" placeholder="e.g. Baguio City" />
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Emergency Contact Person</label>
            <input v-model="form.contactPerson" placeholder="Full name" />
          </div>
          <div class="field">
            <label>Emergency Contact Number</label>
            <input v-model="form.contactPersonNum" placeholder="e.g. 09XXXXXXXXX" />
          </div>
        </div>
      </div>

      <!-- EMPLOYMENT -->
      <div class="card">
        <div class="card-label">
          <span class="card-num">02</span>
          <h3>Employment Details</h3>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Position <span class="req">*</span></label>
            <input v-model="form.position" placeholder="e.g. Software Engineer" />
          </div>
          <div class="field">
            <label>Basic Pay (₱) <span class="req">*</span></label>
            <input v-model="form.basicPay" type="number" placeholder="e.g. 20000" min="0" />
          </div>
        </div>
      </div>

      <!-- SCHEDULE -->
      <div class="card">
        <div class="card-label">
          <span class="card-num">03</span>
          <h3>Work Schedule</h3>
        </div>

        <div class="grid-4">
          <div class="field">
            <label>Time In <span class="req">*</span></label>
            <input type="time" v-model="form.timeIn" />
          </div>
          <div class="field">
            <label>Time Out <span class="req">*</span></label>
            <input type="time" v-model="form.timeOut" />
          </div>
          <div class="field">
            <label>Break Start <span class="req">*</span></label>
            <input type="time" v-model="form.breakStart" />
          </div>
          <div class="field">
            <label>Break End <span class="req">*</span></label>
            <input type="time" v-model="form.breakEnd" />
          </div>
        </div>

        <div class="field mt">
          <label>Working Days <span class="req">*</span></label>
          <div class="days-list">
            <button
              v-for="day in days"
              :key="day"
              type="button"
              class="day-btn"
              :class="{ active: form.workingDays.includes(day) }"
              @click="toggleDay(day)"
            >
              {{ day.slice(0, 3) }}
            </button>
          </div>
          <div class="days-full">
            <span v-for="day in form.workingDays" :key="day" class="day-tag">{{ day }}</span>
            <span v-if="form.workingDays.length === 0" class="days-hint">No days selected</span>
          </div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button type="button" class="btn-cancel" @click="router.push({ name: 'Employees' })">
          Cancel
        </button>
        <button type="submit" class="btn-save" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? "Saving…" : "Save Employee" }}</span>
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.wrap {
  padding: 32px 28px;
  background: #080e1a;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* HEADER */
.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}
.header-accent {
  width: 4px;
  height: 40px;
  border-radius: 4px;
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  flex-shrink: 0;
}
.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
  letter-spacing: -0.3px;
}
.page-header p {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

/* ALERTS */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13.5px;
  margin-bottom: 18px;
  font-weight: 500;
}
.alert-icon {
  font-size: 14px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}
.alert-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}
.alert-error .alert-icon { background: rgba(239,68,68,0.2); color: #ef4444; }
.alert-success {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #86efac;
}
.alert-success .alert-icon { background: rgba(34,197,94,0.2); color: #22c55e; }

/* FORM */
.emp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* CARD */
.card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 14px;
  padding: 22px 20px;
}

.card-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1a2540;
}
.card-num {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #3b82f6;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  padding: 2px 8px;
  border-radius: 5px;
  letter-spacing: 0.5px;
}
.card-label h3 {
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
  letter-spacing: -0.2px;
}

/* FIELDS */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.2px;
}
.req { color: #f87171; }

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #1e2d45;
  background: #060c18;
  color: #e2e8f0;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  width: 100%;
}
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
input::placeholder { color: #334155; }
input[type="time"] { color-scheme: dark; }

/* GRIDS */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.grid-2:last-child, .grid-3:last-child, .grid-4:last-child { margin-bottom: 0; }
.mt { margin-top: 4px; }

/* DAYS */
.days-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.day-btn {
  padding: 7px 13px;
  border-radius: 7px;
  border: 1px solid #1e2d45;
  background: #060c18;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.2px;
}
.day-btn:hover { border-color: #3b82f6; color: #93c5fd; }
.day-btn.active {
  background: rgba(59,130,246,0.15);
  border-color: #3b82f6;
  color: #93c5fd;
}

.days-full {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 26px;
}
.day-tag {
  font-size: 11.5px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  color: #a5b4fc;
  padding: 2px 9px;
  border-radius: 5px;
  font-weight: 500;
}
.days-hint {
  font-size: 12px;
  color: #334155;
  font-style: italic;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}
.btn-cancel {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #1e2d45;
  background: transparent;
  color: #64748b;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover { border-color: #334155; color: #94a3b8; }

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 4px 14px rgba(59,130,246,0.25);
}
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-save:active { transform: translateY(0); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid-3, .grid-4 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .wrap { padding: 20px 16px; }
}
</style>