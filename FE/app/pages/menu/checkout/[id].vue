<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Star,
} from "lucide-vue-next";
import { resolveImageUrl } from "~/composable/useImageUrl";
import { useCart } from "~/composable/useCart";
import { useOrder } from "~/composable/useOrder";
import { useReview } from "~/composable/useReview";
import { useAuth } from "~/composable/useAuth";
import type { PaymentMethod } from "~/types/api";
import PaymentMethodInfoModal from "~/components/PaymentMethodInfoModal.vue";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

useSeoMeta({
  title: "Pembayaran | Cafe Trefiko",
});

const config = useRuntimeConfig();
const router = useRouter();
const { isAuthenticated } = useAuth();
const { cartItems, totalPrice, clearCart } = useCart();
const { checkout, confirmDirectPayment } = useOrder();
const { createReview } = useReview();
let snapScriptPromise: Promise<void> | null = null;

const selectedPayment = ref<PaymentMethod>("DIRECT");
const orderNote = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
const showReviewModal = ref(false);
const checkoutOrderId = ref("");
const reviewRating = ref(5);
const reviewComment = ref("");
const isSubmittingReview = ref(false);
const reviewErrorMessage = ref("");
const showPaymentMethodInfoModal = ref(false);
const paymentMethodInfoTitle = ref("");
const paymentMethodInfoDescription = ref("");

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const canCheckout = computed(
  () => cartItems.value.length > 0 && !isSubmitting.value,
);

const showDirectInfoModal = () => {
  paymentMethodInfoTitle.value = "Bayar Langsung Dipilih";
  paymentMethodInfoDescription.value =
    "Setelah pembayaran berhasil, status pesanan akan langsung diproses dan Anda tinggal menunggu pesanan disiapkan.";
  showPaymentMethodInfoModal.value = true;
};

const showCodInfoModal = () => {
  paymentMethodInfoTitle.value = "COD Dipilih";
  paymentMethodInfoDescription.value =
    "Pesanan akan berstatus pending terlebih dahulu. Admin akan mengonfirmasi pesanan sebelum diproses.";
  showPaymentMethodInfoModal.value = true;
};

const closePaymentMethodInfoModal = () => {
  showPaymentMethodInfoModal.value = false;
};

const chooseDirect = () => {
  selectedPayment.value = "DIRECT";
  showDirectInfoModal();
};

const chooseCod = () => {
  selectedPayment.value = "COD";
  showCodInfoModal();
};

const loadSnapScript = async () => {
  if (!import.meta.client) {
    throw new Error("Snap popup hanya tersedia di browser");
  }

  if (window.snap) {
    return;
  }

  if (snapScriptPromise) {
    return snapScriptPromise;
  }

  snapScriptPromise = new Promise<void>((resolve, reject) => {
    const snapScriptUrl = config.public.midtransSnapScriptUrl;

    if (!config.public.midtransClientKey) {
      reject(new Error("Midtrans client key belum dikonfigurasi"));
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${snapScriptUrl}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Gagal memuat Midtrans Snap")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.setAttribute("data-client-key", config.public.midtransClientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.body.appendChild(script);
  });

  return snapScriptPromise;
};

const openSnapPopup = async (snapToken: string, orderId: string) => {
  await loadSnapScript();

  if (!window.snap) {
    throw new Error("Midtrans Snap tidak tersedia");
  }

  return new Promise<void>((resolve, reject) => {
    window.snap?.pay(snapToken, {
      onSuccess: async () => {
        try {
          await confirmDirectPayment(orderId);
          resolve();
        } catch (error: any) {
          reject(
            new Error(
              error?.message ||
                "Pembayaran berhasil tetapi verifikasi order gagal",
            ),
          );
        }
      },
      onPending: () => {
        reject(
          new Error("Pembayaran masih pending. Selesaikan pembayaran dulu."),
        );
      },
      onError: () => {
        reject(new Error("Pembayaran gagal. Silakan coba lagi."));
      },
      onClose: () => {
        reject(new Error("Popup pembayaran ditutup sebelum selesai."));
      },
    });
  });
};

const submitCheckout = async () => {
  errorMessage.value = "";

  if (!isAuthenticated.value) {
    await router.push("/auth/login");
    return;
  }

  if (cartItems.value.length === 0) {
    errorMessage.value = "Keranjang masih kosong.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await checkout({
      payment: selectedPayment.value,
      note: orderNote.value.trim() || undefined,
      items: cartItems.value.map((item) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
        temperature: item.temperature,
      })),
    });

    checkoutOrderId.value = response.order.id;

    if (selectedPayment.value === "DIRECT") {
      if (!response.snapToken) {
        throw new Error("Snap token tidak ditemukan");
      }

      await openSnapPopup(response.snapToken, response.order.id);
    }

    clearCart();
    showReviewModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.message || "Checkout gagal";
  } finally {
    isSubmitting.value = false;
  }
};

const getTargetChartStatus = () => {
  return selectedPayment.value === "COD" ? "PENDING" : "PROCESS";
};

const closeReviewModal = async () => {
  showReviewModal.value = false;
  await router.push({
    path: "/chart",
    query: { status: getTargetChartStatus() },
  });
};

const submitReview = async () => {
  reviewErrorMessage.value = "";

  if (!reviewComment.value.trim()) {
    reviewErrorMessage.value = "Ulasan wajib diisi.";
    return;
  }

  isSubmittingReview.value = true;

  try {
    await createReview({
      orderId: checkoutOrderId.value,
      rating: reviewRating.value,
      comment: reviewComment.value.trim(),
    });

    await closeReviewModal();
  } catch (error: any) {
    reviewErrorMessage.value = error?.message || "Gagal mengirim ulasan";
  } finally {
    isSubmittingReview.value = false;
  }
};

