<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Leaf,
  Sofa,
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Navigation,
} from "lucide-vue-next";
import { useReview } from "~/composable/useReview";
import type { Review } from "~/types/api";
import heroImage from "~/assets/img/hero.jpg";

useSeoMeta({
  title: "Cafe Trefiko - Kesegaran Kopi Pilihan",
});

const waNumber = "082110737645";
const waLink = `https://wa.me/62${waNumber.replace(/^0/, "")}?text=Halo%20Cafe%20Trefiko%2C%20saya%20ingin%20bertanya%20tentang%20reservasi%20meja.`;
const mapsLink =
  "https://maps.google.com/?q=Trefiko+Gd+611+JATSC+Sukaasih+Tangerang";

const { listPublicReviews } = useReview();

const DISPLAY_COUNT = 3;
const FETCH_LIMIT = 6;

const reviews = ref<Review[]>([]);
const nextCursor = ref<string | null>(null);
const hasMoreReviews = ref(true);
const isLoadingReviews = ref(false);
const reviewErrorMessage = ref("");
const currentStartIndex = ref(0);

const normalizedStartIndex = computed(() => {
  const total = reviews.value.length;
  if (total === 0) {
    return 0;
  }

  return ((currentStartIndex.value % total) + total) % total;
});

const visibleReviews = computed(() => {
  const total = reviews.value.length;
  if (total === 0) {
    return [];
  }

  const count = Math.min(DISPLAY_COUNT, total);

  return Array.from({ length: count }, (_, offset) => {
    const index = (normalizedStartIndex.value + offset) % total;
    return reviews.value[index];
  });
});

const canNavigate = computed(() => reviews.value.length > 1);

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatReviewDate = (value: string) => {
  const parts = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(value));

  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month =
    parts.find((part) => part.type === "month")?.value.toLowerCase() ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";

  return `${day} ${month} ${year}`.trim();
};

const fetchMoreReviews = async () => {
  if (isLoadingReviews.value || !hasMoreReviews.value) {
    return;
  }

  isLoadingReviews.value = true;
  reviewErrorMessage.value = "";

  try {
    const response = await listPublicReviews(
      nextCursor.value ?? undefined,
      FETCH_LIMIT,
    );
    reviews.value = [...reviews.value, ...response.reviews];
    nextCursor.value = response.nextCursor;
    hasMoreReviews.value = response.hasMore;
  } catch (error: any) {
    reviewErrorMessage.value = error?.message || "Gagal memuat ulasan";
  } finally {
    isLoadingReviews.value = false;
  }
};

const goPrevReview = () => {
  if (!canNavigate.value) {
    return;
  }

  currentStartIndex.value -= 1;

  if (hasMoreReviews.value && !isLoadingReviews.value) {
    const remainingLoaded =
      reviews.value.length - (normalizedStartIndex.value + DISPLAY_COUNT);
    if (remainingLoaded <= 1) {
      void fetchMoreReviews();
    }
  }
};

const goNextReview = () => {
  if (!canNavigate.value) {
    return;
  }

  currentStartIndex.value += 1;

  if (hasMoreReviews.value && !isLoadingReviews.value) {
    const remainingLoaded =
      reviews.value.length - (normalizedStartIndex.value + DISPLAY_COUNT);
    if (remainingLoaded <= 1) {
      void fetchMoreReviews();
    }
  }
};

