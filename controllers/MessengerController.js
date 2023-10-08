import Messenger from "../models/MessengerModel.js";
import { Op, Sequelize } from "sequelize";
import User from "../models/UserModel.js";

export const getMyMessage = async (req, res) => {
    try {
        if (req.session.userId == "1") {
            let messageLastIDs = [];

            // Retrieve the last message_id for each sender_id
            messageLastIDs = await Messenger.findAll({
                attributes: [
                    'sender_id',
                    [Sequelize.fn('max', Sequelize.col('message_id')), 'message_id'],
                ],
                where: {
                    admin_id: req.session.userId,
                },
                group: ['sender_id'],
            });

            // Extract the message_id values from messageLastIDs
            const messageIDs = messageLastIDs.map((message) => message.getDataValue('message_id'));

            // Fetch messages using the messageIDs array
            const lastMessages = await Messenger.findAll({
                attributes: [
                    'message_id', 'message_text', 'full_name', 'admin_id', 'user_id', 'sender_id',
                    'receiver_id', 'message_status', 'message_image', 'createdAt',
                ],
                where: {
                    message_id: {
                        [Sequelize.Op.in]: messageIDs,
                    },
                    receiver_id: req.session.userId,
                },
                order: [['message_id', 'DESC']]
            });
            res.json(lastMessages);
        } else {
            let response;
            response = await Messenger.findAll({
                attributes: [
                    'message_id', 'message_text', 'full_name', 'admin_id', 'user_id', 'sender_id',
                    'receiver_id', 'message_status', 'message_image', 'createdAt',
                ],
                where: {
                    user_id: req.session.userId,
                },
                order: [['message_id', 'ASC']]
            });
            res.json(response);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getMyMessageCount = async (req, res) => {
    try {
        if (req.session.userId == "1") {
            let response;
            response = await Messenger.findAll({
                where: {
                    receiver_id: req.session.userId,
                    message_status: 1
                },
            });
            res.json(response);
        } else {
            let response;
            response = await Messenger.findAll({
                where: {
                    receiver_id: req.session.userId,
                    user_message_status: 1
                },
            });
            res.json(response);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getAdminMessages = async (req, res) => {
    try {

        if (req.session.userId == "1") {
            const sender_id = req.params.sender_id;
            let response;
            response = await Messenger.findAll({
                attributes: [
                    'message_id', 'message_text', 'full_name', 'admin_id', 'user_id', 'sender_id',
                    'receiver_id', 'message_status', 'message_image', 'createdAt',
                ],
                where: {
                    user_id: sender_id,
                },
                order: [['message_id', 'ASC']]
            });
            res.json(response);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createMessage = async (req, res) => {
    const { message_text } = req.body;

    const user = await User.findOne({
        where: {
            id: req.session.userId
        }
    });

    const firstname = user.firstname;
    const lastname = user.lastname;
    const full_name = `${firstname} ${lastname}`;

    try {
        await Messenger.create({
            message_text: message_text,
            user_id: req.session.userId,
            full_name: full_name,
            sender_id: req.session.userId,
            receiver_id: 1
        });
        res.status(201).json({ msg: "Message Success!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const adminMessage = async (req, res) => {
    const { message_text, user_id } = req.body;

    const user = await User.findOne({
        where: {
            id: req.session.userId
        }
    });

    const firstname = user.firstname;
    const lastname = user.lastname;
    const full_name = `${firstname} ${lastname}`;

    try {
        await Messenger.create({
            message_text: message_text,
            user_id: user_id,
            full_name: full_name,
            sender_id: req.session.userId,
            receiver_id: user_id
        });
        res.status(201).json({ msg: "Message Success!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}



export const updateMessageStatus = async (req, res) => {
    try {
        const sender_id = req.params.sender_id;
        await Messenger.update({
            message_status: 0
        }, {
            where: {
                sender_id: sender_id
            }
        })
        res.status(200).json({ msg: "updated successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateMessageUserStatus = async (req, res) => {
    try {
        await Messenger.update({
            user_message_status: 0
        }, {
            where: {
                receiver_id: req.session.userId
            }
        })
        res.status(200).json({ msg: "updated successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export const forAllUsersCount = async (req, res) => {
    const excludedIds = [1];
    try {
        if (req.session.userId == "1") {
            const array = [];
           await Messenger.findAll({
                attributes: ['sender_id', [Sequelize.fn('COUNT', Sequelize.col('sender_id')), 'count']],
                where: {
                    sender_id: {
                      [Op.notIn]: excludedIds,
                    },
                    message_status: 1
                },
                group: ['sender_id'],
                order: [['message_id', 'DESC']]
              })
                .then((results) => {
                  results.forEach((result) => {
                    const sender_id = result.get('sender_id');
                    const count = result.get('count');
                    array.push({
                        sender_id: sender_id,
                        count: count
                    })
                  });
                })
                .catch((error) => {
                  console.error('Error counting users by sender_id:', error);
                });
            return res.json(array);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

