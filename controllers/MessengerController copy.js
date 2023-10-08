import Messenger from "../models/MessengerModel.js";
import {Op, Sequelize} from "sequelize";
import MessengerDetails from "../models/MessengerDetailsModel.js";

export const getMyMessage = async (req, res) => {
    try {
        let response;

        if(req.session.userId == "1"){
            var whereID = {receiver_id: req.session.userId}                
        }else {
            var whereID = {sender_id: req.session.userId}    
        }

            response = await Messenger.findAll({
                attributes: [
                    [Sequelize.fn("max", Sequelize.col('message_id')), 'message_id'],
                    'message_id', 'message_text', 'full_name','sender_id','receiver_id', 'message_image', 
                    'message_status', 'createdAt',
                ],
                include: [{
                    model: MessengerDetails,
                }],
                where: whereID,
            });
       


        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
