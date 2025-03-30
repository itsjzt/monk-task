import { CartType } from "../schemas/cartType";

export function calculateCartTotal(cart: CartType) {
  const cartTotal = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return cartTotal;
}
