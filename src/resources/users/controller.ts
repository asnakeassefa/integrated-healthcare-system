import { Request, Response, NextFunction } from 'express'
import User from './model';

const createUser = async (req:Request, res:Response, next: NextFunction)=>{
  try{
    const {name,phone,sex,weight,otherTritment,iskid} = req.body
    
    const newUser = new User({
      name,phone,sex,weight,otherTritment,iskid
    });
    const savedVisit = await newUser.save();
    res.status(201).json(savedVisit);
  }catch(error){
    console.error("Error adding User:", error);
    res.status(500).json({ error: "Failed to adding user" });
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // use dummy data for now
    const users =  await User.find()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export default {
  createUser,
  getAll,
}
