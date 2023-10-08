import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    try {
        if(!user) return res.status(404).json({msg: "User not found!"});
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        if(user.user_status == 0) return res.status(400).json({msg: "User account locked!"})
        req.session.userUUID = user.uuid;
        req.session.userId = user.id;
        const uuid = user.uuid;
        const firstname = user.firstname;
        const lastname = user.lastname;
        const email = user.email;
        const role = user.role;
    
        await User.update({
            activity_status: 1
        },{
            where:{
                uuid: user.uuid
            }
        });
        res.status(200).json(req.session.userId);    
        // res.status(200).json({uuid, firstname, lastname, email, role});
    } catch (error) {
        res.status(401).json({Login: false});
    }
}

export const Me = async (req, res) =>{

    try {
        
        if(!req.session.userUUID){
            return res.status(401).json({msg: "Please login to your account!"});
        }

        const user = await User.findOne({
            attributes:['id','uuid','firstname', 'lastname', 'email',
            'role', 'activity_status', 'image', 'user_status', 'address', 'contact'],
            where: {
                uuid: req.session.userUUID
            }
        });
        if(!user) return res.status(404).json({msg: "User not found!"});
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(console.log(err));
    }

}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Cant logout"});
        res.status(200).json({msg: "Logout Success"});
    });
}