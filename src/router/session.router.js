import { Router } from "express";
import userModel from "../dao/models/user.model.js"; 

const router = Router();

function add_id(array) {
    return array?.length ? array.length+1 : 1
};


router.post("/", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username, password });
    if (!user) return res.redirect("/");
    req.session.user = user;

    return res.redirect("profile"); // duda
});


//TODO: Agregar boton para LOG OUT y destruir la sesion: agregar manual e independiente a INDEX y PRODUCTS_CATALOG

router.post("/register", async (req, res) => {
    const user = req.body;

    const users = await userModel.find();

    const alreadyExist = users.find(u => u.email == user.email);

    if (alreadyExist) {
        console.log('Ya existe un usuario registrado con ese correo');
        return res.redirect('/register');
    }

    console.log('USER: ', user, 'USERS: ', users)
    user.user_id = add_id(users);
    user.role = 'user';
    await userModel.create(user);

    return res.redirect("/");
});

export default router;