onMounted(async () => {
  await fetchMoreReviews();
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
        :style="{ backgroundImage: `url(${heroImage})` }"
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

  <!-- ===== Location & Contact Section ===== -->
  <section id="lokasi" class="px-6 lg:px-40 py-20">
    <div class="max-w-[1280px] mx-auto flex flex-col gap-12">
      <!-- Section header -->
      <div class="flex flex-col gap-4 items-start">
        <h2 class="text-4xl font-black tracking-tight">
          Lokasi &amp; Kontak Kami
        </h2>
        <div class="h-1.5 w-20 bg-primary rounded-full" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <!-- Left: Contact info + CTA -->
        <div class="flex flex-col gap-8">
          <!-- Info grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Alamat -->
            <div class="flex flex-col gap-2">
              <div
                class="flex items-center gap-2 text-primary font-bold text-sm"
              >
                <MapPin :size="16" />
                Alamat
              </div>
              <p
                class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed"
              >
                Gd 611 JATSC, Sukaasih,<br />
                Kec. Tangerang, Kota Tangerang,<br />
                Banten 15111
              </p>
            </div>

            <!-- Telepon / WhatsApp -->
            <div class="flex flex-col gap-2">
              <div
                class="flex items-center gap-2 text-primary font-bold text-sm"
              >
                <Phone :size="16" />
                Telepon / WhatsApp
              </div>
              <a
                :href="waLink"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
              >
                +62 821-1073-7645
              </a>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <div
                class="flex items-center gap-2 text-primary font-bold text-sm"
              >
                <Mail :size="16" />
                Email
              </div>
              <a
                href="mailto:halo@trefiko.com"
                class="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
              >
                halo@trefiko.com
              </a>
            </div>

            <!-- Sosial Media -->
            <div class="flex flex-col gap-3">
              <div
                class="flex items-center gap-2 text-primary font-bold text-sm"
              >
                <Instagram :size="16" />
                Sosial Media
              </div>
              <a
                href="https://www.instagram.com/trefiko_/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2.5 w-fit group"
              >
                <!-- Instagram gradient icon -->
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                  style="
                    background: linear-gradient(
                      135deg,
                      #f09433 0%,
                      #e6683c 25%,
                      #dc2743 50%,
                      #cc2366 75%,
                      #bc1888 100%
                    );
                  "
                >
                  <Instagram :size="18" />
                </div>
                <span
                  class="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors"
                >
                  @trefiko_
                </span>
              </a>
            </div>
          </div>

          <!-- CTA Card -->
          <div
            class="rounded-2xl bg-primary/10 border border-primary/20 p-6 flex flex-col gap-4"
          >
            <div>
              <p
                class="text-xs font-black uppercase tracking-widest text-primary mb-1"
              >
                Butuh Informasi Lebih Lanjut?
              </p>
              <p
                class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                Tim kami siap melayani reservasi meja atau pertanyaan seputar
                menu melalui WhatsApp.
              </p>
            </div>
            <a
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2.5 w-full sm:w-fit px-6 py-3.5 rounded-xl bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:brightness-105 transition-all active:scale-[0.98]"
            >
              <MessageCircle :size="18" />
              Hubungi Kami Sekarang
            </a>
          </div>
        </div>

        <!-- Right: Maps embed -->
        <div
          class="flex flex-col gap-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl"
        >
          <!-- Map iframe -->
          <div class="relative w-full" style="height: 320px">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6804255648963!2d106.6339237731665!3d-6.173523360492528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f9a3e4f45783%3A0xb0fa22bf551a4027!2sTrefiko!5e0!3m2!1sid!2sid!4v1774147167295!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style="border: 0; display: block"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>

          <!-- Map footer bar -->
          <div
            class="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900"
          >
            <div>
              <p
                class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5"
              >
                Destinasi
              </p>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                Cafe Trefiko Tangerang
              </p>
            </div>
            <a
              :href="mapsLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background-dark font-bold text-xs shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <Navigation :size="14" />
              Petunjuk Arah
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ===== End Location & Contact Section ===== -->

  <!-- Testimonials Section -->
  <section id="ulasan" class="px-6 lg:px-40 py-24 bg-primary/5">
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
            class="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center transition-all"
            :class="
              canNavigate
                ? 'hover:bg-primary hover:text-background-dark'
                : 'cursor-not-allowed opacity-40'
            "
            :disabled="!canNavigate"
            @click="goPrevReview"
          >
            <ChevronLeft :size="20" />
          </button>
          <button
            class="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center transition-all"
            :class="
              canNavigate
                ? 'hover:bg-primary hover:text-background-dark'
                : 'cursor-not-allowed opacity-40'
            "
            :disabled="!canNavigate"
            @click="goNextReview"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>

      <div
        v-if="reviewErrorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
      >
        {{ reviewErrorMessage }}
      </div>

      <div
        v-if="reviews.length === 0 && isLoadingReviews"
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div
          v-for="skeleton in 3"
          :key="`review-skeleton-${skeleton}`"
          class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6"
        >
          <div
            class="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
          />
          <div class="space-y-2">
            <div
              class="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
            />
            <div
              class="h-3 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
            />
            <div
              class="h-3 w-9/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
            />
          </div>
          <div class="mt-auto flex items-center gap-4">
            <div
              class="h-12 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
            />
            <div class="space-y-2">
              <div
                class="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
              />
              <div
                class="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="visibleReviews.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div
          v-for="review in visibleReviews"
          :key="review.id"
          class="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6"
        >
          <div class="flex gap-1 text-primary">
            <Star
              v-for="i in 5"
              :key="i"
              :size="18"
              :class="
                i <= review.rating
                  ? 'fill-current'
                  : 'text-slate-300 dark:text-slate-600'
              "
            />
          </div>
          <p
            class="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed"
          >
            "{{ review.comment }}"
          </p>
          <div class="flex items-center gap-4 mt-auto">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-sm font-black text-primary"
            >
              {{ getInitials(review.user.name) }}
            </div>
            <div>
              <h4 class="font-bold">{{ review.user.name }}</h4>
              <p class="text-sm text-slate-500">
                {{ formatReviewDate(review.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isLoadingReviews && reviews.length > 0"
        class="text-center text-sm text-slate-500"
      >
        Memuat data ulasan berikutnya...
      </div>
    </div>
  </section>
</template>
