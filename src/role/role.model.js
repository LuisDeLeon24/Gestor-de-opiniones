import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "[Console] Error: El rol es obligatorio."]
    }
});

export default mongoose.model("Role", RoleSchema);