onMounted(() => {
  showDirectInfoModal();
});
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 lg:px-20">
    <div class="mb-3 flex items-center gap-2">
      <NuxtLink
        to="/menu"
        class="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-3xl font-bold tracking-tight">Pembayaran</h1>
    </div>

    <div
      v-if="cartItems.length === 0"
      class="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500"
    >
      Keranjang kosong. Silakan tambah menu dulu dari halaman menu.
    </div>

    <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div
          class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:border-primary/5 dark:bg-slate-900"
        >
          <div class="mb-4 flex items-center gap-3">
            <CreditCard :size="22" class="text-primary" />
            <h3 class="text-lg font-bold">Metode Pembayaran</h3>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              class="flex rounded-xl border-2 p-4 text-left transition-all"
              :class="
                selectedPayment === 'DIRECT'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-primary/40 dark:border-slate-700'
              "
              @click="chooseDirect"
            >
              <div class="flex flex-1 flex-col">
                <span class="text-sm font-bold">Bayar Langsung</span>
              </div>
              <CheckCircle2
                :size="20"
                :class="
                  selectedPayment === 'DIRECT'
                    ? 'text-primary'
                    : 'text-slate-300 dark:text-slate-600'
                "
              />
            </button>

            <button
              type="button"
              class="flex rounded-xl border-2 p-4 text-left transition-all"
              :class="
                selectedPayment === 'COD'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-primary/40 dark:border-slate-700'
              "
              @click="chooseCod"
            >
              <div class="flex flex-1 flex-col">
                <span class="text-sm font-bold">Bayar di Tempat (COD)</span>
              </div>
              <CheckCircle2
                :size="20"
                :class="
                  selectedPayment === 'COD'
                    ? 'text-primary'
                    : 'text-slate-300 dark:text-slate-600'
                "
              />
            </button>
          </div>
        </div>

        <div
          class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:border-primary/5 dark:bg-slate-900"
        >
          <h3 class="mb-3 text-lg font-bold">Catatan Pesanan</h3>
          <textarea
            v-model="orderNote"
            rows="3"
            placeholder="Contoh: tolong tanpa gula, antar jam 10 pagi"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-800"
          />
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Opsional. Catatan ini akan terlihat oleh admin.
          </p>
        </div>

        <div
          class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:border-primary/5 dark:bg-slate-900"
        >
          <h3 class="mb-4 text-lg font-bold">Pesanan Kamu</h3>
          <div class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.menu.id"
              class="flex items-center gap-4"
            >
              <img
                :src="
                  resolveImageUrl(item.menu.image, config.public.apiBaseUrl)
                "
                :alt="item.menu.title"
                class="size-16 shrink-0 rounded-lg object-cover"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold">{{ item.menu.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ item.quantity }}x
                  <span v-if="item.temperature"> • {{ item.temperature }}</span>
                </p>
              </div>
              <p class="text-sm font-semibold">
                {{ formatPrice(item.menu.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          class="sticky top-24 rounded-xl border border-primary/10 bg-white p-6 shadow-md dark:border-primary/5 dark:bg-slate-900"
        >
          <h3 class="mb-6 text-xl font-bold">Ringkasan</h3>

          <div class="space-y-2 border-t border-primary/10 pt-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span class="font-medium">{{ formatPrice(totalPrice) }}</span>
            </div>
            <div
              class="mt-2 flex items-end justify-between border-t border-dashed border-primary/20 pt-3 text-lg font-bold"
            >
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <p
            v-if="errorMessage"
            class="mt-4 text-sm font-semibold text-red-500"
          >
            {{ errorMessage }}
          </p>

          <button
            class="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!canCheckout"
            @click="submitCheckout"
          >
            <span>{{ isSubmitting ? "Memproses..." : "Bayar" }}</span>
            <ArrowRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <PaymentMethodInfoModal
    :open="showPaymentMethodInfoModal"
    :title="paymentMethodInfoTitle"
    :description="paymentMethodInfoDescription"
    @close="closePaymentMethodInfoModal"
  />

  <div
    v-if="showReviewModal"
    class="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/60 px-4"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-primary/20 bg-white p-6 shadow-2xl dark:bg-slate-900"
    >
      <h3 class="text-xl font-black">Pesanan berhasil dibuat</h3>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Bantu kami dengan ulasan singkat setelah klik Bayar.
      </p>

      <div class="mt-5 flex items-center gap-2">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          class="rounded-lg p-1 transition hover:scale-110"
          @click="reviewRating = star"
        >
          <Star
            :size="24"
            :class="
              star <= reviewRating
                ? 'fill-primary text-primary'
                : 'text-slate-300 dark:text-slate-600'
            "
          />
        </button>
      </div>

      <textarea
        v-model="reviewComment"
        rows="4"
        placeholder="Tulis pengalaman kamu di Cafe Trefiko..."
        class="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-800"
      />

      <p v-if="reviewErrorMessage" class="mt-2 text-sm text-red-500">
        {{ reviewErrorMessage }}
      </p>

      <div class="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          @click="closeReviewModal"
        >
          Lewati
        </button>
        <button
          type="button"
          class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 disabled:opacity-60"
          :disabled="isSubmittingReview"
          @click="submitReview"
        >
          {{ isSubmittingReview ? "Mengirim..." : "Kirim Ulasan" }}
        </button>
      </div>
    </div>
  </div>
</template>
