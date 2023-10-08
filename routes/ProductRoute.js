import express from "express";
import {
    getProducts,
    getProductByUUID,
    activeProduct,
    lockProduct,
    searchProduct,
    getLastProductId, 
    createProduct,
    createDetails,
    updateProduct,
    updateDetails,
    activeDetails,
    lockDetails,
    getAllProducts,
    detailUpdateQuantity,
    productComments,
    getAllComments,
    replyComment,
    replyUser,
} from "../controllers/ProductsController.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/products', getProducts);
router.get('/products/allproducts', getAllProducts);
router.get('/products/:product_uuid', getProductByUUID);
router.patch('/products/active/:product_uuid', activeProduct);
router.patch('/products/lock/:product_uuid', lockProduct);
router.patch('/products/detailsActive/:detail_uuid', activeDetails);
router.patch('/products/detailsLock/:detail_uuid', lockDetails);
router.post('/productimage/upload', createProduct);
router.post('/products/details', createDetails);
router.patch('/products/:product_uuid', updateProduct);
router.patch('/products/details/:detail_uuid', updateDetails);
// router.delete('/products/:id',verifyUser, deleteProduct);
router.get('/product/search/:search', searchProduct);
router.get('/product/product_lastId', getLastProductId);
router.patch('/product/quantity/:detail_uuid', detailUpdateQuantity);
router.post('/product/comments', productComments);
router.get('/product/allcomments/:product_id', getAllComments);
router.post('/comment/reply', replyComment);
router.post('/reply/user', replyUser);




// router.get('/comments/getnames/:product_id', getCommentsGetName);

export default router;