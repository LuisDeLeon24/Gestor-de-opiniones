import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser} from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get(
    "/getUser", getUsers);

router.get(
    "/buscarUser/:id",
    [
        check("id", "No es un ID Valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

router.put(
        "/actualizarUser/:id",
        [
            validarJWT,
            check("id", "No es un ID Válido").isMongoId(),
            check("id").custom(existeUsuarioById),
            validarCampos
        ],
        updateUser
);
    

export default router;