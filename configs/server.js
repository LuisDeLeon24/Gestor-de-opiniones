'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import postRoutes from "../src/post/post.routes.js"
import commentRoutes from "../src/comment/comment.routes.js"
import categoryRoutes from "../src/categories/category.routes.js";
import Category from "../src/categories/category.model.js";
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
        app.use("/gestorOpiniones/auth", authRoutes);
        app.use("/gestorOpiniones/users", userRoutes);
        app.use("/gestorOpiniones/posts", postRoutes);
        app.use("/gestorOpiniones/comments", commentRoutes);
        app.use("/gestorOpiniones/categories", categoryRoutes);

}

const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            await Category.create({ name: "General" });
            console.log("[Console] Categoría por defecto creada: General");
        } else {
            console.log("[Console] Categoría por defecto ya existente");
        }
    } catch (error) {
        console.error("[Console] Error al inicializar categorías:", error);
    }
};



const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExistente) {
            const passwordEncriptada = await hash("SumoAdmin");

            const admin = new Usuario({
                name: "Admin",
                surname: "Admin",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345",
                password: passwordEncriptada,
                role: "ADMIN_ROLE"
            });

            await admin.save();
            console.log("[Console] Administrador creado exitosamente.");
        } else {
            console.log("[Console] El administrador ya existe.");
        }
    } catch (error) {
        console.error("[Console] Error al crear el administrador:", error);
    }
};


const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion Exitosa Con La Base De Datos");
        await initializeCategories();
    } catch (error) {
        console.log("Error Al Conectar Con La Base De Datos", error);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}