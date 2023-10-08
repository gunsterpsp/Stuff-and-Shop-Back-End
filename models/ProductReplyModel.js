import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/Database.js";
import CommentDetails from "../models/ProductCommentsModel.js";

const {DataTypes} = Sequelize;

const CommentsReply = db.define('tbl_product_comments_reply',{
    reply_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    reply_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    reply_text:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [0, 255]
        }
    },
    reply_status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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

CommentDetails.hasMany(CommentsReply);

export default CommentsReply;