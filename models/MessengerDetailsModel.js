import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Messenger from "./MessengerModel.js";

const {DataTypes} = Sequelize;

const MessengerDetails = db.define('tbl_message_details',{
    mdetail_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    mdetail_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    mdetail_text:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    full_name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    sender_id:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    receiver_id:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    mdetail_image:{
        type: DataTypes.STRING,
        allowNull: true
    },
    mdetail_status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    }
},{
    freezeTableName: true
});

Messenger.hasMany(MessengerDetails);

export default MessengerDetails;