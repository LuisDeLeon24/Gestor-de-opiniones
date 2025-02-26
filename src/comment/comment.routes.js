import { Router } from "express";
import { check } from "express-validator";
import {saveComment, getComments, searchComment, deleteComment, updateComment} from "./comment.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/CrearComentario",
    [
        validarJWT,
        check("postId", "El ID del post es obligatorio").isMongoId(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveComment
)

router.get(
    "/mostrarComentario",
     getComments)

router.get(
    "/buscarComentario/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    searchComment
)

router.put(
    "/actualizarComentario/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    updateComment
)


router.delete(
    "/borrarComentario/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    deleteComment
)

export default router;