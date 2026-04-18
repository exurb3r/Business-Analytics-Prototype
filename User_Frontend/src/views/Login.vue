<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

onMounted(() => {
  const token = localStorage.getItem("employeeToken")
  if (token) {
    router.push("/dashboard")
  }
})

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  try {
    const response = await fetch("http://localhost:3500/employees/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || "Login failed"
      loading.value = false
      return
    }

    localStorage.setItem("employeeToken", data.token)
    localStorage.setItem("employeeCredentials", JSON.stringify(data.user))

    router.push("/dashboard")

  } catch (err) {
    error.value = "Server error. Please try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">

    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="brand">
        <h1>Employee Portal</h1>
        <p>Staff Access System</p>
      </div>

      <div class="tagline">
        <h2>Welcome back, employee</h2>
        <p>
          Log in to manage your tasks, track attendance,
          and access your work dashboard securely.
        </p>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <div class="login-card">

        <h2>Employee Login</h2>
        <p class="subtitle">Sign in to continue</p>

        <form @submit.prevent="handleLogin">

          <div v-if="error" class="error-box">
            {{ error }}
          </div>

          <div class="input-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>

        </form>

        <div class="footer-note">
          Secure employee access only
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  font-family: Arial, sans-serif;
}

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #0a192f, #112240);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  border-right: 1px solid #1e3a5f;
}

.brand h1 {
  color: #3b82f6;
  font-size: 28px;
  margin-bottom: 5px;
}

.brand p {
  color: #9ca3af;
  font-size: 14px;
}

.tagline {
  margin-top: 40px;
  max-width: 400px;
}

.tagline h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.tagline p {
  color: #cbd5e1;
  line-height: 1.6;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0a192f;
}

.login-card {
  width: 360px;
  padding: 35px;
  border-radius: 16px;
  background: #112240;
  border: 1px solid #1e3a5f;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
}

h2 {
  color: #3b82f6;
  margin-bottom: 5px;
}

.subtitle {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 12px;
  color: #cbd5e1;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #1e3a5f;
  background: #0a192f;
  color: white;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid #ff4d4d;
  color: #ff6b6b;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 15px;
}

.footer-note {
  margin-top: 15px;
  font-size: 11px;
  color: #64748b;
  text-align: center;
}
</style>