import Category from "../categories/category.model.js"
import Post from "../post/post.model.js"

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(201).json({
            success: true,
            message: "[Console] Categoría creada: La categoría se ha creado correctamente.",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al crear la categoría: Hubo un problema al intentar crearla.",
            error
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al obtener categorías: No se pudieron recuperar las categorías.",
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

        res.status(200).json({
            success: true,
            message: "[Console] Categoría actualizada: La categoría se ha actualizado correctamente.",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: " [Console] Error al actualizar la categoría: Hubo un problema al intentar actualizarla.",
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            return res.status(500).json({
                success: false,
                message: "[Console] Error: No se encontró la categoría por defecto."
            });
        }

        await Post.updateMany({ category: id }, { category: defaultCategory._id });

        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: "[Console] Categoría eliminada: Las publicaciones han sido reasignadas correctamente."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al eliminar la categoría: No se pudo eliminar la categoría.",
            error: error.message 
        });
    }
};