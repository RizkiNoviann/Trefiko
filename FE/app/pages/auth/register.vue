<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";

useSeoMeta({
  title: "Daftar | Cafe Trefiko",
});

const showPassword = ref(false);
const showConfirm = ref(false);
</script>

<template>
  <div class="flex flex-1 items-center justify-center p-6 lg:py-12">
    <div class="w-full max-w-[480px] space-y-8">
      <!-- Header -->
      <div class="text-left space-y-2">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity w-fit"
        >
          <div
            class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
          >
            <span class="text-background-dark font-black text-lg">T</span>
          </div>
          <span class="text-xl font-bold leading-tight tracking-tight"
            >Cafe Trefiko</span
          >
        </NuxtLink>

        <h1
          class="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-50"
        >
          Create an Account
        </h1>
        <p class="text-slate-600 dark:text-slate-400 font-medium">
          Join our community and enjoy exclusive coffee perks.
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-5">
        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Full Name</label
          >
          <input
            class="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800/50 p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
            placeholder="Enter your full name"
            type="text"
          />
        </div>

        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Email Address</label
          >
          <input
            class="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800/50 p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
            placeholder="Enter your email"
            type="email"
          />
        </div>

        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Password</label
          >
          <div class="relative flex items-center">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800/50 p-4 pr-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
              placeholder="Create a password"
            />
            <button
              type="button"
              class="absolute right-4 text-slate-400 hover:text-primary transition-colors"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label
            class="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >Confirm Password</label
          >
          <div class="relative flex items-center">
            <input
              :type="showConfirm ? 'text' : 'password'"
              class="w-full rounded-lg border border-primary/20 bg-white dark:bg-slate-800/50 p-4 pr-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              class="absolute right-4 text-slate-400 hover:text-primary transition-colors"
              @click="showConfirm = !showConfirm"
            >
              <Eye v-if="!showConfirm" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full rounded-xl bg-primary py-4 text-center text-lg font-bold text-slate-900 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-slate-600 dark:text-slate-400">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="font-bold text-primary hover:underline decoration-2 underline-offset-4"
          >
            Log In
          </NuxtLink>
        </p>
      </div>

      <div class="text-center text-xs text-slate-500 py-4">
        By signing up, you agree to our
        <a class="underline" href="#">Terms of Service</a> and
        <a class="underline" href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>
