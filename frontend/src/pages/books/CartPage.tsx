import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  applyPromo,
} from "../../redux/features/cart/cartSlice";
import { useState } from "react";

const CartPage = () => {
  const cartItems: CartItem[] = useSelector(
    (state: { cart: { cartItems: CartItem[] } }) => state.cart.cartItems
  );
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const discountPercent = useSelector(
    (state: {
      cart: {
        discountPercent: number;
      };
    }) => state.cart.discountPercent
  );

  interface CartItem {
    _id: string;
    coverImage: string;
    title: string;
    oldPrice?: number;
    newPrice: number;
    category: string;
    quantity: number;
  }


  
  const subtotal = cartItems.reduce(
  (acc: number, item: CartItem) =>
    acc + item.newPrice * item.quantity,
  0
);

const discountAmount =
  subtotal * (discountPercent / 100);

const totalPrice = (
        subtotal - discountAmount
      ).toFixed(2);

  const handleRemoveFromCart = (product: CartItem): void => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrement = (product: CartItem) => {
    dispatch(incrementQuantity(product));
  };

  const handleDecrement = (product: CartItem) => {
    dispatch(decrementQuantity(product));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (code === "BOOK10") {
      dispatch(
        applyPromo({
          code,
          discount: 10,
        })
      );

      setCouponMessage("Coupon applied! 10% discount.");
    }
    else if (code === "BOOK20") {
      dispatch(
        applyPromo({
          code,
          discount: 20,
        })
      );

      setCouponMessage("Coupon applied! 20% discount.");
    }
    else {
      dispatch(
        applyPromo({
          code: "",
          discount: 0,
        })
      );

      setCouponMessage("Invalid coupon code.");
    }
  };
    
  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium text-gray-900">
              Shopping cart
            </div>
            <div className="ml-3 flex h-7 items-center ">
              <button
                type="button"
                onClick={handleClearCart}
                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200  "
              >
                <span className="">Clear Cart</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              {cartItems.length > 0 ? (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product?._id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          alt=""
                          src={`${getImgUrl(product?.coverImage)}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to="/">{product?.title}</Link>
                            </h3>
                            <div className="text-right">
                              {product.oldPrice && (
                                <p className="text-sm text-gray-400 line-through">
                                  ${product.oldPrice}
                                </p>
                              )}

                              <p className="font-semibold">
                                ${product.newPrice}
                              </p>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 capitalize">
                            <strong>Category: </strong>
                            {product?.category}
                          </p>
                        </div>
                        <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecrement(product)}
                              disabled={product.quantity <= 1}
                              className={`h-8 w-8 rounded border border-gray-300 bg-white text-gray-700 transition-all ${
                                product.quantity <= 1
                                  ? "cursor-not-allowed opacity-50"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              -
                            </button>
                            <span className="text-gray-900 font-medium">
                              {product.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(product)}
                              className="h-8 w-8 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-gray-500">
                              <strong>Total:</strong> ${
                                (product.newPrice * product.quantity).toFixed(2)
                              }
                            </p>
                            <button
                              onClick={() => handleRemoveFromCart(product)}
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No product found!</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border rounded px-3 py-2 w-full"
              />

              <button
                onClick={applyCoupon}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>

            {couponMessage && (
              <p className="mt-2 text-sm text-blue-600">
                {couponMessage}
              </p>
            )}
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          {discountPercent > 0 && (
            <div className="flex justify-between text-green-600 mt-2">
              <p>Discount ({discountPercent}%)</p>
              <p>- ${discountAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold mt-3">
            <p>Total</p>
            <p>${totalPrice}</p>
          </div>

          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <Link to="/">
              or
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;

//cartpage