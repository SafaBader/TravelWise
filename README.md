# 🌍 TravelWise - Your Ultimate Travel Companion

![TravelWise](https://img.shields.io/badge/TravelWise-Travel_Planning_Platform-4F46E5?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11.6.1-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

**TravelWise** is a modern, full-featured travel planning web application built with React and TypeScript. Plan your perfect trips with an intuitive drag-and-drop interface, discover amazing destinations, save your favorite places, and organize multiple travel itineraries all in one beautiful, responsive platform.

## ✨ Key Features

### 🗺️ **Destination Discovery**
- **Explore Places**: Browse through a curated collection of travel destinations
- **Detailed Information**: View comprehensive details including ratings, reviews, categories, and descriptions
- **Rich Media**: High-quality images and galleries for each destination
- **Advanced Filtering**: Filter places by categories, ratings, and locations

### ❤️ **Personalized Experience**
- **Favorites System**: Save places you love for quick access and future planning
- **User Authentication**: Secure Firebase authentication with email/password
- **Personal Profiles**: Track your travel preferences and trip history
- **Cross-device Sync**: Your data stays synchronized across all your devices

### 📅 **Advanced Trip Planning**
- **Multiple Trip Plans**: Create and manage unlimited trip itineraries
- **Drag & Drop Interface**: Intuitive planning with visual drag-and-drop functionality
- **Day-by-Day Organization**: Structure your trips with detailed daily schedules
- **Flexible Planning**: Set custom trip durations and destinations
- **Real-time Saving**: Auto-save your plans to the cloud

### 🎨 **Modern UI/UX**
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark/light theme switching
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.5.3** - Type-safe development with strict mode
- **Vite** - Lightning-fast build tool and development server

### **State Management**
- **Redux Toolkit 2.2.7** - Efficient state management with RTK Query
- **React Redux 9.1.2** - Official React bindings for Redux

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful, customizable icons
- **PostCSS** - CSS processing and optimization

### **Backend & Database**
- **Firebase 11.6.1** - Comprehensive backend-as-a-service
  - **Authentication** - User management and security
  - **Firestore** - NoSQL cloud database
  - **Analytics** - User behavior tracking

### **Routing & Navigation**
- **React Router DOM 6.28.0** - Declarative routing for React

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **TypeScript Compiler** - Type checking and compilation
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
travelWise/
├── public/                 # Static assets
├── src/
│   ├── app/               # Redux store configuration
│   │   └── store.ts
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components
│   │   │   ├── LoadingState.tsx
│   │   │   ├── PlaceCard.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── StatusView.tsx
│   │   └── layout/        # Layout components
│   │       ├── AuthModal.tsx
│   │       └── Navbar.tsx
│   ├── features/          # Redux slices and business logic
│   │   ├── auth/          # Authentication state
│   │   ├── places/        # Places data management
│   │   ├── trips/         # Trip planning functionality
│   │   └── ui/            # UI state management
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # External service configurations
│   │   └── firebase.ts
│   ├── pages/             # Page components
│   │   ├── AuthPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── PlaceDetailPage.tsx
│   │   ├── PlannerPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── shared.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.tsx           # Application entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

**Made with ❤️ for travelers, by travelers**

*Ready to explore the world? Start planning your next adventure with TravelWise!* 🌟
