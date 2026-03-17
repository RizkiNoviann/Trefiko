<script setup lang="ts">
useSeoMeta({
  title: "Cafe Trefiko - Kesegaran Kopi Pilihan",
  description:
    "Nikmati kesegaran kopi pilihan dalam suasana yang modern dan asri. Tempat terbaik untuk bersantai, bekerja, dan berkumpul.",
});
</script>

<template>
  <UApp>
    <div
      class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-300"
    >
      <Navbar />
      <main class="flex-1 pb-16 md:pb-0">
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </UApp>
</template>
