import express from "express";


const router = express.Router();

import { getShoppingCart, createShoppingCart, shoppingCartRemoveItem, 
updateQuantity, getAllTest } from "../controllers/ShoppingCartController.js";


router.get("/user/shopping_cart", getShoppingCart);
router.patch("/user/removeItem/:cart_id", shoppingCartRemoveItem);
router.patch("/user/updateQuantity/:detail_uuid", updateQuantity);
router.post("/user/add_item", createShoppingCart);
router.get("/test", getAllTest);

export default router;