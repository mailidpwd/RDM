# 🌟 RDM Assistant - React Native App

A comprehensive leadership assessment and personal growth app built with React Native and Expo.

---

## 📱 What is This App?

RDM Assistant helps you:
- 📊 **Track your mood** - Daily mood assessment with AI-powered habit recommendations
- 🎯 **Set & achieve goals** - Create custom habits and track your progress
- 🌱 **Personal growth** - Leadership quizzes for Mindfulness, Purposefulness, and Empathy
- 💼 **Portfolio tracking** - Monitor your growth journey over time
- 🤖 **AI-powered** - Gemini AI provides personalized suggestions based on your mood

---

## 🚀 Getting Started From Scratch

### Step 1: Prerequisites

You need these installed on your computer:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Expo Go App** (on your phone)
   - Android: Download from Play Store
   - iOS: Download from App Store

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## 📥 Step 2: Install the Project

### Option A: Clone from GitHub

```bash
git clone https://github.com/mailidpwd/RDM.git
cd RDM
```

### Option B: Download as ZIP

1. Go to: https://github.com/mailidpwd/RDM
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal/command prompt in the extracted folder

---

## 🔧 Step 3: Install Dependencies

Open terminal/command prompt in the project folder and run:

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is needed to resolve some package conflicts.

⏳ **Wait for installation to complete** (this may take 2-5 minutes)

---

## ▶️ Step 4: Start the Development Server

Run this command:

```bash
npx expo start --tunnel
```

You'll see something like this:
```
Starting Metro Bundler...
Tunnel connected.
› Press r │ reload app
› Press m │ toggle menu
› Scan QR code with Expo Go
```

---

## 📲 Step 5: Run on Your Phone

### Using Expo Go (Recommended for testing):

1. **On your phone:** Open the **Expo Go** app
2. **Scan the QR code** from your terminal screen
3. **Wait for loading** - The app will download and launch

### If QR code doesn't work:

1. Make sure your phone and computer are on the **same Wi-Fi network**
2. Or use the **tunnel mode** (already included in the command above)
3. You can also manually enter the URL shown in the terminal

---

## 🎯 Using the App

### First Time Setup:

1. **Sign Up** - Create an account with your email
2. **Dashboard** - See your progress and goals
3. **Take Assessment** - Tap "Leadership Quiz" to get started
4. **Track Mood** - Select your mood to get personalized habit recommendations

### Key Features:

- 🔐 **Authentication** - Secure sign up/sign in system
- 📊 **Dashboard** - Track goals and view portfolio
- 🎯 **Leadership Quiz** - Mindfulness, Purposefulness, Empathy assessments
- 🌈 **Mood Tracking** - Daily mood assessment with AI recommendations
- 💼 **Custom Habits** - Create and manage personalized goals
- 🤖 **AI Suggestions** - Gemini-powered personalized recommendations

---

## 🛠️ Troubleshooting

### "npm install" fails:
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### QR code not scanning:
```bash
npx expo start --tunnel
```
Then manually enter the URL shown in terminal

### Metro bundler errors:
```bash
npx expo start --clear
```

### App not loading on phone:
- Check internet connection
- Restart Metro bundler: Press `r` in terminal
- Or reload the app by shaking your phone in Expo Go

### UUID errors:
If you see "Unable to resolve uuid":
- The code already has a fix for this
- Just restart the server:
  ```bash
  npx expo start --clear
  ```

---

## 📁 Project Structure

```
RDM/
├── src/
│   ├── screens/          # All screen components
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── MoodAssessmentScreen.js
│   │   └── ...
│   ├── services/         # Business logic & API
│   │   ├── AuthService.js
│   │   ├── GeminiService.js
│   │   └── GoalsService.js
│   └── components/       # Reusable components
├── App.js                # Main entry point
├── index.js             # Expo registration
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

---

## 🔑 Configuration

### Gemini AI API Key

The app uses Google's Gemini AI for personalized recommendations. You need to add your API key:

1. Get API key from: https://makersuite.google.com/app/apikey
2. Open: `src/services/GeminiService.js`
3. Replace `'YOUR_API_KEY_HERE'` with your actual key

---

## 📦 Build for Production

### Create Android APK:

```bash
# Login to Expo
npx eas login

# Build APK
npx eas build --platform android --profile preview

# Download the APK from the build page
```

---

## 🎓 Available Commands

```bash
npm start              # Start Expo dev server
npm run android        # Start for Android
npm run ios            # Start for iOS
npx expo start --clear # Clear cache and restart
npx expo start --tunnel # Use tunnel for QR code
```

---

## 🧪 Testing Features

- ✅ Authentication (Sign up/Login)
- ✅ Dashboard with goals
- ✅ Mood assessment
- ✅ Leadership quiz
- ✅ Custom habits creation
- ✅ AI-powered recommendations

---

## 💻 Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **Google Gemini API** - AI recommendations
- **Linear Gradient** - UI effects

---

## 📝 Development Notes

### Key Improvements Made:

1. **Fixed UUID compatibility** - Replaced `uuid` package with React Native compatible generator
2. **Fixed navigation** - Using React Navigation stack for proper routing
3. **Fixed Expo Go compatibility** - Removed worklets/reanimated plugins
4. **Added tunnel mode** - For reliable QR code scanning
5. **Improved error handling** - Better user feedback on errors

---

## 🐛 Known Issues

- Some users may need to run `npm install --legacy-peer-deps` for dependencies
- UUID package was replaced with native solution for Expo Go compatibility
- Navigation dependencies updated for better stability

---

## 📞 Support

- **GitHub Issues**: https://github.com/mailidpwd/RDM/issues
- **Email**: mailidpwd@gmail.com

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🎉 You're All Set!

Enjoy building with RDM Assistant! If you encounter any issues, check the troubleshooting section above or create an issue on GitHub.

**Happy Coding! 🚀**
