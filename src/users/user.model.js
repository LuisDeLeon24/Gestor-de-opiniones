import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "[Console] Error: El nombre es obligatorio."]
    },
    surname: {
        type: String,
        required: [true, "[Console] Error: El apellido es obligatorio."]
    },
    username: {
        type: String,
        required: [true, "[Console] Error: El nombre de usuario es obligatorio."]
    },
    email:{
        type: String,
        required: [true, "[Console] Error: El correo es obligatorio."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "[Console] Error: La contraseña es obligatoria."]
    },
    role: {
        type: String,
        required: [true, "[Console] Error: El rol es obligatorio."],
        enum: ["ADMIN_ROLE","USER_ROLE"],
        default: "USER_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    }
});


UserSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default mongoose.model("User", UserSchema);