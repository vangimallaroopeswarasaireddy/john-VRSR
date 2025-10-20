'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generatePortfolioLayout } from '@/ai/flows/generate-portfolio-layout';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const exampleContent = `
Name: Alex Doe
Role: Full-Stack Developer & AI Enthusiast

About Me:
A creative developer with a passion for building beautiful and functional applications. Experienced in React, Next.js, and Python. Currently exploring the world of generative AI.

Projects:
1. Project Alpha: An e-commerce platform built with Next.js and Stripe. Features include a custom CMS and real-time inventory management.
2. Project Beta: A mobile app for task management using React Native. It uses Firebase for authentication and data storage.
3. Synergy OS: A multi-agent AI assistant for enhanced productivity.

Skills:
- JavaScript, TypeScript, Python
- React, Next.js, Node.js
- Tailwind CSS, shadcn/ui
- Firebase, MongoDB
- Genkit, OpenAI API
`.trim();

export function PortfolioView() {
  const [content, setContent] = useState(exampleContent);
  const [layout, setLayout] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        const response = await generatePortfolioLayout({ content });
        // Inject placeholder images into the layout
        let finalLayout = response.layout;
        PlaceHolderImages.forEach((img, index) => {
            const regex = new RegExp(`(src=")(https://picsum.photos/seed/[^"]+)`, "g");
            let count = 0;
            finalLayout = finalLayout.replace(regex, (match, p1, p2) => {
                if (count === index) {
                    count++;
                    return `${p1}${img.imageUrl}`;
                }
                count++;
                return match;
            });
        });

        // A basic way to make images responsive in the generated HTML
        finalLayout = finalLayout.replace(/<img /g, '<img style="width: 100%; height: auto; border-radius: 0.5rem;" ');

        setLayout(finalLayout);

      } catch (error) {
        console.error('Error generating portfolio layout:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate portfolio layout.',
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 h-full">
      <ScrollArea className="h-full border-r">
        <div className="p-4 md:p-6 space-y-6">
          <header className="space-y-1.5">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Portfolio Agent</h1>
            <p className="text-muted-foreground">
              Provide your details to automatically generate an interactive portfolio.
            </p>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>
                Add your projects, skills, and bio. The AI will use this to create your portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-code text-sm"
                placeholder="Enter your portfolio content here..."
                disabled={isPending}
              />
              <Button onClick={handleGenerate} disabled={!content.trim() || isPending} className="mt-4 w-full">
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : 'Generate Portfolio'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold font-headline mb-4">Generated Preview</h2>
            {isPending && (
                <div className="flex justify-center items-center py-16 border-2 border-dashed rounded-lg">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}
            {layout ? (
              <div className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-6 bg-card" dangerouslySetInnerHTML={{ __html: layout }} />
            ) : !isPending && (
              <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
                <Briefcase className="mx-auto h-12 w-12" />
                <p className="mt-4">Your generated portfolio will appear here.</p>
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
