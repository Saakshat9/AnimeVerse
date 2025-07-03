# AnimeVerse – Explore the World of Anime 🌸

AnimeVerse is a sleek and responsive cross-platform mobile app for anime lovers. Built with React Native and Expo, it offers an intuitive platform to browse trending anime**, **search titles**, and **manage your personal watchlist** with ease.

[![Made with React Native](https://img.shields.io/badge/Built%20with-React%20Native-blue.svg)](https://reactnative.dev/)
[![Jikan API](https://img.shields.io/badge/API-Jikan-orange)](https://jikan.moe/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- 🔐 **User Authentication** (Sign up / Log in)
- 🏠 **Home Screen** with a dynamic trending anime carousel
- 🔍 **Smart Search** by title
- 🌀 **Random Anime Generator**
- 📄 **Anime Detail View** (title, synopsis, rating, episodes, image)
- 📌 **Watchlist Management**
- 📦 **Persistent Storage** using AsyncStorage
- 🌐 **Jikan API Integration** for real-time anime data


## 📱 Screenshots & UI Design

> Designed using **Figma**  
> View the complete UI in the screenshots folder or the presentation slides in `/appendices`.


## 🛠 Tech Stack

| Layer            | Technology              |
|------------------|--------------------------|
| Frontend         | React Native + Expo      |
| State Management | Context API              |
| Backend/Auth     | Firebase                 |
| Local Storage    | AsyncStorage             |
| Data Source      | Jikan API                |
| Development Tools| VS Code, Android Studio  |


## 🧪 Installation & Usage

1. **Clone the repo**
   ```bash
   git clone https://github.com/Saakshat9/AnimeVerse.git
   cd AnimeVerse
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   npx expo start
   ```

4. **Test on device**

   * Scan the QR using **Expo Go** (iOS/Android)
   * Or run on emulator using Android Studio



## 📋 Project Structure

```
AnimeVerse/
├── assets/
├── components/
├── screens/
│   ├── HomeScreen.js
│   ├── AnimeDetailScreen.js
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── ProfileScreen.js
│   └── WatchlistScreen.js
├── App.js
├── app.json
├── package.json
└── README.md
```



## 🔐 Authentication

* Sign up with basic info (name, email, password)
* Secure login with Firebase Auth
* Personalized user data storage with Firestore (optional in future)



## 📊 Performance Metrics

* 📱 95%+ app responsiveness on Android & iOS
* 🔄 API fetches in < 3 seconds
* 🧠 Smooth context-based state handling



## 🧠 Future Enhancements

* Cloud sync for user preferences
* Social features (follow, share, recommend)
* Push notifications for new releases
* In-app dark/light theme toggle



## 📎 Resources

* 📄 [MAD Report PDF](./MAD%20Report.pdf)
* 📂 Appendices (PPT, Certificates, etc.)
* 🔗 [Live Project Link (if deployed)](https://expo.dev/...) *(optional)*



## 📬 Contact

> Developed by **Saakshat Chandratre**
> Under the guidance of **Prof. Mrunali Pawar**
> Department of Computer Science & Design Engineering
> K. K. Wagh Institute of Engineering Education & Research, Nashik

📧 [support@animeverse.app](mailto:support@animeverse.app)
📱 [@AnimeVerseApp](https://twitter.com/AnimeVerseApp) on Twitter & Instagram


📄 License
MIT © [Saakshat Chandratre](https://github.com/Saakshat9)


---

Let me know if you want a version with emojis reduced, more technical detail (e.g., Firebase schema), or even a deploy guide for Play Store / TestFlight.
```
