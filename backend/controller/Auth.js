import prisma from "../config/db.js"  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//signup
export const signup = async (req,res) =>{
  console.log(req.body);
  try {
    const{
        name,     
        email,     
        password,  
        role,     
        confirmPassword,
        address
    } =req.body;

    //check all presnet
    if(
        !name ||     
        !email ||    
        !password ||  
        !address ||
        !role  
    ){
        return res.status(403).json({
            success:false,
            message:"All the fields are required",
        });
    }

    // Name validation
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 20 and 60 characters"
        });
    }

    //checking
    if (address.length > 400) {
        return res.status(400).json({
            success: false,
            message: "Address must not exceed 400 characters"
        });
    }

    //checking by regex
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be 8-16 characters with at least one uppercase letter and one special character"
        });
    }

    //  email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    // 2 password match 
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"both passwords should same"
        });
    }

    //check if user is already

    const existingUser = await prisma.user.findUnique({ 
        where: { email }
    });
    
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User is already registered",
        });  
    }

    //hash the password 
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword);

    //createentry of user in db
    const user = await prisma.user.create({ 
        data: {
            name,     
            email,     
            password: hashedPassword,  
            address,
            role
        }
    });
    console.log("user", user);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(200).json({
      success: true,
      message: "User is registered successfully",
      data: userResponse,
    });
  } catch (error) {
     console.log(error);
     if (error.code === 'P2002') {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }
    
    return res.status(500).json({
        success: false,
        message: "User cannot be registered",
    });
  }  
}

//login
export const login = async (req,res) => {
    try {
        const{email , password} = req.body;
        

        //valid ??
        if(!email || !password){
          return res.status(403).json({
            success: false,
            message: "All fields are required",
          });  
        }

        //if already exit

        const user = await prisma.user.findUnique({ 
            where: { email }
        });


        if (!user) {
        
        return res.status(401).json({
        success: false,
        message: "User is not registered, Sign up first",
      });
    }

    //already user exist then check just pass
    if(await bcrypt.compare(password,user.password)){
        const payload ={
            email : user.email,
            id : user.id,
            role: user.role,
           // passwordChanged: user.updatedAt.toISOString()
        };

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn: "2h",
        });

        const { password: _, ...userResponse } = user;
            userResponse.token = token;
            
            console.log("Printing user: ", userResponse);

        const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 days
        httpOnly: true,
      };

      //create cookie
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user:userResponse,
        message: "LoggedIn successfully ",
      });
    }
    else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    } catch (error) {
      console.log(error);
      res.status(500).json({
      success: false,
      message: "Login Failed",
    });
    }
};