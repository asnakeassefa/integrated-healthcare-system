import { Document, Schema } from 'mongoose'
import User from '../users/model'
import Staff from '../staff/model'
import Role from '../role/model'

// Define the User Model Interface
interface VisitInterface extends Document {
  user: Schema.Types.ObjectId,
  staff:Schema.Types.ObjectId,
  visitDate:Date
  appointment_date:Date
}

export default VisitInterface