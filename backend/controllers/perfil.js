//importamos la base de datos
import users from "../models/user.js"

//obtener perfil del usuario de la base de datos

export const obtenerPerfil = async (req, res ) =>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message:"Email es requerido"});
        }
        //Traer el correo del usuario desde la base de datos
        const usuario = await users.findOne({email:email}).select('-pass');
        if(!usuario){
            return res.status(400).json({message:"Usuario no encontrado"});
        }
        res.status(200).json({
            usuario:{
                id:usuario._id,
                name:usuario.name,
                email:usuario.email,
                telefono:usuario.tel
            }

        });
    } catch (error) {
        res.status(500).json({
            message:"error al obtener el perfil", error: error.message
        });
    }
}
