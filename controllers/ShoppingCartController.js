import ShoppingCart from "../models/ShoppingCartModel.js";
import ProductImage from "../models/ProductImageModel.js";
import ProductDetails from "../models/ProductDetailsModel.js";
import db from "../config/Database.js";
import { fn, literal, col, Sequelize } from "sequelize";

export const getShoppingCart = async (req, res) =>{
    // try {
    //     const response = await ShoppingCart.findAll({
    //         where: {
    //             tblUserId: req.session.userId,
    //             product_item_status: 1
    //         },
    //     });
    //     res.status(200).json(response);
    // } catch (error) {
    //     res.status(500).json({msg: error.message});
    // }
    await db.query(`SELECT t1.cart_id, t1.product_item_uuid, t1.product_item_name, t1.product_item_price, t1.product_item_size, t1.product_item_quantity, t1.product_item_status, t1.product_id, t1.payment_status, t1.tblUserId, t2.product_image FROM \
    tbl_shopping_cart t1 LEFT JOIN tbl_product_images t2 \
    ON t1.product_id = t2.tblProductItemProductId WHERE t1.product_item_status = 1 \
    AND t1.tblUserId = ${req.session.userId} GROUP BY t1.cart_id ORDER BY t1.cart_id;`, { type: Sequelize.QueryTypes.SELECT })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
}


export const createShoppingCart = async(req, res) =>{

    try {
        const {product_item_uuid, product_item_name, 
            product_item_price, product_item_size, 
            product_item_quantity, product_item_status, product_id} = req.body;
        
        await ShoppingCart.create({
            product_item_uuid: product_item_uuid,
            product_item_name: product_item_name,
            product_item_price: product_item_price,
            product_item_size: product_item_size,
            product_item_quantity: product_item_quantity,
            product_item_status: product_item_status,
            product_id: product_id,
            tblUserId: req.session.userId
        });
        res.status(201).json({msg: "New Car Added!"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}



export const shoppingCartRemoveItem = async (req, res) => {
    const {product_item_size} = req.body;
    const cart = await ShoppingCart.findOne({
        where: {
            cart_id: req.params.cart_id
        }
    });
    let uniqueUUID;
    let uniqueQuantity;
    let uniqueCartQuantity;

    await db.query(`SELECT t1.product_item_quantity, t2.product_quantity, \
    t2.detail_uuid FROM tbl_shopping_cart t1 LEFT JOIN tbl_product_details t2 \
    ON t1.product_id = t2.tblProductItemProductId WHERE t1.cart_id = ${req.params.cart_id} \
    AND t2.product_size = "${product_item_size}" AND t1.tblUserId = \
    ${req.session.userId}`, { type: Sequelize.QueryTypes.SELECT })
    .then(details => {
        for (let i = 0; i < details.length; i++) {
            const element = details[i];
            uniqueUUID = element.detail_uuid;
            uniqueQuantity = element.product_quantity;
            uniqueCartQuantity = element.product_item_quantity;
        }
    })
    .catch(error => {
      console.error('Error:', error);
    });
    const sumTotal = (uniqueQuantity+uniqueCartQuantity)

    if(!cart) return res.status(404).json({msg: "Item not found!"});
    try {
        await ShoppingCart.update({
            product_item_status: 0
        },{
            where:{
                cart_id: cart.cart_id
            }
        });
        await ProductDetails.update({
            product_quantity: sumTotal
        },{
            where:{
                detail_uuid: uniqueUUID
            }
        });
        res.status(200).json("Success!");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const getAllTest = async (req, res) =>{

    await db.query(`SELECT t1.product_item_quantity, t2.product_quantity, t2.detail_uuid FROM tbl_shopping_cart t1 LEFT JOIN tbl_product_details t2 \
    ON t1.product_id = t2.tblProductItemProductId WHERE t1.cart_id = 1 \
    AND t2.product_size = "Small" AND t1.tblUserId = ${req.session.userId}`, { type: Sequelize.QueryTypes.SELECT })
    .then(details => {
        res.status(200).json(details);
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


export const updateQuantity = async (req, res) => {
    const { product_quantity } = req.body;
    const detailQuantity = await ProductDetails.findOne({
        where: {
            detail_uuid: req.params.detail_uuid
        }
    });
    if(!detailQuantity) return res.status(404).json({msg: "Item not found!"});
    try {
        const total = detailQuantity.product_quantity+product_quantity;
        await ProductDetails.update({
            product_quantity: total
        },{
            where:{
                detail_uuid: detailQuantity.detail_uuid
            }
        });
        res.status(200).json("Success!");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}