import { Router } from "express";
import { check } from "express-validator";
import {savePost, getPosts, searchPost, deletePost, updatePost} from "./post.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/guardarPost",
    [
        validarJWT,
        check("title", "El título es obligatorio").not().isEmpty(),
        check("category", "La categoría es obligatoria").not().isEmpty(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos
    ],
    savePost
)

router.get(
    "/mostrarPost",
     getPosts)

router.get(
    "/buscarPost/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    searchPost
)

router.put(
    "/actualizarPost/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    updatePost
)


router.delete(
    "/borrarPost/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    deletePost
)

export default router;