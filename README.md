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

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Firebase** project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travelwise.git
   cd travelwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Enable Firestore Database
   - Add your Firebase config to `src/lib/firebase.ts`

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔥 Firebase Setup

### Firestore Data Structure

#### `places` Collection
```javascript
{
  title: "string",
  name: "string", // fallback for title
  category: "string",
  description: "string",
  longDescription: "string", // optional
  tags: ["string"],
  location: "string",
  rates: number, // rating (1-5)
  openingHours: "string",
  featured: boolean,
  image: "string", // optional
  gallery: ["string"], // optional
  country: "string", // optional
  reviewCount: number // optional
}
```

#### `userProfiles` Collection
```javascript
{
  email: "string",
  displayName: "string",
  createdAt: "timestamp"
}
```

#### `favorites` Collection
```javascript
{
  userId: "string",
  placeId: "string",
  createdAt: "timestamp"
}
```

#### `tripPlans` Collection
```javascript
{
  userId: "string",
  name: "string",
  destination: "string",
  startDate: "string", // optional
  endDate: "string", // optional
  items: [
    {
      placeId: "string",
      day: number,
      note: "string" // optional
    }
  ],
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run typecheck` | Run TypeScript type checking |

## 🎯 Usage Guide

### For Travelers
1. **Sign Up/Login** - Create your account to start planning
2. **Explore Destinations** - Browse and discover amazing places
3. **Save Favorites** - Heart places you want to visit
4. **Create Trip Plans** - Use the drag-and-drop planner to organize your itinerary
5. **Manage Multiple Trips** - Plan different vacations simultaneously

### For Developers
- **Component-Based Architecture** - Easy to extend and maintain
- **Type-Safe Development** - Full TypeScript support prevents runtime errors
- **Modular State Management** - Redux slices for clean separation of concerns
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and TypeScript conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for the robust backend services
- **Tailwind CSS** for the utility-first styling approach
- **Lucide** for the beautiful icon set
- **Vite** for the blazing-fast development experience

---

**Made with ❤️ for travelers, by travelers**

*Ready to explore the world? Start planning your next adventure with TravelWise!* 🌟
