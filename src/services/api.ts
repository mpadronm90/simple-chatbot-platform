import { APIAction, APIInput } from '../shared/api.types';
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "./firebase";

export { APIAction };  // Add this line to export APIAction

export const callAPI = async (action: APIAction, data: APIInput[keyof APIInput]): Promise<any> => {
  try {
    const functions = firebaseFunctions;
    const functionName = actionToFunctionName(action);
    const callableFunction = httpsCallable(functions, functionName);
    
    const result = await callableFunction(data);
    return result.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

function actionToFunctionName(action: APIAction): string {
  switch (action) {
    case APIAction.CREATE_ASSISTANT: return 'createAssistant';
    case APIAction.GET_AGENTS: return 'getAgents';
    case APIAction.DELETE_ASSISTANT: return 'deleteAssistant';
    case APIAction.CREATE_THREAD: return 'createThread';
    case APIAction.GET_THREADS: return 'getThreads';
    case APIAction.ADD_MESSAGE: return 'addMessage';
    case APIAction.RUN_ASSISTANT: return 'runAssistant';
    case APIAction.UPDATE_ASSISTANT: return 'updateAssistant';
    case APIAction.GET_THREAD_MESSAGES: return 'getThreadMessages';
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}