import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../config/db.js"
dotenv.config();

//auth 
export const auth = async(req,res,next) =>{
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","")

        if(!token){
            return res.status(401).json({
                success:false,
                message: "Token is missing"
            })
        }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode)
        req.user = decode;
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Token is Invalid"
        })
    } 
    next()
    
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating a token"
        })
    }
}

export const isSystemAdmin   = async(req,res,next)=>{
    try {
        if(req.user.role != "SYSTEM_ADMIN"){
            {
                return res.status(403).json({
                    success:false,
                    message:"System Admin has only access"
                })
            }
        }
        next()
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Role verification failed"
        })
    }
}


export const isNormalUser  = async(req,res,next)=>{
    try {
        if(req.user.role != "NORMAL_USER"){
            {
                return res.status(403).json({
                    success:false,
                    message:"Normal User has only access"
                })
            }
        }
        next()
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Role verification failed"
        })
    }
}

export const isStoreOwner  = async(req,res,next)=>{
    try {
        if(req.user.role != "STORE_OWNER"){
            {
                return res.status(401).json({
                    success:false,
                    message:"storeowner has only access"
                })
            }
        }
        next()
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "You has not verified"
        })
    }
}

// Multirole middleware -access same function
// from normal user and sysadmin to see all store , means getallstore
export const isAuthorized = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
                });
            }
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Role verification failed"
            });
        }
    };
};

