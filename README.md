# AI Chatbot Platform

## Project Overview

This project is a sample chatbot platform built with Next.js and React. It allows admins to create and configure chatbots that interact with various AI agents via OpenAI. The platform includes functionality for end-users to authenticate, start chatting with the chatbot, and maintain a history of their chat interactions.

## Main Features

1. **Admin Authentication**: Admins authenticate to access the entire admin section.
2. **Admin Dashboard**: Lists all created chatbots with options to create, edit, and delete them.
3. **Agent Management**: Admins can create and manage multiple AI agents using the OpenAI API.
4. **Chatbot Configuration**: A form to configure the chatbot's behavior and appearance, including selecting an AI agent, with a live preview.
5. **Deployable Chatbot**: Generates a unique URL for the chatbot and an iframe code snippet for embedding it elsewhere.
6. **End-User Authentication**: Simple email/password authentication for end-users who interact with the chatbot.
7. **Chat History**: Maintain a history of each user's interactions (threads) with the chatbot.

## Tech Stack

- **Frontend**: Next.js + React.js
- **Styling**: TailwindCSS
- **State Management**: Redux (with @reduxjs/toolkit)
- **Backend**: Firebase (Firestore for data storage, Firebase Auth for admin and end-user authentication)
- **AI Integration**: OpenAI (API integration for creating agents and managing threads)

## Project Structure

```
src/
├── app/
│ ├── admin/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── page.tsx
│ ├── chatbot/
│ │ └── [id]/
│ │ └── page.tsx
│ ├── layout.tsx
│ └── page.tsx
├── components/
│ ├── admin/
│ │ ├── AdminDashboard.tsx
│ │ ├── AgentManagement.tsx
│ │ ├── ChatbotForm.tsx
│ │ ├── ChatbotList.tsx
│ │ └── withAdminAuth.tsx
│ ├── chatbot/
│ │ ├── AgentSelector.tsx
│ │ ├── AppearanceSettings.tsx
│ │ ├── ChatbotConfig.tsx
│ │ └── ChatbotPreview.tsx
│ └── user/
│ ├── ChatInterface.tsx
│ ├── MessageInput.tsx
│ ├── MessageList.tsx
│ └── ThreadSelector.tsx
├── config/
│ └── firebase.ts
├── store/
│ ├── agentsSlice.ts
│ ├── authSlice.ts
│ ├── chatbotsSlice.ts
│ ├── index.ts
│ └── threadsSlice.ts
└── utils/
└── openai.ts
```

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Emulator Setup

To set up and use Firebase emulators for local development:

1. Install Firebase CLI globally:
   ```
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase emulators in your project directory:
   ```
   firebase init emulators
   ```

4. Select Firestore and Authentication emulators when prompted.

5. Start the emulators:
   ```
   firebase emulators:start
   ```

6. Update your Firebase configuration in `src/config/firebase.ts` to use emulators in development:

   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth, connectAuthEmulator } from 'firebase/auth';
   import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

   const firebaseConfig = {
     // Your config here
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);

   if (process.env.NODE_ENV === 'development') {
     connectAuthEmulator(auth, 'http://localhost:9099');
     connectFirestoreEmulator(db, 'localhost', 8080);
   }
   ```

## Current Status

- Basic project structure set up
- Redux store and slices implemented
- Firebase configuration added
- Admin authentication implemented for the entire admin section
- User authentication implemented within the chatbot interface
- Basic components created for admin dashboard and chatbot interface
- Firebase emulators set up for local development

## Next Steps

1. Implement remaining components (MessageList, MessageInput, ThreadSelector)
2. Set up Firebase security rules
3. Integrate OpenAI for message handling in the chatbot
4. Enhance the user chat interface to handle real-time messaging
5. Implement CRUD operations for chatbots and agents using Firebase Firestore

## Contributing

[Add your contributing guidelines here]

## License

[Add your license information here]