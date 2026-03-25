<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description: string;
    actionLabel?: string;
  }>(),
  {
    actionLabel: "Mengerti",
  },
);

const emit = defineEmits<{
  close: [];
}>();

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/55 px-4"
    @click="onBackdropClick"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-primary/20 bg-white p-6 shadow-2xl dark:bg-slate-900"
    >
      <h3 class="text-lg font-black text-slate-900 dark:text-slate-100">
        {{ props.title }}
      </h3>
      <p
        class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
      >
        {{ props.description }}
      </p>

      <div class="mt-5 flex justify-end">
        <button
          type="button"
          class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
          @click="emit('close')"
        >
          {{ props.actionLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
