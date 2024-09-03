import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator, ref, set, remove, get, child } from 'firebase/database';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Agent } from '../store/agentsSlice';
import { Chatbot } from '../store/chatbotsSlice';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const realtimeDb = getDatabase(app);
export const functions = getFunctions(app);

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectDatabaseEmulator(realtimeDb, '127.0.0.1', 9000);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

// export const addAgentToFirebase = async (agent: Agent) => {
// 	const agentRef = ref(realtimeDb, `agents/${agent.ownerId}/${agent.id}`);
// 	await set(agentRef, {
// 		id: agent.id,
// 		name: agent.name,
// 		description: agent.description,
// 		instructions: agent.instructions,
// 	});
// };

// export const removeAgentFromFirebase = async (agentId: string, userId: string) => {
// 	const agentRef = ref(realtimeDb, `agents/${userId}/${agentId}`);
// 	await remove(agentRef);
// };

export const getAgentsFromFirebase = async (userId: string) => {
	const agentsRef = ref(realtimeDb, `agents/${userId}`);
	const snapshot = await get(child(agentsRef, '/'));
	if (snapshot.exists()) {
		return Object.entries(snapshot.val()).map(([id, data]) => ({
			id,
			...(data as Omit<Agent, 'id'>),
		}));
	}
	return [];
};

// export const updateThreadInFirebase = async (thread: Partial<Thread>) => {
// 	const threadRef = ref(realtimeDb, `threads/${thread.userId}/${thread.id}`);
// 	await set(threadRef, thread);
// };

// export const updateAgentInFirebase = async (agent: Partial<Agent>) => {
// 	const agentRef = ref(realtimeDb, `agents/${agent.ownerId}/${agent.id}`);
// 	await set(agentRef, agent);
// };

// export const getThreadsFromFirebase = async (userId: string) => {
// 	const threadsRef = ref(realtimeDb, `threads/${userId}`);
// 	const snapshot = await get(child(threadsRef, '/'));
// 	if (snapshot.exists()) {
// 		return Object.entries(snapshot.val()).map(([id, data]) => ({
// 			...(data as Thread),
// 			id, // Move id to the end to ensure it overwrites any id from data
// 		}));
// 	}
// 	return [];
// };

export const addChatbotToFirebase = async (chatbot: Chatbot) => {
	const chatbotRef = ref(realtimeDb, `chatbots/${chatbot.id}`);
	await set(chatbotRef, chatbot);
};

export const removeChatbotFromFirebase = async (chatbotId: string) => {
	const chatbotRef = ref(realtimeDb, `chatbots/${chatbotId}`);
	await remove(chatbotRef);
};

export const updateChatbotInFirebase = async (chatbot: Chatbot) => {
	const chatbotRef = ref(realtimeDb, `chatbots/${chatbot.id}`);
	await set(chatbotRef, chatbot);
};

export const getChatbotsFromFirebase = async (userId: string) => {
	const chatbotsRef = ref(realtimeDb, 'chatbots');
	const snapshot = await get(child(chatbotsRef, '/'));
	if (snapshot.exists()) {
		const allChatbots = snapshot.val();
		return Object.entries(allChatbots)
			.filter(([_, chatbot]) => (chatbot as Chatbot).ownerId === userId)
			.map(([id, data]) => ({
				...(data as Chatbot),
				id,
			}));
	}
	return [];
};

export const getChatbotById = async (chatbotId: string) => {
	const chatbotRef = ref(realtimeDb, `chatbots/${chatbotId}`);
	const chatbotSnapshot = await get(chatbotRef);
	return chatbotSnapshot.exists() ? chatbotSnapshot.val() : null;
  };
  