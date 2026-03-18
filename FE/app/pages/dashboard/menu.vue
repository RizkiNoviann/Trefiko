<script setup>
definePageMeta({ layout: "dashboard" });

import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";

const activeMenu = "menu";

const menuItems = [
  {
    name: "Caramel Macchiato",
    description: "Espresso-based with vanilla syrup",
    category: "Drinks",
    price: "$4.50",
    visible: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANYYK_Qo6ya9m8DbPXBkiNVav15JhamiUGQ0kQtH7nsqcm8tkTck86eRBZh5_1IyZaZl3zJ0dpbQ7r7Fqpr7vPtFeKbEhwkSoEmU5Oqv7XEMLbSijYxzqbqMqJjJMnrcen8bWtmipllEr3aD34k19hN9zHoh6xhrMjHlgVA5zXUellwu95dNUKm70jr4m4a9WUxpH9nkgCDBmpjQ3nLPiBCMuUYrYMEBm17eNXFV41s5ChNEsyOzOdJAIibopxXjzob2q7TrsGhp8",
  },
  {
    name: "Classic Butter Croissant",
    description: "Flaky, buttery French pastry",
    category: "Bakery",
    price: "$3.75",
    visible: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtzAWXJ8RhyuuLOHbWN4c1GZOWIm1CU3jXqZShYU36Ffxt1ntUQoGo7iUStxdZ51DcNkYMQpX26F9OMJLT1PjEeOCgbLC4EBLSBV2KLnTHyPX7pGyL8R9DbhiihIU54KjnGOqZCytgIdDienYFa3rlMXtD7pnPODYu3UErgRg8LjSDg5VHbWhkJSyS64GAdUdWfcP_052c-199VbM_MXUK8vzqpViswi5CwgmSCzRIRIUCqqnhiDcS-kxdO7_S0TG_vx5M9-mttUc",
  },
  {
    name: "Avocado Sourdough Toast",
    description: "Mashed avocado, poached egg, seeds",
    category: "Breakfast",
    price: "$12.00",
    visible: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3OSXoqi-v53p3medcm-XREOAy0uPhqZ5-vodZOcgGFHJbvTqFinSAjAk67mgorvEUQfOts2YFafGvyDWoOjhoF0k_ojbre_QEvDBs6sHnO-SoG1kSY5qELnEkIH22z5pTZkrxameP4bbnI3UOVDmYtGipUtmzUCV7S0QDwovFocNUQn5Q1nytzLKSUFzwTqULgyjcX_syey-1aZirVGpa9SGWLZ9Q_baBO8feHNbjxYub20lBgPV0L0WIDqm6uTKVNMvLwuWN2KE",
  },
  {
    name: "Iced Americano",
    description: "Double shot espresso over ice",
    category: "Drinks",
    price: "$3.50",
    visible: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2DZsSysc8suN1scv1xoVaUT7fII_fckmILapsvVCtwcjMZ73ZOMDBOY2Z8nQDUtZ3G-GPFUK520uPgYVUeCf68PTHvnm36x0rqUQYJP3F4KehnXO-3rIQyhKONfVyevtBVYhYTwD5pcHuPlD-fUPy6Br4dMWySfBWRpjKZfofo2nCZJFsbEnl9NvhEv1kfh6CprHFtARTx51qVNyBIy-f7mhA57EDdke55UtPnWQzyoa69h6ktNJGlOV1h-TARriql1Nmh_reMW8",
  },
  {
    name: "Signature Glazed Donut",
    description: "Honey glazed, soft brioche dough",
    category: "Desserts",
    price: "$2.95",
    visible: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpbwGWyHAxYXdi_pIcSkfmAjzo7vcvpqHF3wRA2DrzxyDlXLAOHZSUq8cW9Ca6VhGgDPv5r1lkNPc-oMAS0QKkmLobiFiVXv8xgwP_hu6M9JFhBi18ayCXtMFqlZWdIuU7eeGwmUJQIYQAOxDuKALHRL3Q1SHSUCkPyuGJ9GoH02St6uwpj1eyzorSV7ZadnIFkqDnXvegUGewr45alJsA9P2iWyoCtn74WLlWkzFoboIR3orUC0yqdxxcRBxpgXrji0jnd8Fa4u4",
  },
];
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />
    <main class="flex-1 flex flex-col overflow-hidden">
      <NavAdmin
        searchPlaceholder="Search menu items..."
        userName="Alex Trefiko"
        userRole="Store Manager"
      />
      <div class="flex-1 overflow-y-auto p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold">Menu Management</h2>
            <p class="text-slate-500 text-sm">
              Create, edit and organize your cafe offerings.
            </p>
          </div>
          <button
            class="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Add New Menu
          </button>
        </div>

        <!-- Filter Tabs -->
        <div
          class="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-6"
        >
          <button
            class="pb-3 border-b-2 border-primary text-primary font-bold text-sm"
          >
            All Items (24)
          </button>
          <button
            class="pb-3 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
          >
            Coffee &amp; Drinks
          </button>
          <button
            class="pb-3 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
          >
            Breakfast
          </button>
          <button
            class="pb-3 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
          >
            Bakery
          </button>
          <button
            class="pb-3 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
          >
            Desserts
          </button>
        </div>

        <!-- Menu Table -->
        <div
          class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
        >
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[11px] tracking-wider font-bold"
              >
                <th class="px-6 py-4 w-20">Image</th>
                <th class="px-6 py-4">Item Details</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Price</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr
                v-for="(item, index) in menuItems"
                :key="index"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <div
                    class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center"
                    :style="{ backgroundImage: `url('${item.image}')` }"
                  ></div>
                </td>
                <td class="px-6 py-4">
                  <p class="font-bold text-sm">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">{{ item.description }}</p>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 font-semibold text-sm">
                  {{ item.price }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-xs font-medium"
                      :class="
                        item.visible ? 'text-emerald-500' : 'text-slate-400'
                      "
                    >
                      {{ item.visible ? "Visible" : "Hidden" }}
                    </span>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        :checked="item.visible"
                        class="sr-only peer"
                        type="checkbox"
                      />
                      <div
                        class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="p-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <Pencil class="w-5 h-5" />
                    </button>
                    <button
                      class="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Footer -->
          <div
            class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800"
          >
            <p class="text-xs text-slate-500">Showing 5 of 24 items</p>
            <div class="flex items-center gap-2">
              <button
                class="p-1.5 rounded border border-slate-300 dark:border-slate-600 text-slate-500 disabled:opacity-50"
                disabled
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button
                class="w-8 h-8 rounded bg-primary text-slate-900 text-xs font-bold"
              >
                1
              </button>
              <button
                class="w-8 h-8 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium"
              >
                2
              </button>
              <button
                class="w-8 h-8 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium"
              >
                3
              </button>
              <button
                class="p-1.5 rounded border border-slate-300 dark:border-slate-600 text-slate-500"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
