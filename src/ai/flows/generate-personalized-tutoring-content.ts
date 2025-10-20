'use server';
/**
 * @fileOverview A personalized tutoring content generation AI agent.
 *
 * - generatePersonalizedTutoringContent - A function that handles the tutoring content generation process.
 * - GeneratePersonalizedTutoringContentInput - The input type for the generatePersonalizedTutoringContent function.
 * - GeneratePersonalizedTutoringContentOutput - The return type for the generatePersonalizedTutoringContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedTutoringContentInputSchema = z.object({
  topic: z.string().describe('The topic for which tutoring content is needed.'),
  userLearningStyle: z.string().describe('The learning style of the user (e.g., visual, auditory, kinesthetic).'),
  userKnowledgeLevel: z.string().describe('The current knowledge level of the user on the topic (e.g., beginner, intermediate, advanced).'),
  specificNeeds: z.string().optional().describe('Any specific needs or requests from the user.'),
});
export type GeneratePersonalizedTutoringContentInput = z.infer<typeof GeneratePersonalizedTutoringContentInputSchema>;

const GeneratePersonalizedTutoringContentOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the topic tailored to the user.'),
  adaptiveLearningPath: z.string().describe('An adaptive learning path with recommended resources and exercises.'),
});
export type GeneratePersonalizedTutoringContentOutput = z.infer<typeof GeneratePersonalizedTutoringContentOutputSchema>;

export async function generatePersonalizedTutoringContent(input: GeneratePersonalizedTutoringContentInput): Promise<GeneratePersonalizedTutoringContentOutput> {
  return generatePersonalizedTutoringContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedTutoringContentPrompt',
  input: {schema: GeneratePersonalizedTutoringContentInputSchema},
  output: {schema: GeneratePersonalizedTutoringContentOutputSchema},
  prompt: `You are an expert tutor specializing in creating personalized learning experiences.

You will generate tutoring content, including explanations and an adaptive learning path, tailored to the user's specific needs and learning style.

Topic: {{{topic}}}
Learning Style: {{{userLearningStyle}}}
Knowledge Level: {{{userKnowledgeLevel}}}
Specific Needs: {{{specificNeeds}}}

Explanation: A detailed explanation of the topic tailored to the user's learning style and knowledge level.
Adaptive Learning Path: An adaptive learning path with recommended resources and exercises, considering the user's specific needs.
`,
});

const generatePersonalizedTutoringContentFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTutoringContentFlow',
    inputSchema: GeneratePersonalizedTutoringContentInputSchema,
    outputSchema: GeneratePersonalizedTutoringContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
