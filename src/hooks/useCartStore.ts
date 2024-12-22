import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

interface CartState {
  cart: currentCart.Cart | null;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => Promise<void>;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => Promise<boolean>;
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>;
  updateItemQuantity: (
    wixClient: WixClient,
    itemId: string,
    quantity: number
  ) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  counter: 0,

  getCart: async (wixClient) => {
    set({ isLoading: true });
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart,
        counter: cart?.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
      set({ isLoading: false });
      throw err;
    }
  },

  addItem: async (wixClient, productId, variantId, quantity) => {
    if (!productId || !wixClient) {
      throw new Error("Missing required information to add item to cart");
    }

    set({ isLoading: true });
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity,
          },
        ],
      });

      if (!response || !response.cart) {
        throw new Error("Invalid response from Wix cart API");
      }

      set({
        cart: response.cart,
        counter: response.cart.lineItems?.length || 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (wixClient, itemId) => {
    set({ isLoading: true });
    try {
      const response =
        await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);

      if (!response || !response.cart) {
        throw new Error("Invalid response from Wix cart API");
      }

      set({
        cart: response.cart,
        counter: response.cart.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateItemQuantity: async (wixClient, itemId, quantity) => {
    set({ isLoading: true });
    try {
      const response =
        await wixClient.currentCart.updateCurrentCartLineItemQuantity([
          { _id: itemId, quantity },
        ]);

      if (!response || !response.cart) {
        throw new Error("Invalid response from Wix cart API");
      }

      set({
        cart: response.cart,
        counter: response.cart.lineItems?.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
