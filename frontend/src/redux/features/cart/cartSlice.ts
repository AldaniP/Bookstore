import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

interface CartItem {
    _id: string;
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
}

const initialState: CartState = {
    cartItems: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item._id === action.payload._id
            );
            if (!existingItem) {
                state.cartItems.push({ ...action.payload, quantity: 1 });
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                existingItem.quantity += 1;
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product quantity updated",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        },
        incrementQuantity: (state, action) => {
            const item = state.cartItems.find(
                (cartItem) => cartItem._id === action.payload._id
            );
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity: (state, action) => {
            const item = state.cartItems.find(
                (cartItem) => cartItem._id === action.payload._id
            );
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter(
                        (cartItem) => cartItem._id !== action.payload._id
                    );
                }
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;