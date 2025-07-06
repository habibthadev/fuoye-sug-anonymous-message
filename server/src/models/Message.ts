import mongoose, { type Document, Schema } from "mongoose"

export interface IMessage extends Document {
  content: string
  sanitizedContent: string
  messageLength: number
  isReviewed: boolean
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    sanitizedContent: {
      type: String,
      required: true,
    },
    messageLength: {
      type: Number,
      required: true,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    reviewedAt: {
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
        return ret
      },
    },
  },
)

// Indexes for better query performance
MessageSchema.index({ createdAt: -1 })
MessageSchema.index({ isReviewed: 1 })

export default mongoose.model<IMessage>("Message", MessageSchema)
