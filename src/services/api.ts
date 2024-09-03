export enum APIAction {
  CREATE_ASSISTANT = 'createAssistant',
  GET_AGENTS = 'getAgents',
  DELETE_ASSISTANT = 'deleteAssistant',
  CREATE_THREAD = 'createThread',
  GET_THREADS = 'getThreadsByUserAndChatbot',
  ADD_MESSAGE = 'addMessage',
  RUN_ASSISTANT = 'runAssistant',
  GET_THREAD_MESSAGES = 'getThreadMessages',
}

export async function callAPI(action: APIAction, data?: any) {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  if (action === APIAction.RUN_ASSISTANT) {
    return response; // Return the raw response for streaming
  }

  return response.json();
}