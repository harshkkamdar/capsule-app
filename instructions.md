**Product Requirements Document (PRD)**

**Project Name:** Capsule

---

### **Description**

The Shared Timeline Proposal App is a lightweight mobile-first application designed to share cherished memories through a collaborative timeline. It features a surprise proposal moment and offers the ability to add and view key memories in a seamless, intuitive experience.

The app will:

1. Allow two users to log in and share a timeline.
2. Showcase preloaded memories with descriptions, photos, and dates.
3. Conclude with a surprise message as part of the proposal.
4. Provide a simple interface to add new memories to the timeline.
5. Work offline to ensure reliability during the proposal.

---

### **Core Features**

#### **Phase 1** (Proposal-Ready Features):

1. **User Authentication:**
   - Two user accounts with email-based login (Firebase Authentication).
2. **Shared Timeline:**
   - Display memories as a vertical scrollable timeline.
   - Memory cards with:
     - Photo.
     - Date.
     - Description.
   - Final memory card reveals the proposal message.
3. **Add New Memories:**
   - Basic functionality to upload photos, add descriptions, and set dates.
4. **Personalized Welcome Screen:**
   - A custom greeting for each user.
5. **Surprise Reveal:**
   - Smooth transition to display the final message with animations (e.g., confetti, heart).
6. **Offline Mode:**
   - Ensure the timeline and proposal work without internet.
7. **Capture Moment Feature:**
   - Option to take a selfie post-reveal.

#### **Phase 2** (Post-Proposal Enhancements):

- Commenting and reaction system.
- Notifications for shared anniversaries or special days.
- Cloud syncing for cross-device access.
- AI-based photo tagging and categorization.

---

### **Proposed Tech Stack**

1. **Frontend:**
   - Framework: React Native (supports Android and iOS development).
   - Libraries: Expo for quick prototyping, Lottie for animations.
2. **Backend:**
   - Node.js with Express.js for lightweight API handling.
3. **Database:**
   - Firebase Realtime Database (for shared timeline storage).
   - Firebase Storage (for photo uploads).
4. **Authentication:**
   - Firebase Authentication.
5. **Other Tools:**
   - Capacitor (if extending the app from a Next.js base).
   - React Navigation (for managing screens).

---

### **Proposed File Structure**

```
src/
|-- components/
|   |-- MemoryCard.js  // Component for individual memory cards
|   |-- AddMemoryForm.js // Form for adding a new memory
|   |-- SurpriseReveal.js // Component for the final message
|
|-- screens/
|   |-- LoginScreen.js
|   |-- TimelineScreen.js
|   |-- AddMemoryScreen.js
|
|-- navigation/
|   |-- AppNavigator.js // Handles screen navigation
|
|-- services/
|   |-- AuthService.js // Handles authentication logic
|   |-- DatabaseService.js // CRUD operations for Firebase
|
|-- utils/
|   |-- animations.js // Lottie animations configuration
|   |-- constants.js // Reusable constants (e.g., colors, font sizes)
|
|-- App.js // Entry point
```

---

### **Development Roadmap**

#### **Day 1: Setup and Planning**

- Install React Native environment with Expo.
- Configure Firebase (Authentication, Realtime Database, Storage).
- Set up basic navigation structure.

#### **Day 2: Core Screens**

- Build **Login Screen** with Firebase Authentication.
- Create **Timeline Screen** with a mock data structure.

#### **Day 3: Add Memory Feature**

- Develop **Add Memory Form** (photo upload, description, date).
- Integrate Firebase Realtime Database for saving memories.

#### **Day 4: Surprise Reveal**

- Design and animate the final memory card.
- Implement the reveal transition (confetti, heart animation).

#### **Day 5: Polish and Offline Mode**

- Add offline data caching using AsyncStorage.
- Test app flow from login to reveal.

#### **Day 6: Bug Fixing and Testing**

- Ensure smooth animations and transitions.
- Debug memory additions and timeline sync.
- Optimize for different screen sizes.

#### **Day 7: Final Testing and Deployment**

- Test the app end-to-end.
- Deploy using Expo (APK build for Android).

---

### **Dependencies**

1. **Firebase:** Authentication, Realtime Database, and Storage.
2. **React Native Libraries:**
   - Expo.
   - React Navigation.
   - Lottie.
   - AsyncStorage (or community-maintained replacements).
3. **Testing Tools:** Jest and React Native Testing Library.

---

### **Additional Notes**

- Use placeholder content for unimplemented Phase 2 features.
- Keep UI simple and focus on usability for the proposal context.
- Ensure all media and data are preloaded before handing the app over to her.

