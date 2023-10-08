import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    onlineStatus,
    offlineStatus,
    activeUser,
    lockUser, 
    updateProfileInformation,
    changePassword,
    searchUser,
    updateProfileImage,
    searchAll,
} from "../controllers/UsersController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:uuid', getUserById);
router.post('/users', createUser);
router.patch('/users/:uuid', updateUser);
router.patch('/users/online/:uuid', onlineStatus);
router.patch('/users/offline/:uuid', offlineStatus);
router.patch('/users/active/:uuid', activeUser);
router.patch('/users/lock/:uuid', lockUser);
router.patch('/userUpdateInfo/:uuid', updateProfileInformation);
router.patch('/userChangePassword/:uuid', changePassword);
router.get('/users/search/:search', searchUser);
router.patch('/users/upload/:uuid', updateProfileImage);
router.get('/getAll/fetchUsers', searchAll);


// router.delete('/users/:id', deleteUser);

export default router;