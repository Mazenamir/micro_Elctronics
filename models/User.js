// require Mongoose

// create schema

// create Model

// Export Model


const mongoose= require("mongoose")
const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, // trim use to delete spaces 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default:"user"
    }
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports= User;
