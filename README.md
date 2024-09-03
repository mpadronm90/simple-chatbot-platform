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

## Database Structure and Flow

The platform follows this relational structure:

- One admin can have multiple chatbots
- One chatbot is created with one AI agent (OpenAI assistant)
- One chatbot pertains to only one admin
- One admin can have multiple users
- One user can be associated with only one admin
- One user can use multiple chatbots from their associated admin
- One chatbot can be used by multiple users from the same admin
- One thread is created between one chatbot and one user

### Entity Relationships

1. Admin
   - Has many: Chatbots, Users
2. Chatbot
   - Belongs to: Admin
   - Has one: AI Agent
   - Has many: Threads
3. User
   - Has many: Admin
   - Has many: Threads
4. Thread
   - Belongs to: Chatbot, User
   - Has many: Messages
5. AI Agent (OpenAI Assistant)
   - Belongs to: Chatbot

## Data Flow

1. Admin creates a chatbot and associates it with an AI agent
2. Admin adds users to their account
3. Users can signup and login in the chatbot
4. Admins can signup/login using the admin panel
5. Users can access chatbots created by their admin
6. When a user interacts with a chatbot, a new thread is created (if it doesn't exist)
7. Messages are stored within the thread, maintaining the conversation history

## Firebase Database Structure

The Firebase database is structured as follows:

```
firebase-root
│
├── admins
│ └── {adminId}
│ ├── name: string
│ ├── email: string
│ └── ...other admin-specific fields
│
├── users
│ └── {userId}
│ ├── name: string
│ ├── email: string
│ ├── adminId: string
│ └── ...other user-specific fields
│
├── chatbots
│ └── {chatbotId}
│ ├── name: string
│ ├── adminId: string
│ ├── agentId: string
│ └── ...other chatbot-specific fields
│
├── threads
│ └── {threadId}
│ ├── chatbotId: string
│ ├── userId: string
│ └── ...other thread-specific fields
│
└── messages
└── {messageId}
├── threadId: string
├── senderId: string
├── content: string
└── ...other message-specific fields
```

### Tech Stack

- **Frontend**: Next.js + React.js
- **Styling**: TailwindCSS
- **State Management**: Redux (with @reduxjs/toolkit)
- **Backend**: Firebase (Firestore for data storage, Firebase Auth for admin and end-user authentication)
- **AI Integration**: OpenAI (API integration for creating agents and managing threads)

### Project Structure

````
src/
├── app/
│   ├── admin/
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── chatbot/
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── StoreProvider.tsx
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── AgentManagement.tsx
│   │   ├── ChatbotForm.tsx
│   │   └── ChatbotList.tsx
│   ├── auth/
│   │   └── withAuth.tsx
│   └── chatbot/
│       ├── AgentSelector.tsx
│       ├── AppearanceSettings.tsx
│       ├── Chatbot.tsx
│       ├── ChatbotConfig.tsx
│       ├── ChatbotInterface.tsx
│       ├── ChatbotPreview.tsx
│       ├── LoginSignup.tsx
│       ├── MessageInput.tsx
│       ├── MessageList.tsx
│       └── ThreadSelector.tsx
├── config/
│   └── firebase.ts
├── services/
│   ├── authService.ts
│   ├── chatbotService.tsx
│   ├── firebase.ts
│   └── openai.ts
├── store/
│   ├── agentsSlice.ts
│   ├── authSlice.ts
│   ├── chatbotsSlice.ts
│   ├── index.ts
│   ├── rootReducer.ts
│   └── threadsSlice.ts
````

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server: `npm run dev`
5. Run Firebase emulators for Auth and Realtime Database
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions to this project! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

Under the MIT License in [License](https://github.com/mpadronm90/simple-chatbot-platform/blob/main/LICENSE))
