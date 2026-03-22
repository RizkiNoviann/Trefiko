// composable/useCart.ts
import { ref, computed } from "vue";
import type { MenuItem } from "~/types/api";

export interface CartItem {
  menu: MenuItem;
  quantity: number;
  temperature?: "hot" | "iced";
}

// Global singleton state — shared across pages
const cartItems = ref<CartItem[]>([]);

export const useCart = () => {
  const addToCart = (
    menu: MenuItem,
    quantity: number = 1,
    temperature?: "hot" | "iced",
  ) => {
    const existing = cartItems.value.find((item) => item.menu.id === menu.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.value.push({ menu, quantity, temperature });
    }
  };

  const removeFromCart = (menuId: string | number) => {
    cartItems.value = cartItems.value.filter((item) => item.menu.id !== menuId);
  };

  const setItemQuantity = (
    menu: MenuItem,
    quantity: number,
    temperature?: "hot" | "iced",
  ) => {
    const normalizedQuantity = Math.max(0, Math.floor(quantity));
    const existing = cartItems.value.find((item) => item.menu.id === menu.id);

    if (normalizedQuantity === 0) {
      removeFromCart(menu.id);
      return;
    }

    if (existing) {
      existing.quantity = normalizedQuantity;
      if (temperature) {
        existing.temperature = temperature;
      }
      return;
    }

    cartItems.value.push({
      menu,
      quantity: normalizedQuantity,
      temperature,
    });
  };

  const increaseQty = (menuId: string | number) => {
    const item = cartItems.value.find((i) => i.menu.id === menuId);
    if (item) item.quantity += 1;
  };

  const decreaseQty = (menuId: string | number) => {
    const item = cartItems.value.find((i) => i.menu.id === menuId);
    if (!item) return;
    if (item.quantity <= 1) {
      removeFromCart(menuId);
    } else {
      item.quantity -= 1;
    }
  };

  const totalItems = computed(() =>
    cartItems.value.reduce((acc, item) => acc + item.quantity, 0),
  );

  const totalPrice = computed(() =>
    cartItems.value.reduce(
      (acc, item) => acc + item.menu.price * item.quantity,
      0,
    ),
  );

  const itemNames = computed(() =>
    cartItems.value.map((item) => item.menu.title).join(", "),
  );

  const hasItems = computed(() => cartItems.value.length > 0);

  const clearCart = () => {
    cartItems.value = [];
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    setItemQuantity,
    increaseQty,
    decreaseQty,
    totalItems,
    totalPrice,
    itemNames,
    hasItems,
    clearCart,
  };
};