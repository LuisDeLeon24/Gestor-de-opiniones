import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    
    const {email,password, username} = req.body;

    try {


        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })

        if(!user){
            return res.status(400).json({
                msg: "[Console] Error: Credenciales incorrectas, el correo no existe en la base de datos."
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: "[Console] Error: El usuario no existe en la base de datos."
            }); 
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "[Console] Error: La contraseña es incorrecta."
            })
        }

        const token = await generarJWT(user.id);
        
        res.status(200).json({
            msg: "[Console] Inicio de sesión exitoso: Has accedido correctamente.",
            userDetails: {
                username: user.username,
                token: token
            }
        })

        
    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: '[Console] Error en el servidor: Se ha producido un fallo en el servidor.',
            error: e.message
        })
    }
}

export const register  = async (req, res) => {
    try {
        const data = req.body;

        if (data.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "[Console] Acceso denegado: No tienes permisos para registrarte como administrador."
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role || "USER_ROLE"
        })

        return res.status(201).json({
            message: "[Console] Registro exitoso: Usuario creado correctamente.",
            userDetails:{
                user: user.email
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "[Console] Error en el registro: No se pudo registrar al usuario.",
            error: error.message
        })
    }
}