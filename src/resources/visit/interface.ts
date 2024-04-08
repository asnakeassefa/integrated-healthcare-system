import { Document } from 'mongoose'
import User from '../users/model'
import Staff from '../staff/model'
import Role from '../role/model'

// Define the User Model Interface
interface VisitInterface extends Document {
  visitId: string
  user: typeof User
  staff:typeof Staff
  username: string
  password: string
  role: typeof Role
}

export default VisitInterface