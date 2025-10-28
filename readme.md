# RDM Assistant - React Native App

A comprehensive leadership assessment and personal growth app built with React Native and Expo.

## Features

- 🔐 **Authentication**: Secure sign up and sign in
- 📊 **Dashboard**: Track goals and mood
- 🎯 **Leadership Assessment**: Quiz system for Mindfulness, Purposefulness, and Empathy
- 📝 **Custom Habits**: Create and manage personalized habits
- 🤖 **AI Integration**: Gemini-powered personalized suggestions
- 💼 **Portfolio Tracking**: Monitor your growth journey

## Getting Started

### Prerequisites

- Node.js (v18+)
- Expo CLI
- Android Studio (for Android development)
- USB debugging enabled on your Android device
- Expo Go app installed on your phone

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. On your Android device:
   - Open Expo Go app
   - Scan the QR code displayed in the terminal
   - Or use USB debugging connection

### Project Structure

```
RDMAssistant/
├── src/
│   ├── screens/          # All screen components
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── LeadershipIntroScreen.js
│   │   ├── QuizLandingScreen.js
│   │   ├── QuizScreen.js
│   │   └── AddGoalScreen.js
│   ├── services/         # Business logic
│   │   ├── AuthService.js
│   │   ├── UserSessionService.js
│   │   ├── GeminiService.js
│   │   └── GoalsService.js
│   ├── constants/       # App constants
│   │   ├── Colors.js
│   │   ├── Typography.js
│   │   ├── Spacing.js
│   │   └── Moods.js
│   └── components/      # Reusable components
├── App.js               # Main entry point
└── package.json
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Start Android development
- `npm run ios` - Start iOS development

## Key Features Implementation

### 1. Authentication System
- User sign up and sign in
- Session management
- Persistent login state

### 2. User Session Management
- Multi-user support
- Email-based data isolation
- First-time user detection

### 3. Dashboard
- Display user goals
- Mood tracking
- Portfolio summary
- Custom habits management

### 4. Leadership Quiz
- 10 mindfulness questions
- 1-5 rating scale
- Detailed explanations
- Score calculation

### 5. Goals Management
- Add custom habits
- Track progress
- User-specific storage

### 6. AI Integration
- Gemini API for personalized suggestions
- Mood-based habit recommendations
- Fallback suggestions

## Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data storage
- **Axios** - HTTP client
- **Linear Gradient** - Gradient effects
- **Gemini API** - AI integration

## Configuration

### Gemini API Key

Update the API key in `src/services/GeminiService.js`:
```javascript
static API_KEY = 'YOUR_GEMINI_API_KEY';
```

## Testing Checklist

- [x] Authentication flow
- [x] User session persistence
- [x] Dashboard data loading
- [x] Quiz completion
- [x] Goals CRUD operations
- [x] Navigation flow
- [x] Mood assessment
- [ ] AI integration testing

## Building for Production

### Android

```bash
# Create production build
npx expo build:android
```

## License

MIT

## Support

For issues and questions, please contact the development team.
