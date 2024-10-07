import { create } from "zustand";
import { currentCart } from "@wix/ecom";

import { WixClient } from "@/context/wixContext";

type CartState = {
  cart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => Promise<boolean>;
  removeItem: (wixClient: WixClient, itemId: string) => void;
  updateItemQuantity: (
    wixClient: WixClient,
    itemId: string,
    quantity: number
  ) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart || [],
        isLoading: false,
        counter: cart?.lineItems.length || 0,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity: quantity,
          },
        ],
      });

      set({
        cart: response.cart,
        counter: response.cart?.lineItems.length,
        isLoading: false,
      });
      return true; // Return true if the item was added successfully
    } catch (error) {
      console.error("Error adding item to cart:", error);
      set((state) => ({ ...state, isLoading: false }));
      return false; // Return false if there was an error
    }
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId]
    );

    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },

  updateItemQuantity: async (wixClient, itemId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response =
        await wixClient.currentCart.updateCurrentCartLineItemQuantity([
          // @ts-ignore
          { id: itemId, quantity },
        ]);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
