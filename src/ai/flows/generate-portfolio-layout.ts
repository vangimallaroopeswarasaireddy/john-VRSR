'use server';

/**
 * @fileOverview A portfolio layout generation AI agent.
 *
 * - generatePortfolioLayout - A function that handles the portfolio layout generation process.
 * - GeneratePortfolioLayoutInput - The input type for the generatePortfolioLayout function.
 * - GeneratePortfolioLayoutOutput - The return type for the generatePortfolioLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePortfolioLayoutInputSchema = z.object({
  content: z
    .string()
    .describe(
      'The content to be used for generating the portfolio layout. This should include project descriptions, achievements, and any other relevant information.'
    ),
});
export type GeneratePortfolioLayoutInput = z.infer<typeof GeneratePortfolioLayoutInputSchema>;

const GeneratePortfolioLayoutOutputSchema = z.object({
  layout: z
    .string()
    .describe(
      'The generated portfolio layout in HTML format, ready to be rendered as a web page.'
    ),
});
export type GeneratePortfolioLayoutOutput = z.infer<typeof GeneratePortfolioLayoutOutputSchema>;

export async function generatePortfolioLayout(
  input: GeneratePortfolioLayoutInput
): Promise<GeneratePortfolioLayoutOutput> {
  return generatePortfolioLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioLayoutPrompt',
  input: {schema: GeneratePortfolioLayoutInputSchema},
  output: {schema: GeneratePortfolioLayoutOutputSchema},
  prompt: `You are an expert web designer specializing in creating visually appealing and professional portfolio layouts.

You will use the provided content to generate an HTML layout for a portfolio, focusing on showcasing projects and achievements in an interactive and engaging manner. Consider modern design principles, responsiveness, and ease of navigation.

Content: {{{content}}}

Ensure the layout is well-structured, uses appropriate HTML tags and CSS classes, and is optimized for different screen sizes.

Return only the HTML code.  Do not include any other text.  Be sure to escape any special characters in the HTML.
`,
});

const generatePortfolioLayoutFlow = ai.defineFlow(
  {
    name: 'generatePortfolioLayoutFlow',
    inputSchema: GeneratePortfolioLayoutInputSchema,
    outputSchema: GeneratePortfolioLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
