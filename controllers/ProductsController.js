import Product from "../models/ProductModel.js";
import ProductDetails from "../models/ProductDetailsModel.js";
import ProductImage from "../models/ProductImageModel.js";
import ProductComments from "../models/ProductCommentsModel.js";
import CommentsReply from "../models/ProductReplyModel.js";
import Users from "../models/UserModel.js";
import { Op, Sequelize } from "sequelize";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import db from "../config/Database.js";
import Notifications from "../models/NotificationsModel.js";


export const getProducts = async (req, res) => {
    try {
        let response;
        response = await Product.findAll({
            attributes: ['product_id', 'product_uuid', 'product_code', 'product_name', 'product_price', 'product_type', 'product_status'],
            include: [{
                model: ProductDetails,
                attributes: ['detail_uuid', 'product_size', 'product_quantity', 'product_detail_status', 'tblProductItemProductId'],
            },
            {
                model: ProductImage,
                attributes: ['image_id', 'product_image_uuid', 'product_image', 'product_image_status', 'tblProductItemProductId']
            }
        ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        let response;
        response = await Product.findAll({
            attributes: ['product_id', 'product_uuid', 'product_code', 'product_name', 'product_price', 'product_type', 'product_status'],
            where: {
                product_status: 1
            },
            order: [
                ['product_id', 'DESC'],
            ],
            // limit : 20,
            include: [{
                model: ProductDetails,
                attributes: ['detail_uuid', 'product_size', 'product_quantity', 'product_detail_status', 'tblProductItemProductId'],
            },
            {
                model: ProductImage,
                attributes: ['image_id', 'product_image_uuid', 'product_image', 'product_image_status', 'tblProductItemProductId']
            }
        ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductByUUID = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                product_uuid: req.params.product_uuid
            }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;
        response = await Product.findOne({
            attributes: ['product_id', 'product_uuid', 'product_code', 'product_name', 'product_price', 'product_type', 'product_status'],
            where: {
                product_uuid: req.params.product_uuid
            },
            attributes: ['product_id', 'product_uuid', 'product_code', 'product_name', 'product_price', 'product_type', 'product_status'],
            include: [{
                model: ProductDetails,
                attributes: ['detail_uuid', 'product_size', 'product_quantity', 'product_detail_status', 'tblProductItemProductId']
            },
            {
                model: ProductImage,
                attributes: ['image_id', 'product_image_uuid', 'product_image', 'product_image_status', 'tblProductItemProductId']
            }
        ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const createProduct = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) 
    return res.status(400).json({ message: 'No files were uploaded.' });
    
    const generateRandomCharacters = (length) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          result += charset.charAt(randomIndex);
        }
      
        return result;
      }
      const randomString = generateRandomCharacters(6);

    const {product_name, product_price, product_type, 
        product_description, product_id, product_category} = req.body;
    const files = req.files.files;
    const uploadPath = path.join('images');
    if (Array.isArray(files)) {
        const newUUID = uuidv4();
        const uploadedFiles = [];
        files.forEach(file => {
            const fileName = Date.now() + '_' + file.name;
            file.mv(path.join(uploadPath, fileName), err => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                uploadedFiles.push(fileName);
            });
            ProductImage.create({
                product_uuid: newUUID,
                product_image: fileName,
                product_image_status: 1,
                tblProductItemProductId: product_id
            })
        });
        await Product.create({
            product_uuid: newUUID,
            product_code: randomString,
            product_name: product_name,
            product_price: product_price,
            product_description: product_description,
            product_type: product_type,
            product_category: product_category,
            product_status: 1
        })
        res.json({ message: 'Files uploaded successfully.', uploadedFiles });
    } else {
        const fileName = Date.now() + '_' + files.name;
        files.mv(path.join(uploadPath, fileName), err => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json({ message: 'File uploaded successfully.', uploadedFile: fileName });
        });
    }
}


export const createDetails = async (req, res) => {
    const {product_size, product_quantity, tblProductItemProductId} = req.body;
        try {
        await ProductDetails.bulkCreate([{
            product_size: product_size,
            product_quantity: product_quantity,
            tblProductItemProductId: tblProductItemProductId,
            product_detail_status: 1,
        }]);
        res.json("Success");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}


export const updateProduct = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                product_uuid: req.params.product_uuid
            }
        });
        if(!product) return res.status(404).json({msg: "Data not set"});
        const {product_name, product_price, product_type, 
            product_description, product_category} = req.body;
        await Product.update({
            product_name: product_name,
            product_price: product_price,
            product_type: product_type,
            product_category: product_category,
            product_description: product_description
        }, {
            where: {
                product_uuid: product.product_uuid
            }
        })
        res.status(200).json({msg: "Product updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateDetails = async(req, res) =>{
    try {
        const productDetails = await ProductDetails.findOne({
            where:{
                detail_uuid: req.params.detail_uuid
            }
        });
        if(!productDetails) return res.status(404).json({msg: "Data not set"});
        const { product_quantity } = req.body;
        await ProductDetails.update({
            product_quantity: product_quantity,
        }, {
            where: {
                detail_uuid: productDetails.detail_uuid
            }
        })
        res.status(200).json({msg: "Details updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// export const deleteProduct = async(req, res) =>{
//     try {
//         const product = await Product.findOne({
//             where:{
//                 uuid: req.params.id
//             }
//         });
//         if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
//         const {name, price} = req.body;
//         if(req.role === "admin"){
//             await Product.destroy({
//                 where:{
//                     id: product.id
//                 }
//             });
//         }else{
//             if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
//             await Product.destroy({
//                 where:{
//                     [Op.and]:[{id: product.id}, {userId: req.userId}]
//                 }
//             });
//         }
//         res.status(200).json({msg: "Product deleted successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }


export const activeProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            product_uuid: req.params.product_uuid
        }
    });
    if (!product) return res.status(404).json({ msg: "Product not found!" });
    try {
        await Product.update({
            product_status: 1
        }, {
            where: {
                product_uuid: product.product_uuid
            }
        });
        res.status(200).json({ msg: "Product Activate!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const lockProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            product_uuid: req.params.product_uuid
        }
    });
    if (!product) return res.status(404).json({ msg: "Product not found!" });
    try {
        await Product.update({
            product_status: 0
        }, {
            where: {
                product_uuid: product.product_uuid
            }
        });
        res.status(200).json({ msg: "Product Locked!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const activeDetails = async (req, res) => {
    const productDetails = await ProductDetails.findOne({
        where: {
            detail_uuid: req.params.detail_uuid
        }
    });
    if (!productDetails) return res.status(404).json({ msg: "Details not found!" });
    try {
        await ProductDetails.update({
            product_detail_status: 1
        }, {
            where: {
                detail_uuid: productDetails.detail_uuid
            }
        });
        res.status(200).json({ msg: "Details Activate!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const lockDetails = async (req, res) => {
    const productDetails = await ProductDetails.findOne({
        where: {
            detail_uuid: req.params.detail_uuid
        }
    });
    if (!productDetails) return res.status(404).json({ msg: "Details not found!" });
    try {
        await ProductDetails.update({
            product_detail_status: 0
        }, {
            where: {
                detail_uuid: productDetails.detail_uuid
            }
        });
        res.status(200).json({ msg: "Details Locked!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const searchProduct = async (req, res) => {
    const search = await req.params.search;
    const data = await Product.findAll({
        where: {
            [Op.or]: [
                {
                    product_id: { [Op.like]: `%${search}%` },
                },
                {
                    product_name: { [Op.like]: `%${search}%` },
                }, {
                    product_price: { [Op.like]: `%${search}%` },
                },
                {
                    product_description: { [Op.like]: `%${search}%` },
                },
            ]
        },
        raw: true,
    }).catch(console.log("error"));
    return res.json(data);
}



export const getLastProductId = async (req, res) => {
    try {
        let response;
        response = await Product.findAll({
            attributes: ['product_id'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const detailUpdateQuantity = async (req, res) => {
    const {product_quantity} = req.body;
    const productDetails = await ProductDetails.findOne({
        where: {
            detail_uuid: req.params.detail_uuid
        }
    });
    if (!productDetails) return res.status(404).json({ msg: "Details not found!" });
    try {
        const total = productDetails.product_quantity-product_quantity;
        await ProductDetails.update({
            product_quantity: total
        }, {
            where: {
                detail_uuid: productDetails.detail_uuid
            }
        });
        res.status(200).json({ msg: "Details Updated!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const productComments = async (req, res) => {
    
    const { comment_text, tblProductItemProductId, comment_star } = req.body;
    const user = await Users.findOne({
        where: {
            id: req.session.userId
        }
    });
    try {
        const firstname = user.firstname;
        const lastname = user.lastname;
        const full_name = `${firstname} ${lastname}`;
        await ProductComments.bulkCreate([{
            comment_text: comment_text,
            user_id: req.session.userId,
            comment_star: comment_star,
            full_name: full_name,
            tblProductItemProductId: tblProductItemProductId
        }]);
        res.json("Success");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}

export const getAllComments = async (req, res) => {
    const product_id = req.params.product_id;
    try {
        let response;
        response = await ProductComments.findAll({
            attributes: ['comment_id', 'comment_text', 'comment_star', 'user_id', 'full_name', 'createdAt'],
            where: {
                tblProductItemProductId: product_id
            },
            order: [
                ['comment_id', 'DESC'],
            ],
            include: [{
                model: CommentsReply,
                attributes: ['reply_id', 'reply_text', 'full_name', 'user_id', 'createdAt', 'tblProductCommentCommentId'],
                order: [
                    ['reply_id', 'ASC'],
                ],
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}


export const replyComment = async (req, res) => {
    
    const {reply_text, tblProductCommentCommentId} = req.body;
    const user = await Users.findOne({
        where: {
            id: req.session.userId
        }
    });
    try {
        const firstname = user.firstname;
        const lastname = user.lastname;
        const full_name = `${firstname} ${lastname}`;
        await CommentsReply.create({
            reply_text: reply_text,
            user_id: req.session.userId,
            full_name: full_name,
            tblProductCommentCommentId: tblProductCommentCommentId
        });
        res.json("Success");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}



export const replyUser = async (req, res) => {
    
    const {reply_text, tblProductCommentCommentId} = req.body;
    const user = await Users.findOne({
        where: {
            id: req.session.userId
        }
    });
    try {
        const firstname = user.firstname;
        const lastname = user.lastname;
        const full_name = `${firstname} ${lastname}`;
        await CommentsReply.create({
            reply_text: reply_text,
            user_id: req.session.userId,
            full_name: full_name,
            tblProductCommentCommentId: tblProductCommentCommentId
        });
        res.json("Success");
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}



