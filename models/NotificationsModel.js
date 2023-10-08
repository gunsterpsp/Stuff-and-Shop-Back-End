import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Notifications = db.define('tbl_all_notifications',{
    notification_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    notification_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    product_uuid:{
        type: DataTypes.STRING,
        allowNull: true
    },
    content_text:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    full_name:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    notification_type:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    notification_status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
},{
    freezeTableName: true
});

export default Notifications;