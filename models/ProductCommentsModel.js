import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";

const {DataTypes} = Sequelize;

const ProductComments = db.define('tbl_product_comments',{
    comment_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    comment_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    comment_text:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [0, 255]
        }
    },
    comment_status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    comment_star:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    full_name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    freezeTableName: true
});

Products.hasMany(ProductComments);

export default ProductComments;