# Anonymous Messaging Platform - Frontend

A beautiful, responsive React frontend for the anonymous messaging platform built for Student Union Government.

## Features

- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🔐 **Admin Authentication**: Persistent login with JWT tokens
- 📱 **Responsive Design**: Mobile-first approach with beautiful animations
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📝 **Markdown Support**: Rich text formatting with live preview
- 📊 **Analytics Dashboard**: Beautiful charts and statistics
- 🔄 **Real-time Updates**: Auto-refresh data and notifications
- ♿ **Accessibility**: WCAG compliant with proper ARIA labels
- 🚀 **Performance**: Optimized with code splitting and lazy loading

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Animations**: Framer Motion + GSAP

## Quick Start

1. **Install Dependencies**
   \`\`\`bash
   cd client
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your API URL
   \`\`\`

3. **Development**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for Production**
   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── forms/          # Form components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
│   └── admin/          # Admin pages
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── services/           # API services
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── styles/             # Global styles
\`\`\`

## Key Features

### Anonymous Messaging
- Clean, intuitive message composition interface
- Markdown support with live preview
- Character count and validation
- Secure submission without tracking

### Admin Dashboard
- JWT-based authentication with persistence
- Message management with filtering
- Beautiful analytics charts
- Download messages as images
- Real-time data updates

### Design System
- Consistent green-themed color palette
- Custom animations and transitions
- Responsive grid layouts
- Accessible form controls
- Dark mode support

## Environment Variables

\`\`\`env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Student Union Anonymous Messaging
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
\`\`\`

## Authentication Flow

1. **Login**: Admin enters credentials
2. **Token Storage**: JWT stored in localStorage and Zustand
3. **Auto-Verification**: Token verified on app load
4. **Protected Routes**: Admin routes require authentication
5. **Auto-Logout**: Invalid tokens trigger logout

## State Management

### Auth Store (Zustand)
- User authentication state
- JWT token management
- Persistent login sessions
- Auto token verification

### Theme Store (Zustand)
- Light/dark mode toggle
- Persistent theme preference
- System theme detection

## API Integration

### Services Layer
- Centralized API calls
- Request/response interceptors
- Error handling
- Token management

### React Query
- Data fetching and caching
- Background updates
- Optimistic updates
- Error boundaries

## Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Optimized chunk sizes
- **Image Optimization**: Responsive images
- **Caching**: Aggressive caching strategies
- **Debouncing**: Input debouncing for search

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Semantic HTML**: Proper heading structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy dist/ folder
\`\`\`

### Docker
\`\`\`bash
docker build -t anonymous-messaging-frontend .
docker run -p 3000:80 anonymous-messaging-frontend
\`\`\`

## Contributing

1. Follow TypeScript best practices
2. Use Prettier for code formatting
3. Write accessible components
4. Test on multiple devices
5. Update documentation

## License

MIT License - Built for Student Union Government
