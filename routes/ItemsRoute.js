import express from "express";
import {
    getItems
} from "../controllers/ItemsController.js";
// import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/items', getItems);

// router.get('/users', verifyUser, adminOnly, getUsers);
// router.get('/users/:id', verifyUser, adminOnly, getUserById);
// router.post('/users', verifyUser, adminOnly, createUser);
// router.patch('/users/:id', verifyUser, adminOnly, updateUser);
// router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;