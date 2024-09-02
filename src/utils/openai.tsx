import OpenAI from 'openai';

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
    return assistant;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw new Error('Failed to create assistant');
  }
}

export async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread;
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
    return message;
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
    return run;
  } catch (error) {
    console.error('Error running assistant:', error);
    throw new Error('Failed to run assistant');
  }
}

export async function getMessages(threadId: string) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw new Error('Failed to get messages');
  }
}

export async function runAssistantWithStream(threadId: string, assistantId: string, onUpdate: (content: string) => void) {
  try {
    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId
    })
      .on('textCreated', () => onUpdate('\n'))
      .on('textDelta', (textDelta) => onUpdate(textDelta.value))
      .on('toolCallCreated', (toolCall) => onUpdate(`\n${toolCall.type}\n\n`))
      .on('toolCallDelta', (toolCallDelta) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            onUpdate(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            onUpdate("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach(output => {
              if (output.type === "logs") {
                onUpdate(`\n${output.logs}\n`);
              }
            });
          }
        }
      });

    await run.finalResponse();
    return run;
  } catch (error) {
    console.error('Error running assistant with stream:', error);
    throw new Error('Failed to run assistant with stream');
  }
}

export async function runAssistantWithoutStream(threadId: string, assistantId: string, instructions?: string) {
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
      return messages.data.reverse();
    } else {
      throw new Error(`Run failed with status: ${run.status}`);
    }
  } catch (error) {
    console.error('Error running assistant without stream:', error);
    throw new Error('Failed to run assistant without stream');
  }
}
