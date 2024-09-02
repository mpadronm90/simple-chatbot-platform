# AI Chatbot Platform

## Project Overview

This project is a sample chatbot platform built with **Next.js + React**. It allows admins (clients) to create and configure chatbots that interact with various AI agents via OpenAI. The platform also includes functionality for end-users to authenticate, start chatting with the chatbot, and maintain a history of their chat interactions.

### Main Features:
1. **Admin Authentication**: Admins authenticate via Firebase to access the chatbot configuration page.
2. **Admin Dashboard**: Lists all created chatbots with options to create, edit, and delete them.
3. **Agent Management**: Admins can create and manage multiple AI agents using the OpenAI API.
4. **Chatbot Configuration**: A form to configure the chatbot's behavior and appearance, including selecting an AI agent, with a live preview.
5. **Deployable Chatbot**: Generates a unique URL for the chatbot and an iframe code snippet for embedding it elsewhere.
6. **End-User Authentication**: Simple email/password authentication for end-users who interact with the chatbot.
7. **Chat History**: Maintain a history of each user's interactions (threads) with the chatbot, allowing users to revisit and continue previous conversations.

## Tech Stack

- **Frontend**: Next.js + React.js
- **Styling**: TailwindCSS
- **State Management**: Redux for global state management
- **Backend**: Firebase (Firestore for data storage, Firebase Auth for admin and end-user authentication)
- **AI Integration**: OpenAI (API integration for creating agents and managing threads)

## Features Specification

### 1. Admin Authentication
- Firebase Authentication manages admin login and access to the admin panel.
- Only authenticated admins can access the admin panel at `/admin`.

### 2. Admin Panel Dashboard
- Displays a list of all created chatbots with options to Edit, Delete, and Preview each chatbot.
- Includes a button to Create New Chatbot.
- Provides access to Agent Management.

### 3. Agent Management
- Admins can create multiple AI agents using the OpenAI API.
- Each agent has the following properties:
  - Name
  - Description
  - Instructions
- Agents are stored and tracked in Firestore.

### 4. Chatbot Configuration
- Configuration form to define the chatbot's name, selected AI agent, prompts, and appearance.
- Admins can choose from previously created agents for each chatbot.
- Provides a live preview of the chatbot during configuration.

### 5. End-User Authentication
- Firebase Authentication manages end-user login and registration.
- Users need to register with an email and password to use the chatbot.

### 6. Chatbot Interaction and Thread Management
- After logging in, users can access their chat history.
- Users can choose a previous conversation/thread from their chat history.
- Selected threads are loaded into the chat interface and connected to the appropriate chatbot.
- New threads can be started for fresh conversations.

### 7. Chatbot Deployment and Access
- Each configured chatbot is accessible via `/chatbot/[chatbot-id]`.
- Generates an iframe code snippet for embedding the chatbot.

## Redux Setup

The project uses Redux for state management. The main state structure includes:
- `auth`: Manages authentication state for both admins and end-users.
- `agents`: Manages the list of AI agents created by admins.
- `chatbots`: Manages the list of chatbots and the currently selected chatbot.
- `threads`: Manages the current chat thread and user's previous threads.

## Firebase Setup

1. **Firebase Authentication**: Implements auth for both admins and end-users.
2. **Firestore Database**: Stores agent configurations, chatbot configurations, and chat threads.

## OpenAI API Integration

1. **Agent Creation**: Creates agents with specified properties (name, description, instructions) via OpenAI API.
2. **Thread Management**: Handles message exchanges between users and AI agents within selected threads.

## Getting Started

(Add instructions for setting up and running the project locally)

## Contributing

(Add guidelines for contributing to the project)

## License

(Add license information)
