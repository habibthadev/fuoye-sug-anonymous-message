# Anonymous Messaging Platform - Backend

A secure, production-ready backend for an anonymous messaging platform built for Student Union Government.

## Features

- 🔐 **Secure Authentication**: JWT-based admin authentication with rate limiting
- 📝 **Anonymous Messaging**: Submit messages without any user identification
- 🛡️ **Security First**: XSS protection, input sanitization, CORS, Helmet
- 📊 **Analytics**: Track page views, visitors, and message submissions
- 📧 **Email Notifications**: Automated alerts for new messages
- 🖼️ **Image Export**: Download messages as beautifully formatted PNG images
- 🧪 **Comprehensive Testing**: Unit and integration tests with Vitest
- 📈 **Monitoring**: Structured logging with Pino
- 🚀 **Production Ready**: Docker support, health checks, graceful shutdown

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit, DOMPurify
- **Testing**: Vitest + Supertest
- **Logging**: Pino
- **Email**: Nodemailer
- **Image Generation**: Puppeteer

## Quick Start

1. **Clone and Install**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Development**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Testing**
   \`\`\`bash
   npm test
   npm run test:coverage
   \`\`\`

5. **Production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## API Endpoints

### Public Endpoints
- `POST /api/messages/submit` - Submit anonymous message
- `POST /api/analytics/track/page-view` - Track page view
- `POST /api/analytics/track/visitor` - Track unique visitor
- `GET /health` - Health check

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Admin Protected Endpoints
- `GET /api/messages` - Get all messages (paginated)
- `GET /api/messages/stats` - Get message statistics
- `GET /api/messages/:id` - Get specific message
- `PATCH /api/messages/:id` - Update message (mark as reviewed)
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/:id/download` - Download message as PNG
- `GET /api/analytics` - Get analytics data

## Security Features

- **Rate Limiting**: Different limits for various endpoints
- **Input Sanitization**: MongoDB injection and XSS protection
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **Account Locking**: Brute force protection
- **Content Sanitization**: DOMPurify for markdown content

## Environment Variables

\`\`\`env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/anonymous-messaging

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@studentunion.edu
ADMIN_PASSWORD=SecurePassword123!

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@studentunion.edu
ADMIN_EMAIL_NOTIFICATIONS=admin@studentunion.edu

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:5173
\`\`\`

## Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t anonymous-messaging-backend .
docker run -p 5000:5000 anonymous-messaging-backend
\`\`\`

## Testing

The backend includes comprehensive tests covering:
- Authentication flows
- Message CRUD operations
- Analytics tracking
- Input validation
- Security measures
- Error handling

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.ts
\`\`\`

## Logging

Structured logging with Pino provides:
- Request/response logging
- Error tracking
- Security event monitoring
- Performance metrics

## Email Notifications

Automated email alerts are sent to administrators when:
- New anonymous messages are submitted
- Security events occur (failed logins, rate limiting)

## Image Generation

Messages can be exported as beautifully formatted PNG images featuring:
- Student Union branding
- Markdown rendering
- Professional layout
- Message metadata

## Production Considerations

- Use environment variables for all configuration
- Set up MongoDB replica set for high availability
- Configure email service (Gmail, SendGrid, etc.)
- Set up reverse proxy (Nginx) for SSL termination
- Monitor logs and set up alerting
- Regular database backups
- Security updates and dependency management

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use conventional commit messages
4. Update documentation
5. Ensure security considerations

## License

MIT License - Built for Student Union Government
