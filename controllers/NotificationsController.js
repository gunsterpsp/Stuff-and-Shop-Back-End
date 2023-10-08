import Notifications from "../models/NotificationsModel.js";
import Users from "../models/UserModel.js";

export const getNotifications = async(req, res) =>{

    try {
        const response = await Notifications.findAll({
            attributes: ['notification_id', 'content_text', 
            'full_name', 'user_id', 'notification_type', 'notification_status', 'product_uuid', 'createdAt'],
            where: {
                user_id: req.session.userId
            },
            order: [
                ['notification_id', 'DESC'],
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getNotificationsStatus = async(req, res) =>{
    try {
        const response = await Notifications.findAll({
            attributes: ['notification_id', 'content_text', 
            'full_name', 'user_id', 'notification_type', 'notification_status', 'product_uuid', 'createdAt'],
            where: {
                user_id: req.session.userId,
                notification_status: 1
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateNotifications = async(req, res) =>{
    try {
        await Notifications.update({
            notification_status: 0
        }, {
            where: {
                notification_status: 1,
                user_id: req.session.userId
            }
        })
        res.status(200).json({msg: " Updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}



export const replyNotifications = async(req, res) =>{

    const { user_id, product_uuid, product_code } = req.body;

    const user = await Users.findOne({
        where: {
            id: req.session.userId
        }
    });
        const firstname = user.firstname;
        const lastname = user.lastname;
        const full_name = `${firstname} ${lastname}`;

    try {
        await Notifications.create({
            product_uuid: product_uuid,
            content_text: `has replied to your comment on the Product Code : ${product_code}`,
            full_name: full_name,
            user_id: user_id,
            notification_type: 1
        });
        res.status(201).json({msg: "Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}