'use server';

import {
  coordinateMultiAgentWorkflow,
} from '@/ai/flows/coordinate-multi-agent-workflows';
import {
  generatePersonalizedTutoringContent,
} from '@/ai/flows/generate-personalized-tutoring-content';
import {
  contextualizeAgentResponse,
} from '@/ai/flows/contextualize-agent-responses';
import {
  generatePortfolioLayout,
} from '@/ai/flows/generate-portfolio-layout';
import { type Message, type Task } from '@/lib/types';
import { z } from 'zod';

const TaskSchema = z.object({
  action: z.literal('add_task'),
  task: z.string(),
});

async function runWithContext(
  userInput: string,
  agentResponse: string,
  contextMemory: string
) {
  const contextualized = await contextualizeAgentResponse({
    agentName: 'SynergyOS',
    userInput,
    agentResponse,
    contextMemory,
  });
  return contextualized.contextualizedResponse;
}

export async function handleUserMessage(
  userInput: string,
  chatHistory: Message[]
): Promise<Omit<Message, 'id'>> {
  const contextMemory = chatHistory
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const lowerCaseInput = userInput.toLowerCase();

  if (lowerCaseInput.includes('schedule') || lowerCaseInput.includes('plan') || lowerCaseInput.includes('coordinate')) {
    const response = await coordinateMultiAgentWorkflow({ task: userInput, context: contextMemory });
    return {
      role: 'assistant',
      content: "I've created a plan to handle your request. Here are the details:",
      plan: response,
    };
  }

  if (lowerCaseInput.startsWith('explain') || lowerCaseInput.startsWith('what is') || lowerCaseInput.startsWith('tutor me on')) {
    const topic = userInput.replace(/(explain|what is|tutor me on)\s*/i, '');
    const response = await generatePersonalizedTutoringContent({
      topic: topic,
      userLearningStyle: 'visual', // default
      userKnowledgeLevel: 'beginner', // default
    });
    const contextualizedContent = await runWithContext(
      userInput,
      `Here is your personalized lesson on ${topic}:\n\n**Explanation:**\n${response.explanation}\n\n**Learning Path:**\n${response.adaptiveLearningPath}`,
      contextMemory
    );
    return {
      role: 'assistant',
      content: contextualizedContent,
      tutoringContent: response,
    };
  }
  
  if (lowerCaseInput.includes('portfolio')) {
    const content = chatHistory.find(m => m.role === 'user' && m.content.toLowerCase().includes('my projects are'))?.content || 'Default portfolio content: John Doe, a software engineer with expertise in Next.js and AI. Projects include a personal blog and a task management app.';
    const response = await generatePortfolioLayout({ content });
    return {
      role: 'assistant',
      content: "Here is a generated portfolio layout based on your information. You can refine the content and regenerate it.",
      portfolioLayout: response.layout,
    };
  }

  if (lowerCaseInput.includes('task') || lowerCaseInput.includes('reminder')) {
    const taskText = userInput.replace(/(add task|new task|reminder|remind me to)\s*/i, '');
    const agentResponse = `I've added a new task for you: "${taskText}". You can view it in the Tasks panel.`;
    const contextualizedContent = await runWithContext(userInput, agentResponse, contextMemory);
    return {
      role: 'assistant',
      content: contextualizedContent,
    };
  }

  const defaultResponse = `I'm here to help you with productivity, learning, and managing your portfolio. How can I assist you today? You can try things like:\n- "Add a task to finish my report"\n- "Explain the theory of relativity"\n- "Generate my portfolio"`;
  const contextualizedDefault = await runWithContext(userInput, defaultResponse, contextMemory);

  return {
    role: 'assistant',
    content: contextualizedDefault,
  };
}
