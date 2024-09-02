import OpenAI from 'openai';
import { Message } from '../store/threadsSlice'; // Ensure this path is correct

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createAssistant(name: string, instructions: string) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: instructions,
      model: "gpt-4-turbo-preview",
    });

    // Handle the response object
    const assistantDetails = {
      id: assistant.id,
      object: assistant.object,
      createdAt: assistant.created_at,
      name: assistant.name,
      description: assistant.description,
      model: assistant.model,
      instructions: assistant.instructions,
      tools: assistant.tools,
      metadata: assistant.metadata,
      topP: assistant.top_p,
      temperature: assistant.temperature,
      responseFormat: assistant.response_format,
    };

    return assistantDetails;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw new Error('Failed to create assistant');
  }
}

export async function createThread() {
  try {
    const thread = await openai.beta.threads.create();

    // Handle the response object
    const threadDetails = {
      id: thread.id,
      object: thread.object,
      createdAt: thread.created_at,
      metadata: thread.metadata,
      toolResources: thread.tool_resources,
    };

    return threadDetails;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw new Error('Failed to create thread');
  }
}

export async function addMessage(threadId: string, content: string) {
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });

    // Handle the response object
    const messageDetails = {
      id: message.id,
      object: message.object,
      createdAt: message.created_at,
      assistantId: message.assistant_id,
      threadId: message.thread_id,
      runId: message.run_id,
      role: message.role,
      content: message.content,
      attachments: message.attachments,
      metadata: message.metadata,
    };

    return messageDetails;
  } catch (error) {
    console.error('Error adding message:', error);
    throw new Error('Failed to add message');
  }
}

export async function runAssistant(assistantId: string, threadId: string) {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Poll for the run's completion
    let runStatus = run.status;
    while (runStatus !== 'completed' && runStatus !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      const updatedRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
      runStatus = updatedRun.status;
    }

    if (runStatus === 'completed') {
      // Retrieve the messages from the thread
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages.data; // Ensure to return the data property
    } else {
      throw new Error('Run failed');
    }
  } catch (error) {
    console.error('Error running assistant:', error);
    throw new Error('Failed to run assistant');
  }
}

export async function getMessages(threadId: string): Promise<Message[]> {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data.map((msg: any) => ({
      id: msg.id,
      object: 'message',
      created: Number(msg.created),
      role: msg.role,
      content: msg.content,
      content_type: 'text',
      metadata: msg.metadata
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw new Error('Failed to get messages');
  }
}

export async function runAssistantWithStream(threadId: string, assistantId: string, onUpdate: (event: any) => void) {
  try {
    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    for await (const event of stream) {
      onUpdate(event);
    }
  } catch (error) {
    console.error('Error running assistant with stream:', error);
    throw new Error('Failed to run assistant with stream');
  }
}

export async function runAssistantWithoutStream(threadId: string, assistantId: string, instructions?: string): Promise<Message[]> {
  try {
    const run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      { 
        assistant_id: assistantId,
        instructions: instructions
      }
    );

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages.data.reverse().map((msg: any) => ({
        id: msg.id,
        object: 'message',
        created: Number(msg.created),
        role: msg.role,
        content: msg.content,
        content_type: 'text',
        metadata: msg.metadata
      }));
    } else {
      throw new Error('Run did not complete successfully');
    }
  } catch (error) {
    console.error('Error running assistant without stream:', error);
    throw new Error('Failed to run assistant without stream');
  }
}

export async function createThreadAndRun(assistantId: string, messages: { role: string, content: string }[]) {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: {
        messages: messages.map(message => ({
          role: message.role as "user" | "assistant",
          content: message.content
        })),
      },
    });

    // Handle the response object
    const runDetails = {
      id: run.id,
      object: run.object,
      createdAt: run.created_at,
      assistantId: run.assistant_id,
      threadId: run.thread_id,
      status: run.status,
      startedAt: run.started_at,
      expiresAt: run.expires_at,
      cancelledAt: run.cancelled_at,
      failedAt: run.failed_at,
      completedAt: run.completed_at,
      requiredAction: run.required_action,
      lastError: run.last_error,
      model: run.model,
      instructions: run.instructions,
      tools: run.tools,
      metadata: run.metadata,
      temperature: run.temperature,
      topP: run.top_p,
      maxCompletionTokens: run.max_completion_tokens,
      maxPromptTokens: run.max_prompt_tokens,
      truncationStrategy: run.truncation_strategy,
      incompleteDetails: run.incomplete_details,
      usage: run.usage,
      responseFormat: run.response_format,
      toolChoice: run.tool_choice,
      parallelToolCalls: run.parallel_tool_calls,
    };

    return runDetails;
  } catch (error) {
    console.error('Error creating thread and run:', error);
    throw new Error('Failed to create thread and run');
  }
}

export async function deleteThread(threadId: string) {
  try {
    const response = await openai.beta.threads.del(threadId);

    // Handle the response object
    const deleteDetails = {
      id: response.id,
      object: response.object,
      deleted: response.deleted,
    };

    return deleteDetails;
  } catch (error) {
    console.error('Error deleting thread:', error);
    throw new Error('Failed to delete thread');
  }
}

export async function createThreadAndRunWithStream(assistantId: string, messages: { role: string, content: string }[], onUpdate: (event: any) => void) {
  try {
    const stream = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: {
        messages: messages.map(message => ({
          role: message.role as "user" | "assistant",
          content: message.content
        })),
      },
      stream: true,
    });

    for await (const event of stream) {
      onUpdate(event);
    }
  } catch (error) {
    console.error('Error creating thread and run with stream:', error);
    throw new Error('Failed to create thread and run with stream');
  }
}
