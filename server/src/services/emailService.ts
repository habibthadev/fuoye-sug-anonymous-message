import nodemailer from "nodemailer"
import logger from "../config/logger"
import type { EmailOptions } from "../types"

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`Email sent successfully to ${options.to}`)
    } catch (error) {
      logger.error("Failed to send email:", error)
      throw new Error("Failed to send email notification")
    }
  }

  async sendNewMessageNotification(messageContent: string): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL_NOTIFICATIONS

    if (!adminEmail) {
      logger.warn("Admin email for notifications not configured")
      return
    }

    const subject = "New Anonymous Message Received"
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2d5a27; margin-bottom: 20px; text-align: center;">📩 New Anonymous Message</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <p style="color: #495057; line-height: 1.6; margin: 0;">
              <strong>Message Preview:</strong><br>
              ${messageContent.substring(0, 200)}${messageContent.length > 200 ? "..." : ""}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">
              Please log in to the admin dashboard to view the complete message.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
            This is an automated notification from the Anonymous Messaging System<br>
            Student Union - ${new Date().getFullYear()}
          </p>
        </div>
      </div>
    `

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    })
  }
}

export default new EmailService()
