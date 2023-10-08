import {
    getMyMessage,
    createMessage,
    getMyMessageCount,
    getAdminMessages,
    adminMessage,
    updateMessageStatus,
    updateMessageUserStatus,
    forAllUsersCount
} from "../controllers/MessengerController.js";
// import from controllers must be first

import express from "express";


const router = express.Router();

router.get('/read/mymessage', getMyMessage);
router.post('/create/userMessage', createMessage);
router.get('/count/userMessage', getMyMessageCount);
router.get('/admin/messages/:sender_id', getAdminMessages);
router.post('/create/adminMessage', adminMessage);
router.patch('/update/MessageStatus/:sender_id', updateMessageStatus);
router.patch('/update/MessageUserStatus', updateMessageUserStatus);
router.get('/getAll/CountMessage', forAllUsersCount);

export default router;