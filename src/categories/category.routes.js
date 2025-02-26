import { Router } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../categories/category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarRol } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/crearCategoria",
    [
    validarJWT,
    validarRol("ADMIN_ROLE")
    ],
    createCategory
);

router.get(
    "/mostrarCategoria",
     getCategories);

router.put(
    "/actualizarCategoria/:id",
    [
        validarJWT,
        validarRol("ADMIN_ROLE")
    ],
    updateCategory
);

router.delete(
    "/eliminarCategoria/:id", 
    [
        validarJWT,
        validarRol("ADMIN_ROLE")
    ],
    deleteCategory
    );

export default router;