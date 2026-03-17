<script setup lang="ts">
import {
  Star,
  StarHalf,
  Coffee,
  Leaf,
  Sofa,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

useSeoMeta({
  title: "Cafe Trefiko - Kesegaran Kopi Pilihan",
});
</script>

<template>
  <!-- Hero Section -->
  <section class="px-6 lg:px-40 py-12">
    <div
      class="flex flex-col gap-10 md:flex-row items-center max-w-[1280px] mx-auto"
    >
      <div
        class="w-full md:w-1/2 aspect-square md:aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-3xl shadow-2xl relative overflow-hidden"
        style="
          background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuAg4VdD8z4DUQeOxb5I0wPvsO-CK7J3iaJgpLtTk5cY2WWboVrzoFtV0_ciuACoR7jUfPCN7qHFSQE9TSinT9SUkuZrNofAyIht2-lf9KoDi82700Nro63yDFouekRM01by4Mveqe9NWN9rRAlIiXI30xBP13cJCtyl-IGPLcYL0GrT_vX_XQwwh0LQ6pA7KFDArgBETcE6GJpmyc0BSwTtxi90jXhR09hBH6d6vMzuGWr0ugi3ww-WpMvzFcf6Gw85QT5SDnQQYxI&quot;);
        "
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-background-dark/40 to-transparent"
        />
      </div>

      <div class="flex flex-col gap-8 w-full md:w-1/2">
        <div class="flex flex-col gap-4">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit"
          >
            Terbuka Setiap Hari
          </span>
          <h1
            class="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight"
          >
            Selamat Datang di
            <span class="text-primary">Cafe Trefiko</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-md">
            Nikmati kesegaran kopi pilihan dalam suasana yang modern dan asri.
            Tempat terbaik untuk bersantai, bekerja, dan berkumpul.
          </p>
        </div>
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            to="/menu"
            class="px-8 py-4 rounded-xl bg-primary text-background-dark font-bold text-lg shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all"
          >
            Lihat Menu
          </NuxtLink>
          <button
            class="px-8 py-4 rounded-xl border-2 border-primary/30 font-bold text-lg hover:bg-primary/10 transition-all"
          >
            Reservasi
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- About Us Section -->
  <section id="tentang-kami" class="px-6 lg:px-40 py-20 bg-primary/5">
    <div class="max-w-[1280px] mx-auto flex flex-col gap-12">
      <div class="flex flex-col gap-4 text-center items-center">
        <h2 class="text-4xl font-black tracking-tight">Tentang Kami</h2>
        <div class="h-1.5 w-20 bg-primary rounded-full" />
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mt-2">
          Berawal dari kecintaan kami terhadap kopi dan komunitas, Cafe Trefiko
          hadir untuk memberikan pengalaman kuliner yang segar di tengah kota.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Value 1 -->
        <div
          class="flex flex-col gap-5 p-8 rounded-2xl bg-background-light dark:bg-background-dark/50 border border-primary/10 hover:border-primary/40 transition-all group"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-background-dark group-hover:scale-110 transition-transform"
          >
            <Coffee :size="28" />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold">Kopi Pilihan</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Biji kopi berkualitas dari petani lokal yang dipanggang dengan
              penuh ketelitian.
            </p>
          </div>
        </div>

        <!-- Value 2 -->
        <div
          class="flex flex-col gap-5 p-8 rounded-2xl bg-background-light dark:bg-background-dark/50 border border-primary/10 hover:border-primary/40 transition-all group"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-background-dark group-hover:scale-110 transition-transform"
          >
            <Leaf :size="28" />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold">Bahan Segar</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Menu makanan dibuat setiap hari menggunakan bahan organik terbaik
              dari alam.
            </p>
          </div>
        </div>

        <!-- Value 3 -->
        <div
          class="flex flex-col gap-5 p-8 rounded-2xl bg-background-light dark:bg-background-dark/50 border border-primary/10 hover:border-primary/40 transition-all group"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-background-dark group-hover:scale-110 transition-transform"
          >
            <Sofa :size="28" />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold">Suasana Nyaman</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Desain interior modern dan menenangkan dengan sentuhan alam yang
              hijau.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="px-6 lg:px-40 py-24">
    <div class="max-w-[1280px] mx-auto flex flex-col gap-16">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
      >
        <div class="flex flex-col gap-3">
          <h2 class="text-4xl font-black tracking-tight">Ulasan Pelanggan</h2>
          <p class="text-slate-600 dark:text-slate-400">
            Apa kata mereka yang sudah berkunjung?
          </p>
        </div>
        <div class="flex gap-2">
          <button
            class="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft :size="20" />
          </button>
          <button
            class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-lg shadow-primary/20"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Review 1 -->
        <div
          class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6"
        >
          <div class="flex gap-1 text-primary">
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
          </div>
          <p
            class="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed"
          >
            "Tempatnya sangat nyaman, kopinya juara! Cocok banget buat kerja
            remote atau sekadar ngobrol santai sore hari."
          </p>
          <div class="flex items-center gap-4 mt-auto">
            <div
              class="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary/20 shrink-0"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuB0gr5SJNiSL0UagAeUE5qadfA0cZXGn_hjygyoRiUik3VKsUmkoWEU1NvbVstNQZbjkiKlu15Kv_3QPBeD-eI63Oi_Noozvd2WFYpP5Q8ZdAP9AnrM3-cpiECNZ0lLbsa7bnHjZrRmQbpZc8MD5TArJwY9AdIov7kujbh-VjQtoT6p9BgfKICsoJi0pikzdhGuBMXYn28xwvDja5TRvzkTsluhlk75LlYOcCV8gq2dGRdy6NHM003I25kEoeMry0oLN5cDtDJd2kc&quot;);
              "
            />
            <div>
              <h4 class="font-bold">Andi Pratama</h4>
              <p class="text-sm text-slate-500">2 hari yang lalu</p>
            </div>
          </div>
        </div>

        <!-- Review 2 -->
        <div
          class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6"
        >
          <div class="flex gap-1 text-primary">
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
          </div>
          <p
            class="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed"
          >
            "Suka banget sama konsep hijaunya. Makanan ringannya juga enak-enak,
            favorit saya croissant kejunya. Pelayanan super ramah!"
          </p>
          <div class="flex items-center gap-4 mt-auto">
            <div
              class="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary/20 shrink-0"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuAhqaQ0rT1QXVzyiHmZQl8ePxEEg94KCq-G0coxS4RYLLqStP8fTitKsBmt4ckmZENPeb-ysCRcRRRqd4YmWP8ajpTaonnOaAW-nMjHhTuTJKZjGsXbkJhXnD1fOKFgrl_xs6BjTMIqQU5sR9GcNRgz1Mu2k2Nr7drMTMYKDOoFiZLfZ0xXPD7hsOoZlbZQZ28GtFoEiaZlbWTQuNm9GkhlKE-xH5zhcXcvwvFULq9pC_rxRY-ZhYiF2JQCxAq7sqXyqckN44qjuoA&quot;);
              "
            />
            <div>
              <h4 class="font-bold">Siti Aminah</h4>
              <p class="text-sm text-slate-500">1 minggu yang lalu</p>
            </div>
          </div>
        </div>

        <!-- Review 3 -->
        <div
          class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6"
        >
          <div class="flex gap-1 text-primary">
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <Star :size="18" fill="currentColor" />
            <StarHalf :size="18" fill="currentColor" />
          </div>
          <p
            class="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed"
          >
            "Vibe-nya dapet banget, modern tapi tetep asri. Kopinya konsisten
            enaknya. Pasti bakal jadi langganan tetap di sini."
          </p>
          <div class="flex items-center gap-4 mt-auto">
            <div
              class="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary/20 shrink-0"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuA9P27bmVUitP-HUICtUtLx_Xli7wydyp-fHBKvyby8lP5G0PwzpTYXC2YM05i5KmLtTr1ZMK8-ASMLwpPG6u-oPWYmDaonOTrSuxGVL6BLDkwll6wjD-3bz3_WZXtXWnIPsUm36KNvxJfJ6YVqDFS96iXJzF3s2GNxx9miViI5BT5B6t-omMeSGxJaJ5QIUkSxxXKeZrXATbhMHdgjFsTHqJVOpQgthp_JfQzKgDJNpjQyk0tCunctPh_8dUM8nVXNTz5zUuUbb7k&quot;);
              "
            />
            <div>
              <h4 class="font-bold">Budi Santoso</h4>
              <p class="text-sm text-slate-500">2 minggu yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
