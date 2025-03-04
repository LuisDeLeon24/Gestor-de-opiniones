import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al obtener el usuario: No se pudo obtener el usuario.",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "[Console] Error: Usuario no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "[Console] Error al obtener el usuario: No se pudo obtener el usuario.",
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        if (req.usuario.role === "USER_ROLE" && id !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: "[Console] Error: No está autorizado para actualizar la información de otro usuario."
            });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "[Console] Error: Usuario no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            msg: "[Console] Usuario actualizado: La información del usuario se ha actualizado correctamente.",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "[Console] Error al actualizar el usuario: No se pudo actualizar la información del usuario.",
            error
        });
    }
};