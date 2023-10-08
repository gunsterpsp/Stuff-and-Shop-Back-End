import Product from "../models/ProductModel.js";
import ProductDetails from "../models/ProductDetailsModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) =>{
    try {
        let response;
        if(req.role === "1"){
            response = await Product.findAll({
                attributes:['product_id','uuid','product_code','product_name','product_price', 'product_status'],
                include:[{
                    model: ProductDetails,
                    attributes:['uuid', 'product_size', 'product_quantity','product_detail_status', 'tblProductItemProductId']
                }]
            });
        }else{
            response = await Product.findAll({
                attributes:['product_id','uuid','product_code','product_name','product_price', 'product_status'],
                include:[{
                    model: ProductDetails,
                    attributes:['uuid', 'product_size', 'product_quantity','product_detail_status', 'tblProductItemProductId']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductByUUID = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.uuid
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        response = await Product.findOne({
            attributes:['product_id','uuid','product_code','product_name','product_description','product_type','product_price', 'product_status'],
            where:{
                uuid: req.params.uuid
            },
            attributes:['product_id','uuid','product_code','product_name','product_description','product_type','product_price','product_status'],
            include:[{
                model: ProductDetails,
                attributes:['uuid', 'product_size', 'product_quantity','product_detail_status', 'tblProductItemProductId']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// export const createProduct = async(req, res) =>{
//     const {name, price} = req.body;
//     try {
//         await Product.create({
//             name: name,
//             price: price,
//             userId: req.userId
//         });
//         res.status(201).json({msg: "Product Created Successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

// export const updateProduct = async(req, res) =>{
//     try {
//         const product = await Product.findOne({
//             where:{
//                 uuid: req.params.id
//             }
//         });
//         if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
//         const {name, price} = req.body;
//         if(req.role === "admin"){
//             await Product.update({name, price},{
//                 where:{
//                     id: product.id
//                 }
//             });
//         }else{
//             if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terlarang"});
//             await Product.update({name, price},{
//                 where:{
//                     [Op.and]:[{id: product.id}, {userId: req.userId}]
//                 }
//             });
//         }
//         res.status(200).json({msg: "Product updated successfuly"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

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