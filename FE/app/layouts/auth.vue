<template>
  <div
    class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 transition-colors duration-300 dark:bg-background-dark dark:text-slate-100"
  >
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
