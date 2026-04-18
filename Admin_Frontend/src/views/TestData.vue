<template>
  <div class="dashboard-container">
    <h2 class="page-title">Test info</h2>

    <div class="form-card">
      <div class="form-grid">

        <!-- EMAIL -->
        <div class="field full">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="employee@company.com" />
        </div>

        <!-- DATE -->
        <div class="field full">
          <label>Date</label>
          <input v-model="form.date" type="date" />
        </div>

        <!-- 🔥 ABSENT TOGGLE -->
        <div class="field full">
          <label class="absent-toggle">
            <input type="checkbox" v-model="form.absent" />
            Mark as Absent
          </label>
        </div>

        <!-- TIME INPUTS -->
        <div class="field">
          <label>Time in</label>
          <input v-model="form.timeIn" type="time" :disabled="form.absent" />
        </div>

        <div class="field">
          <label>Time out</label>
          <input v-model="form.timeOut" type="time" :disabled="form.absent" />
        </div>

        <div class="field">
          <label>Break start</label>
          <input v-model="form.breakStart" type="time" :disabled="form.absent" />
        </div>

        <div class="field">
          <label>Break end</label>
          <input v-model="form.breakEnd" type="time" :disabled="form.absent" />
        </div>

      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

      <button class="submit-btn" :disabled="loading" @click="submitForm">
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>
    </div>

    <!-- MODAL -->
    <div class="modal-overlay" v-if="result" @click.self="result = null">
      <div class="modal">

        <div class="modal-header">
          <h3>Log added</h3>
          <button class="modal-close" @click="result = null">✕</button>
        </div>

        <div class="modal-row">
          <span>Day type</span>
          <span class="badge" :class="badgeClass(result.specification)">
            {{ result.specification }}
          </span>
        </div>

        <div class="modal-row">
          <span>Daily wage</span>
          <span>₱ {{ formatMoney(result.daywage) }}</span>
        </div>

        <div class="modal-row">
          <span>Late</span>
          <span>{{ fmt(result.total_late) }}</span>
        </div>

        <div class="modal-row">
          <span>Undertime</span>
          <span>{{ fmt(result.total_undertime) }}</span>
        </div>

        <div class="modal-row">
          <span>Overtime</span>
          <span>{{ fmt(result.total_overtime) }}</span>
        </div>

        <!-- 🔥 IMPROVED ABSENT DISPLAY -->
        <div class="modal-row">
          <span>Status</span>
          <span :class="result.absent ? 'absent-text' : 'present-text'">
            {{ result.absent ? 'ABSENT (No Pay)' : 'Present' }}
          </span>
        </div>

        <button class="close-btn" @click="result = null">Close</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

// FORM
const form = reactive({
  email: '',
  date: new Date().toISOString().split('T')[0],
  timeIn: '',
  timeOut: '',
  breakStart: '',
  breakEnd: '',
  absent: false
});

// STATE
const loading  = ref(false);
const errorMsg = ref('');
const result   = ref(null);

// 🔥 CLEAR INPUTS WHEN ABSENT
watch(() => form.absent, (val) => {
  if (val) {
    form.timeIn = '';
    form.timeOut = '';
    form.breakStart = '';
    form.breakEnd = '';
  }
});

// FORMAT TIME
const fmt = (mins) => {
  if (!mins) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

// 🔥 MONEY FORMAT (2 DECIMALS)
const formatMoney = (val) => {
  return Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// BADGE
const badgeClass = (spec = '') => {
  const s = spec.toLowerCase();
  if (s.includes('holiday')) return 'holiday';
  if (s.includes('rest')) return 'rest';
  if (result.value?.absent) return 'absent';
  return 'regular';
};

// SUBMIT
const submitForm = async () => {
  errorMsg.value = '';

  if (!form.email || !form.date) {
    errorMsg.value = 'Email and date are required.';
    return;
  }

  loading.value = true;

  try {
    const res = await fetch('http://localhost:3500/test/addData/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        form.email,
        form.date,
        form.absent ? null : form.timeIn,
        form.absent ? null : form.timeOut,
        form.absent ? null : form.breakStart,
        form.absent ? null : form.breakEnd,
      ])
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.value = data.message || 'Something went wrong.';
      return;
    }

    result.value = data;

  } catch {
    errorMsg.value = 'Could not reach server.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-title { color: white; font-size: 20px; font-weight: 600; margin-bottom: 20px; }

.form-card {
  background: #151c2e; border: 1px solid #1e2d4a;
  border-radius: 14px; padding: 24px;
  max-width: 560px;
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
label { font-size: 12px; color: #6b80a8; font-weight: 600; letter-spacing: 0.04em; }
input {
  background: #0d1529; border: 1px solid #1e2d4a;
  border-radius: 8px; padding: 9px 12px;
  color: white; font-size: 13px;
  color-scheme: dark;
}
input:focus { outline: none; border-color: #1e6bff; }

.error-msg { color: #f04040; font-size: 13px; margin-bottom: 10px; }

.submit-btn {
  width: 100%; padding: 10px;
  background: #1e6bff; color: white;
  border: none; border-radius: 8px;
  font-size: 14px; font-weight: 600; cursor: pointer;
}
.submit-btn:hover:not(:disabled) { background: #1a5fe0; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #151c2e; border: 1px solid #1e2d4a;
  border-radius: 16px; padding: 28px;
  width: 380px; max-width: 90vw;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-header h3 { color: white; margin: 0; font-size: 16px; }
.modal-close { background: none; border: none; color: #6b80a8; font-size: 18px; cursor: pointer; }
.modal-close:hover { color: white; }

.modal-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0; border-bottom: 1px solid #1e2d4a;
  font-size: 13px; color: #ddd;
}
.modal-row:last-of-type { border-bottom: none; }
.modal-row span:first-child { color: #6b80a8; }

.badge { padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
.badge.regular { background: rgba(30,107,255,.15); color: #5b9aff; }
.badge.holiday { background: rgba(232,160,32,.15);  color: #e8a020; }
.badge.rest     { background: rgba(29,191,143,.15);  color: #1dbf8f; }
.badge.absent   { background: rgba(240,64,64,.15);   color: #f04040; }

.close-btn {
  width: 100%; margin-top: 16px; padding: 9px;
  background: none; border: 1px solid #1e2d4a;
  color: #6b80a8; border-radius: 8px;
  font-size: 13px; cursor: pointer;
}
.close-btn:hover { background: #1e2d4a; color: white; }
</style>