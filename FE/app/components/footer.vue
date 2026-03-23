<script setup lang="ts">
import { Globe, Mail, Phone } from "lucide-vue-next";
</script>

<template>
  <footer class="bg-[#0b1a0f] text-slate-100 px-6 lg:px-40 pt-16 md:pt-24">
    <div
      class="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16"
    >
      <!-- Brand -->
      <div class="flex flex-col gap-6">
        <h2 class="text-2xl font-black tracking-tight">Cafe Trefiko</h2>
        <p class="text-slate-400 leading-relaxed">
          Menghadirkan kehangatan kopi dan kesegaran alam di tengah keramaian
          kota. Temukan ketenangan di setiap tegukan.
        </p>
        <div class="flex gap-3">
          <a
            href="#"
            class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all"
          >
            <Globe :size="18" />
          </a>
          <a
            href="#"
            class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all"
          >
            <Mail :size="18" />
          </a>
          <a
            href="#"
            class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all"
          >
            <Phone :size="18" />
          </a>
        </div>
      </div>

      <!-- Navigasi -->
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-bold">Navigasi</h4>
        <ul class="flex flex-col gap-4 text-slate-400">
          <li>
            <NuxtLink to="/" class="hover:text-primary transition-colors"
              >Beranda</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/menu" class="hover:text-primary transition-colors"
              >Menu</NuxtLink
            >
          </li>
          <li>
            <a href="#tentang-kami" class="hover:text-primary transition-colors"
              >Tentang</a
            >
          </li>

          <li>
            <a href="#lokasi" class="hover:text-primary transition-colors"
              >Kontak</a
            >
          </li>

          <li>
            <a href="#ulasan" class="hover:text-primary transition-colors"
              >Ulasan</a
            >
          </li>
        </ul>
      </div>

      <!-- Jam Buka -->
      <div class="flex flex-col gap-6">
        <h4 class="text-lg font-bold">Jam Buka</h4>
        <div class="flex flex-col gap-4 text-slate-400">
          <div class="flex justify-between items-center gap-8">
            <span>Senin - Jumat</span>
            <span class="whitespace-nowrap">08:00 - 22:00</span>
          </div>
          <div class="flex justify-between items-center gap-8">
            <span>Sabtu - Minggu</span>
            <span class="whitespace-nowrap">07:00 - 23:00</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p class="text-sm font-medium text-primary">
            Gd 611 JATSC, Sukaasih, Kec. Tangerang, Kota Tangerang, Banten 15111
          </p>
        </div>
      </div>
    </div>

    <div
      class="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm"
    >
      © {{ new Date().getFullYear() }} Cafe Trefiko. All rights reserved.
    </div>
  </footer>
</template>
