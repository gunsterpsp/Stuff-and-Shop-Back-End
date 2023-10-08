import CategoryItems from "../models/CategoryItemModel.js";

export const getCategoryItems = async(req, res) =>{
    try {
        const response = await CategoryItems.findAll({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}