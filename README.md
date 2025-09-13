# AI Agent Infrastructure Platform

A modern web application built with Next.js 15 for deploying, managing, and scaling AI agents with enterprise-grade infrastructure.

## Features

- **Server-Side Rendering (SSR)**: Built with Next.js App Router for optimal performance
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Component Architecture**: Reusable components for scalability
- **Enterprise Focus**: Designed for AI agent infrastructure at scale

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Language**: JavaScript (ES6+)

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.js            # Root layout with metadata
│   └── page.js              # Homepage (server component)
└── components/
    └── Navigation.js        # Navigation component (client component)
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features

### Homepage
- Hero section with compelling value proposition
- Feature grid showcasing platform capabilities
- Call-to-action sections
- Professional footer with navigation links

### Navigation
- Responsive navigation bar
- Mobile-friendly hamburger menu
- Clean, modern design
- Accessible focus states

### Styling
- Custom CSS variables for theming
- Smooth scrolling and animations
- Custom scrollbar styling
- Accessibility-focused focus states

## Server-Side Rendering

The homepage is built as a server component, which means:
- HTML is generated on the server
- Faster initial page loads
- Better SEO performance
- Reduced client-side JavaScript

## Development

The app uses Next.js 15 with the App Router, providing:
- File-based routing
- Server and client components
- Built-in optimization
- Modern React features

## Next Steps

This foundation provides a solid starting point for building out:
- Agent management pages
- Infrastructure monitoring
- User authentication
- API integrations
- Dashboard components