import { Router } from "express";
import userModel from "../dao/models/user.model.js"; 

const router = Router();

function add_id(array) {
    return array?.length ? array.length+1 : 1
};


router.post("/", async (req, res) => {
    const { username, bodyPassword } = req.body;
    const existUser = await userModel.findOne({ username });
    console.log("EXIST USER", existUser);

    if (existUser && existUser.password === bodyPassword) return res.redirect("/");
    
    req.session.user = existUser;

    return res.redirect("profile");
});


router.post("/register", async (req, res) => {
    const user = req.body;
    const email = user.email

    const existUser = await userModel.findOne({ email });
    console.log("CORREO", email);

    console.log("REGISTER EXISTUSER", typeof existUser);

    if(existUser) {
        console.log("Ya existe un usuario registrado con ese correo");
        return res.redirect("/register");
    }
    user.role = 'user';
    await userModel.create(user);

    return res.redirect("/");
});

export default router;
