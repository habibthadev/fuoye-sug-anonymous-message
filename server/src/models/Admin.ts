import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IAdmin extends Document {
  email: string
  password: string
  lastLogin?: Date
  loginAttempts: number
  lockUntil?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  isLocked: boolean
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  },
)

// Virtual for checking if account is locked
AdminSchema.virtual("isLocked").get(function (this: IAdmin) {
  return !!(this.lockUntil && this.lockUntil > new Date())
})

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const rounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12")
    this.password = await bcrypt.hash(this.password, rounds)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IAdmin>("Admin", AdminSchema)
