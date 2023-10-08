import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Messenger = db.define('tbl_message_list',{
    message_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    message_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    message_text:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    user_id:{
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
    admin_id:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    },
    message_image:{
        type: DataTypes.STRING,
        allowNull: true
    },
    message_status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    },
    user_message_status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    }
},{
    freezeTableName: true
});

export default Messenger;