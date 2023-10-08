import {
    getNotifications,
    getNotificationsStatus,
    updateNotifications,
    replyNotifications
} from "../controllers/NotificationsController.js";
// import from controllers must be first

import express from "express";


const router = express.Router();

router.get('/read/notifications', getNotifications);
router.get('/status/notifications', getNotificationsStatus);
router.patch('/update/notifications', updateNotifications);
router.post('/create/notifications', replyNotifications);

export default router;