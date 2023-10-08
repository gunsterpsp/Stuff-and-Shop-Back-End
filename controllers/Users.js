// import User from "../models/UserModel.js";
// import argon2 from "argon2";
// import {Op} from "sequelize";

// export const getUsers = async(req, res) =>{
//     try {
//         const response = await User.findAll({
//             attributes:['id','uuid','firstname','lastname','address','contact','email','role','image','activity_status', 'user_status']
//         });
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

// export const getUserById = async(req, res) =>{
//     try {
//         const response = await User.findOne({
//             attributes:['id', 'uuid','firstname','lastname','address','contact','email','password','role','image','activity_status', 'user_status'],
//             where: {
//                 uuid: req.params.uuid
//             }
//         });
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

// export const createUser = async(req, res) =>{
//     const {firstname, lastname, address, contact, email, password, confPassword, role, status} = req.body;
//     if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password did not match!"});
//     const hashPassword = await argon2.hash(password);
//     try {
//         await User.create({
//             firstname: firstname,
//             lastname: lastname,
//             address: address,
//             contact: contact,
//             email: email,
//             password: hashPassword,
//             role: role,
//             image: "image1",
//             user_status: 1,
//             activity_status: 0
//         });
//         res.status(201).json({msg: "Register Success!"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

// export const updateUser = async(req, res) =>{
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     const {firstname, lastname, address, contact, role, email, password, confPassword} = req.body;
//     let hashPassword;
//     if(password === "" || password === null){
//         hashPassword = user.password
//     }else{
//         hashPassword = await argon2.hash(password);
//     }
//     if(password !== confPassword) return res.status(400).json({msg: "Password & Confirm Password not match!"});
//     try {
//         await User.update({
//             firstname: firstname,
//             lastname: lastname,
//             address: address,
//             contact: contact,
//             role: role,
//             email: email,
//             password: hashPassword
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Updated"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

// export const deleteUser = async(req, res) =>{
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.id
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
//     try {
//         await User.destroy({
//             where:{
//                 id: user.id
//             }
//         });
//         res.status(200).json({msg: "User Deleted"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }


// export const activeUser = async(req, res) =>{
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     try {
//         await User.update({
//             user_status: 1
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Activate!"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

// export const lockUser = async(req, res) =>{
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     try {
//         await User.update({
//             user_status: 0
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Locked!"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }



// export const onlineStatus = async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     try {
//         await User.update({
//             activity_status: 1
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Online!"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }



// export const offlineStatus = async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     try {
//         await User.update({
//             activity_status: 0
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Offline!"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

// export const updateProfileInformation = async(req, res) => {
//     const {firstname, lastname, address, contact, email} = req.body;
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     try {
//         await User.update({
//             firstname: firstname,
//             lastname: lastname,
//             address: address,
//             contact: contact,
//             email: email
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Updated"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }


// export const changePassword = async(req, res) =>{
//     const user = await User.findOne({
//         where: {
//             uuid: req.params.uuid
//         }
//     });
//     if(!user) return res.status(404).json({msg: "User not found!"});
//     const {password, confPassword} = req.body;
//     let hashPassword;
//     if(password === "" || password === null){
//         hashPassword = user.password
//     }else{
//         hashPassword = await argon2.hash(password);
//     }
//     if(password !== confPassword) return res.status(400).json({msg: "Password & Confirm Password not match!"});
//     try {
//         await User.update({
//             password: hashPassword
//         },{
//             where:{
//                 uuid: user.uuid
//             }
//         });
//         res.status(200).json({msg: "User Updated"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }


// export const searchUser = async (req, res) => {
//     const search = await req.params.search;
//     const data = await User.findAll({
//         attributes:['id', 'uuid','firstname','lastname','address','contact','email','role','activity_status', 'user_status'],
//         where: {
//             [Op.or] : [
//                 {
//                     firstname: { [Op.like]: `%${search}%` },
//                 },
//                 {
//                     lastname: { [Op.like]: `%${search}%` },
//                 },
//                 {
//                     address: { [Op.like]: `%${search}%` },
//                 },                {
//                     contact: { [Op.like]: `%${search}%` },
//                 },
//                 {
//                     email: { [Op.like]: `%${search}%` },
//                 },
//             ]
//         },
//         raw: true,
//       }).catch(console.log("error"));
//       return res.json(data);
// }