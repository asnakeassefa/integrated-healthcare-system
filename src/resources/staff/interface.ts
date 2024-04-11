import { Document } from 'mongoose'

// Define the User Model Interface
interface StaffInterface extends Document {
  name: string
  username: string
  password: string
  role: string
}

export default StaffInterface