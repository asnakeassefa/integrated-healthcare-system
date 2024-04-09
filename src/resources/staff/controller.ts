import { Request, Response, NextFunction } from 'express'
import Staff from './model';

const createStaff = async (req:Request, res:Response, next: NextFunction)=>{
  try{
    const {name,username,password,role} = req.body
    
    const newStaff = new Staff({
      name,username,password,role
    });
    const savedVisit = await newStaff.save();
    res.status(201).json(savedVisit);
  }catch(error){
    console.error("Error adding Staff:", error);
    res.status(500).json({ error: "Failed to adding Staff" });
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // use dummy data for now
    const users = await Staff.find()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}
export default {
  createStaff,
  getAll,
}
