<script setup lang="ts">
import { Coffee, Eye, EyeOff } from "lucide-vue-next";
import { useAuth } from "../../composable/useAuth";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Register | Cafe Trefiko",
});

const showPassword = ref(false);
const showConfirm = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const { register, isLoading, errorMessage, getLandingPathByRole } = useAuth();

const handleRegister = async () => {
  try {
    const response = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    await navigateTo(getLandingPathByRole(response.user.role));
  } catch {
    // Error is handled by errorMessage from useAuth.
  }
};
</script>

<template>
  <div
    class="flex flex-1 items-center justify-center px-6 py-12 relative overflow-hidden"
  >
    <!-- Background Decoration -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-5 overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-125 h-125 bg-primary rounded-full blur-[120px] -mr-64 -mt-64"
      />
      <div
        class="absolute bottom-0 left-0 w-100 h-100 bg-primary rounded-full blur-[100px] -ml-48 -mb-48"
      />
    </div>

    <div class="w-full max-w-120 space-y-8 relative z-10">
      <!-- Header -->
      <div class="flex flex-col items-center text-center space-y-2">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
        >
          <div class="text-primary flex items-center justify-center">
            <Coffee :size="38" />
          </div>
          <h2 class="text-2xl font-bold leading-tight tracking-tight">
            Cafe Trefiko
          </h2>
        </NuxtLink>

        <h1
          class="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight"
        >
          Create an Account
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-base">
          Join our community and enjoy exclusive coffee perks.
        </p>
      </div>

      <!-- Form Card -->
      <div
        class="bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
      >
        <form class="space-y-4" @submit.prevent="handleRegister">
          <label class="block">
            <span
              class="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block"
            >
              Full Name
            </span>
            <input
              v-model="name"
              class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base transition-all outline-none"
              placeholder="Enter your full name"
              type="text"
              required
            />
          </label>

          <label class="block">
            <span
              class="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block"
            >
              Email Address
            </span>
            <input
              v-model="email"
              class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base transition-all outline-none"
              placeholder="Enter your email"
              type="email"
              required
            />
          </label>

          <label class="block">
            <span
              class="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block"
            >
              Password
            </span>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 pr-12 text-base transition-all outline-none"
                placeholder="Create a password"
                required
                minlength="6"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </label>

          <label class="block">
            <span
              class="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block"
            >
              Confirm Password
            </span>
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="confirmPassword"
                class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 pr-12 text-base transition-all outline-none"
                placeholder="Confirm your password"
                required
                minlength="6"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                @click="showConfirm = !showConfirm"
              >
                <Eye v-if="!showConfirm" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </label>

          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {{ isLoading ? "Loading..." : "Sign Up" }}
          </button>
        </form>
      </div>

      <div class="text-center">
        <p class="text-slate-600 dark:text-slate-400 text-sm">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="text-primary font-bold hover:underline"
          >
            Log In
          </NuxtLink>
        </p>
      </div>

      <div class="text-center text-xs text-slate-500">
        By signing up, you agree to our
        <a class="underline" href="#">Terms of Service</a> and
        <a class="underline" href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>
