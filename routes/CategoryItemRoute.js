import {
    getCategoryItems
} from "../controllers/CategoryItemsController.js";
import express from "express";


const router = express.Router();


router.get('/admin/category_items', getCategoryItems);
export default router;