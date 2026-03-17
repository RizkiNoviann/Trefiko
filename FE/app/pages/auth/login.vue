<script setup lang="ts">
import { Coffee, User, Eye, EyeOff } from "lucide-vue-next";

useSeoMeta({
  title: "Login | Cafe Trefiko",
});

const showPassword = ref(false);
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
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -mr-64 -mt-64"
      />
      <div
        class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary rounded-full blur-[100px] -ml-48 -mb-48"
      />
    </div>

    <div class="w-full max-w-[480px] space-y-8 relative z-10">
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

        <div
          class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4"
        >
          <User :size="48" class="text-primary" />
        </div>
        <h1
          class="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight"
        >
          Welcome Back
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-base">
          Your daily brew is waiting for you
        </p>
      </div>

      <!-- Form Card -->
      <div
        class="bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
      >
        <div class="space-y-4">
          <label class="block">
            <span
              class="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block"
            >
              Email or Username
            </span>
            <input
              class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base transition-all outline-none"
              placeholder="name@example.com"
              type="text"
            />
          </label>

          <label class="block">
            <div class="flex justify-between items-center mb-2">
              <span
                class="text-slate-700 dark:text-slate-300 text-sm font-semibold"
                >Password</span
              >
              <a
                href="#"
                class="text-primary text-xs font-semibold hover:underline"
                >Forgot password?</a
              >
            </div>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 pr-12 text-base transition-all outline-none"
                placeholder="Enter your password"
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
        </div>

        <button
          class="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Login
        </button>
      </div>

      <p class="text-center text-slate-600 dark:text-slate-400 text-sm">
        Don't have an account?
        <NuxtLink
          to="/auth/register"
          class="text-primary font-bold hover:underline ml-1"
        >
          Create an account
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
