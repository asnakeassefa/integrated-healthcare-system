import { Request, Response, NextFunction } from 'express'

const getAllStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // use dummy data for now
    const users = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const user = 'John Doe'
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export default {
  getAllStaff,
  getStaffById,
}
