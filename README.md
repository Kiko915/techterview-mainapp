# 🚀 TechTerview

A comprehensive interview preparation platform designed to help tech professionals ace their technical interviews with confidence.

## 🌟 Features

- **📚 Interview Preparation**: Comprehensive resources for technical interviews
- **🎨 Dark/Light Theme**: Toggle between themes for comfortable studying
- **👤 User Dashboard**: Personalized experience with account management
- **🔐 Authentication System**: Secure login, signup, and password recovery
- **⚙️ Settings Panel**: Customize your experience with theme preferences
- **📱 Responsive Design**: Works seamlessly across all devices
- **🎯 Onboarding Flow**: Guided setup for new users
- **❓ Help & Support**: Comprehensive help documentation
- **📋 Legal Pages**: Privacy policy and terms of service

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router
- **Frontend**: React 19.1.0
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Turbopack for faster development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kiko915/techterview-mainapp.git
   cd techterview-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── signup/        # Registration page
│   │   └── forgot-password/ # Password recovery
│   ├── dashboard/         # User dashboard
│   │   ├── account/       # Account management
│   │   └── settings/      # User settings
│   ├── onboarding/        # New user onboarding
│   ├── help/              # Help documentation
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── page.js            # Landing page
├── components/            # Reusable components
│   └── ui/                # UI component library
├── contexts/              # React contexts
│   └── ThemeContext.js    # Theme management
└── hooks/                 # Custom React hooks
    └── useTheme.js        # Theme hook
```

## 🎨 Theme Support

TechTerview includes a built-in theme system that supports:

- **Light Mode**: Clean, bright interface for daytime use
- **Dark Mode**: Easy on the eyes for extended study sessions
- **System Preference**: Automatically matches your OS theme
- **Persistent Settings**: Your theme choice is remembered

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

## 🤝 Contributing

We welcome contributions to TechTerview! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

If you encounter any issues or have questions, please visit our [Help page](/help) or contact our support team.

---

**TechTerview** - Empowering your technical interview journey 💪
