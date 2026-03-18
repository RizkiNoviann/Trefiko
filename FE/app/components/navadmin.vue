<template>
  <!-- Header Navigation -->
  <header
    class="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0"
  >
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-slate-400">search</span>
      <input
        class="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-400"
        :placeholder="searchPlaceholder"
        type="text"
      />
    </div>
    <div class="flex items-center gap-6">
      <button
        class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined">notifications</span>
        <span
          class="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"
        ></span>
      </button>
      <div class="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-bold">{{ userName }}</p>
          <p class="text-xs text-slate-500">{{ userRole }}</p>
        </div>
        <div
          class="size-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-primary/20"
        >
          <img
            class="w-full h-full object-cover"
            :src="userImage"
            :alt="userName"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  searchPlaceholder: {
    type: String,
    default: "Search...",
  },
  userName: {
    type: String,
    default: "Alex Rivera",
  },
  userRole: {
    type: String,
    default: "Store Manager",
  },
  userImage: {
    type: String,
    default:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMW9y_SHGwzMDkuKNiGz40YM1aUlCvdkm_MiUqMOMIhNPAWyQD1W068w_DC2_qp8Ds6EqFSpwGowNubMkxBDVk872Zw2XZ7d2qzhComa9No6EdNANELVgaQM2PQcJ2Qgokf7o1WlZCQNmJqC2-K3Vsak-4_ekzLz9tdfndaUFoBI6wG6dNlSqsSF-kRANH90w_aODyaTg27WswJrF36o8sd9pQy2UyWQ9bw84tKtjc0_cta0_oq9Jcywg60sx5PFjNfnKk3JkTlfs",
  },
});
</script>

<style scoped>
/* Navigation styles can be added here if needed */
</style>
