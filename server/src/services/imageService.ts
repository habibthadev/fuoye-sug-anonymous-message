import puppeteer from "puppeteer"
import { marked } from "marked"
import logger from "../config/logger"

class ImageService {
  async generateMessageImage(content: string, messageId: string): Promise<Buffer> {
    let browser

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })

      const page = await browser.newPage()

      // Convert markdown to HTML
      const htmlContent = marked(content)

      // Create HTML template for the message
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px;
            }
            
            .message-card {
              background: white;
              border-radius: 20px;
              padding: 40px;
              max-width: 800px;
              width: 100%;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .message-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #28a745, #20c997, #17a2b8);
            }
            
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f8f9fa;
            }
            
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #28a745, #20c997);
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20px;
              font-size: 24px;
              font-weight: bold;
              color: white;
            }
            
            .header-text {
              flex: 1;
            }
            
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #2d3748;
              margin-bottom: 5px;
            }
            
            .subtitle {
              font-size: 16px;
              color: #718096;
              font-weight: 500;
            }
            
            .message-content {
              font-size: 18px;
              line-height: 1.8;
              color: #2d3748;
              margin-bottom: 30px;
            }
            
            .message-content h1, .message-content h2, .message-content h3 {
              color: #2d3748;
              margin: 20px 0 15px 0;
              font-weight: 600;
            }
            
            .message-content h1 { font-size: 28px; }
            .message-content h2 { font-size: 24px; }
            .message-content h3 { font-size: 20px; }
            
            .message-content p {
              margin-bottom: 15px;
            }
            
            .message-content strong {
              font-weight: 600;
              color: #2d3748;
            }
            
            .message-content em {
              font-style: italic;
              color: #4a5568;
            }
            
            .message-content code {
              background: #f7fafc;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Monaco', 'Consolas', monospace;
              font-size: 16px;
              color: #e53e3e;
            }
            
            .message-content pre {
              background: #f7fafc;
              padding: 20px;
              border-radius: 8px;
              overflow-x: auto;
              margin: 15px 0;
              border-left: 4px solid #28a745;
            }
            
            .message-content blockquote {
              border-left: 4px solid #28a745;
              padding-left: 20px;
              margin: 20px 0;
              font-style: italic;
              color: #4a5568;
            }
            
            .message-content ul, .message-content ol {
              padding-left: 25px;
              margin: 15px 0;
            }
            
            .message-content li {
              margin-bottom: 8px;
            }
            
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 20px;
              border-top: 2px solid #f8f9fa;
              font-size: 14px;
              color: #718096;
            }
            
            .message-id {
              font-family: 'Monaco', 'Consolas', monospace;
              background: #f7fafc;
              padding: 5px 10px;
              border-radius: 6px;
            }
            
            .timestamp {
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="message-card">
            <div class="header">
              <div class="logo">SU</div>
              <div class="header-text">
                <div class="title">Anonymous Message</div>
                <div class="subtitle">Student Union Government</div>
              </div>
            </div>
            
            <div class="message-content">
              ${htmlContent}
            </div>
            
            <div class="footer">
              <div class="message-id">ID: ${messageId}</div>
              <div class="timestamp">${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</div>
            </div>
          </div>
        </body>
        </html>
      `

      await page.setContent(html)
      await page.setViewport({ width: 1200, height: 800 })

      // Wait for fonts to load
      await page.evaluateHandle("document.fonts.ready")

      const screenshot = await page.screenshot({
        type: "png",
        fullPage: true,
        quality: 100,
      })

      return screenshot as Buffer
    } catch (error) {
      logger.error("Failed to generate message image:", error)
      throw new Error("Failed to generate message image")
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}

export default new ImageService()
