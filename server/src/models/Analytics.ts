import mongoose, { type Document, Schema } from "mongoose"

export interface IAnalytics extends Document {
  date: Date
  pageViews: number
  uniqueVisitors: number
  messageSubmissions: number
  adminLogins: number
  bounceRate: number
  averageSessionDuration: number
  createdAt: Date
  updatedAt: Date
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    messageSubmissions: {
      type: Number,
      default: 0,
    },
    adminLogins: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
    },
    averageSessionDuration: {
      type: Number,
      default: 0,
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

// Index for efficient date queries
AnalyticsSchema.index({ date: -1 })

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema)
