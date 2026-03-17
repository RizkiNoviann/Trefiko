<script setup lang="ts">
import { Coffee, CupSoda, Croissant, PlusCircle } from "lucide-vue-next";

useSeoMeta({
  title: "Menu | Cafe Trefiko",
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col max-w-[1200px] w-full px-6 lg:px-40 py-10">
      <!-- Header Section -->
      <div class="flex flex-col gap-3 mb-10">
        <h1
          class="text-4xl lg:text-5xl font-black leading-tight tracking-tight"
        >
          Our Menu
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Expertly roasted beans, artisanal brewing methods, and locally sourced
          ingredients for a perfect snack.
        </p>
      </div>

      <!-- Category Tabs -->
      <div
        class="sticky top-[57px] bg-background-light dark:bg-background-dark z-40 py-4 mb-8"
      >
        <div
          class="flex border-b border-slate-200 dark:border-slate-800 gap-8 overflow-x-auto no-scrollbar"
        >
          <a
            href="#coffee"
            class="flex flex-col items-center justify-center border-b-[3px] border-primary text-slate-900 dark:text-white pb-3 shrink-0"
          >
            <p class="text-sm font-bold leading-normal tracking-wide">Coffee</p>
          </a>
          <a
            href="#non-coffee"
            class="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-primary pb-3 transition-all shrink-0"
          >
            <p class="text-sm font-bold leading-normal tracking-wide">
              Non-Coffee
            </p>
          </a>
          <a
            href="#snacks"
            class="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-primary pb-3 transition-all shrink-0"
          >
            <p class="text-sm font-bold leading-normal tracking-wide">Snacks</p>
          </a>
        </div>
      </div>

      <!-- Coffee Section -->
      <section class="mb-16 scroll-mt-32" id="coffee">
        <div class="flex items-center gap-3 mb-8">
          <Coffee :size="30" class="text-primary" />
          <h2 class="text-2xl lg:text-3xl font-bold">Coffee Favorites</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuDRuKdu2oKPsrMID1v3utMkNGHHkR-4AwxsuYsN180t5hSGYuIN8A_NzqbLB1gBkf1Ah4dg19-AX0A2SoodEVZ3yITWbtcOiFrrouVd6rGLhu6e7Cbo4Y4lc7Gl2VALGP3rl0mcyx82J_AkNmqAgt--QrHOK2TTgaoDEzZA_KdLI9BUKi36YolAAST02OLZkRmSlbL2rb22Ar9xN0ClNzYapHNRtcIg75m57s2-CafadGSjNkukoAkQW98kZl_qWgJBxUaMKWp6CII&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Vanilla Oat Latte</h3>
                  <span class="text-primary font-bold">$5.50</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  House-made vanilla bean syrup, double espresso, and creamy oat
                  milk.
                </p>
              </div>
              <NuxtLink
                to="/menu/1"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>

          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuBgeel_l3Ey0r3W3IiAr5DoCEm7J2hGIbKWYrQUwMwnT9nrHRtIIVmFqW5zF9PxH98Y52HYmwlAuWFFGV4dPMPY-Xr0maFrkRELPiCgA532YC7vpcMOIPiJUh3b06ydqwld3WcsF8IjT8RFI2eRiUfX8Gaq5MQgOZznLL0Jrz1AtLhV2ylWEY5Lmdul6pdBJYmGv15Y55MdcyTDcqKYYO9jRPGpM2WuM70QXvws23DO4vYhlwKQEsO-TnXhh0Ujb0CLTRSE1HDvOIU&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Nitro Cold Brew</h3>
                  <span class="text-primary font-bold">$4.75</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  Infused with nitrogen for a velvety smooth texture and rich,
                  chocolatey finish.
                </p>
              </div>
              <NuxtLink
                to="/menu/2"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Non-Coffee Section -->
      <section class="mb-16 scroll-mt-32" id="non-coffee">
        <div class="flex items-center gap-3 mb-8">
          <CupSoda :size="30" class="text-primary" />
          <h2 class="text-2xl lg:text-3xl font-bold">
            Refreshing Alternatives
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuBokeoXsjhRXS2hdtqfJcMUgQ5PYL25w7VpEducILruXN_xWcNYRsb1FsCGmionzq_bfBccVly7N2pemW7hSUPT3K7VUlcnXyjk8okiWfNbrRv3-AOCy3yMWgBOmS1kmdzcwUu1PLwqKsOSKAASHo5UN6vBQs_AtwaoP2GQuNH8GYCQEecEPcJinkpKn1IrosWCZL-D3C4khHoRQa0RiubbnAnnV_8WCG1-32iY1YcHUIaIQ-r-IlI7-HWpUOHBt7uNAo95LC6fNFQ&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Matcha Ceremonial Latte</h3>
                  <span class="text-primary font-bold">$6.25</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  Stone-ground Japanese matcha whisked with your choice of milk.
                </p>
              </div>
              <NuxtLink
                to="/menu/3"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>

          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuDyTEcIL3cmJ3cz2_or6CLffZJI20Bgdlxf747UiSOndV9GjQpHx-JVffCGHIVSfEXmX2jPdjK1yxxMABHhfwQ9WWCQLn0GWCpmELp5G8eOshKG8h6c9SF_uWFcWgi9RQaBQFUxFAPOidGuWpCdq_mvcmOusoBvHI7hVGTZkRLJYZNdDBWI-LgIqz2j2PZdmH7_bOx7pYEK5vCT6HCkNs3FjTlVuznM2b-xhpu7YvpKRy_L1lIiL_FQhCwNPAEDh4z6u4VG0w79ZbM&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Hibiscus Berry Iced Tea</h3>
                  <span class="text-primary font-bold">$4.25</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  Tart hibiscus flowers brewed with forest berries and a touch
                  of honey.
                </p>
              </div>
              <NuxtLink
                to="/menu/4"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Snacks Section -->
      <section class="mb-16 scroll-mt-32" id="snacks">
        <div class="flex items-center gap-3 mb-8">
          <Croissant :size="30" class="text-primary" />
          <h2 class="text-2xl lg:text-3xl font-bold">
            Sweet &amp; Savory Snacks
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuByFS6EcpjQTwlMAhO_9RoqLLXaSfu7Mixqi_fKFE8fgGvLUU37122bN-_TsR-OfX2BkgBbUuq4zsHXpPh9BFR0-RMHapGN2Gjh2mm2thbOgqN2SUjLrom_nMtseRGFLxgT7FKUSUT9Kq2zj1A7Z6LEc6q_yn0budHxQtRZ9PLBzjGV1TrZlc-goelZ-HLTYC9E-c7uMfhz4n3FOUc5XzRCVjBW0zxo_54Z-VqU3pTbPrc4E_zQaXb6HDsFUNdLQ47uSwvYt7y59Lk&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Butter Croissant</h3>
                  <span class="text-primary font-bold">$3.95</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  Authentic French-style pastry with 81 layers of buttery
                  goodness.
                </p>
              </div>
              <NuxtLink
                to="/menu/5"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>

          <div
            class="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
          >
            <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <div
                class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuA5cp1qgUNeZHMNuRkGUGUWwcTvtba_muMhAdLymEkJxoq__xwjXDfcHJHT5ZZKDYhVnXhJA37NT_YIhSmjv-sqosuNL4uWeJCQIW0ewQLrkgZEP_ejp5HirOsdizwaA4p7rUlSLPaOG2WjajNDOrk5PwrlkMJBrrhqUniqqTFqErhs8sbi29FTmRjf5CbJQ-12wpiZIayhwp7fZlKSgrSOxBlOJkjvf14uoIzZD2iZFMpEoEzKjlHPAikDYOOqvoybWisb04ieMsU&quot;);
                "
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="font-bold text-lg">Avocado Toast</h3>
                  <span class="text-primary font-bold">$8.50</span>
                </div>
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2"
                >
                  Smashed Hass avocado on toasted sourdough with chili flakes
                  and radish.
                </p>
              </div>
              <NuxtLink
                to="/menu/6"
                class="text-xs font-bold text-primary mt-2 flex items-center gap-1"
              >
                ADD TO ORDER <PlusCircle :size="16" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <div
        class="bg-primary/10 dark:bg-primary/5 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-primary/20"
      >
        <div class="text-center lg:text-left">
          <h3 class="text-2xl font-bold mb-2">Join Trefiko Rewards</h3>
          <p class="text-slate-600 dark:text-slate-400">
            Earn stars for every drink and unlock exclusive menu items.
          </p>
        </div>
        <button
          class="bg-primary text-slate-900 font-bold px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all"
        >
          Sign Up Now
        </button>
      </div>
    </div>
  </div>
</template>
