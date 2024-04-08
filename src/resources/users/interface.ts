import { Document } from 'mongoose'

// Define the User Model Interface
interface UserInterface extends Document {
  userId:String
  name: String
  phone:String
  sex:String
  weight:Number
  otherTritment:Array<String>
  iskid:boolean
}

export default UserInterface
