'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import { generatePersonalizedTutoringContent } from '@/ai/flows/generate-personalized-tutoring-content';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface TutoringContent {
  explanation: string;
  adaptiveLearningPath: string;
}

export function TutorView() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState<TutoringContent | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!topic.trim()) return;

    startTransition(async () => {
      try {
        const response = await generatePersonalizedTutoringContent({
          topic: topic,
          userLearningStyle: 'visual',
          userKnowledgeLevel: 'beginner',
        });
        setContent(response);
      } catch (error) {
        console.error('Error generating tutoring content:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate tutoring content.',
        });
      }
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Tutor Agent</h1>
          <p className="text-muted-foreground">
            Get personalized academic help and adaptive learning paths.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>What would you like to learn about?</CardTitle>
            <CardDescription>Enter a topic below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 'Quantum Physics' or 'The French Revolution'"
                disabled={isPending}
              />
              <Button onClick={handleGenerate} disabled={!topic.trim() || isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Learn'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isPending && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {content ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Explanation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {content.explanation}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Adaptive Learning Path</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {content.adaptiveLearningPath}
              </CardContent>
            </Card>
          </div>
        ) : (
          !isPending && (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
              <BookOpen className="mx-auto h-12 w-12" />
              <p className="mt-4">Your personalized lesson will appear here.</p>
            </div>
          )
        )}
      </div>
    </ScrollArea>
  );
}
