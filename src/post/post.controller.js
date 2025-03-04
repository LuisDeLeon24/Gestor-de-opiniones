import User from "../users/user.model.js";
import Post from "../post/post.model.js";
import Category from "../categories/category.model.js";

export const savePost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const user = await User.findById(req.usuario._id); 

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "[Console] Error: Usuario no encontrado."
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "[Console] Error: Categoría no válida."
            });
        }

        const post = new Post({
            title,
            category,
            content,
            keeper: user._id,
            status: true
        });

        await post.save();

        res.status(200).json({
            success: true,
            message: "[Console] Publicación creada: La publicación se ha creado correctamente.",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "[Console] Error al guardar la publicación: No se pudo guardar la publicación.",
            error
        });
    }
};

export const getPosts = async(req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };
    
    try {
        const posts = await Post.find(query)
            .populate("keeper", "nombre")
            .populate("category", "name")
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al obtener las publicaciones: No se pudieron recuperar las publicaciones.",
            error
        });
    }
};

export const searchPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id)
            .populate("keeper", "nombre")
            .populate("category", "name");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "[Console] Error: Publicación no encontrada."
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "[Console] Error al buscar la publicación: No se pudo realizar la búsqueda.",
            error
        });
    }
};

export const deletePost = async(req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "[Console] Error: Publicación no encontrada."
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.keeper.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "[Console] Error: No autorizado para eliminar esta publicación." 
            });
        }

        post.status = false;
        await post.save();

        res.status(200).json({
            success: true,
            message: "[Console] Publicación eliminada exitosamente."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "[Console] Error al eliminar la publicación: No se pudo eliminar la publicación.",
            error
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, ...data } = req.body;

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: "[Console] Error: Usuario no autenticado."
            });
        }

        const post = await Post.findById(id).populate("keeper");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "[Console] Error: Publicación no encontrada."
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.keeper._id.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "[Console] Error: No autorizado para modificar esta publicación." 
            });
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "[Console] Error: Categoría no válida."
                });
            }
            post.category = category;
        }

        Object.assign(post, data);
        await post.save();

        res.status(200).json({
            success: true,
            msg: "[Console] Publicación actualizada: La publicación se ha actualizado correctamente.",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "[Console] Error al actualizar la publicación: No se pudo actualizar la publicación.",
            error
        });
    }
};