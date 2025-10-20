'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { handleUserMessage } from '@/app/actions';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SynergyOSLogo } from './icons';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface ChatPanelProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addTask: (taskText: string) => void;
}

export function ChatPanel({ messages, setMessages, addTask }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newUserMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      try {
        const response = await handleUserMessage(currentInput, messages);
        setMessages(prev => [...prev, { ...response, id: Date.now().toString() + 'res' }]);

        if (currentInput.toLowerCase().includes('task') || currentInput.toLowerCase().includes('reminder')) {
            const taskText = currentInput.replace(/(add task|new task|reminder|remind me to)\s*/i, '');
            addTask(taskText);
        }

      } catch (error) {
        console.error('Error handling message:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to get a response from the assistant.',
        });
        setMessages(prev => prev.filter(m => m.id !== newUserMessage.id));
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' ? 'justify-end' : ''
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback>
                    <SynergyOSLogo className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "max-w-[75%] rounded-lg p-3 text-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              )}>
                <p className="whitespace-pre-wrap font-body">{message.content}</p>
                {message.plan && (
                    <Card className="mt-4 bg-background/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-base">Execution Plan</CardTitle>
                            <CardDescription>{message.plan.plan.split('Summary:')[1] || ''}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs font-code space-y-2">
                           <p className="font-bold">Plan Details:</p>
                           <p className="whitespace-pre-wrap">{message.plan.plan.split('Summary:')[0]}</p>
                        </CardContent>
                    </Card>
                )}
                {message.tutoringContent && (
                    <Card className="mt-4 bg-background/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-base">Personalized Lesson</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-bold font-headline mb-2">Explanation</h4>
                                <p className="text-sm whitespace-pre-wrap">{message.tutoringContent.explanation}</p>
                            </div>
                            <div>
                                <h4 className="font-bold font-headline mb-2">Adaptive Learning Path</h4>
                                <p className="text-sm whitespace-pre-wrap">{message.tutoringContent.adaptiveLearningPath}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {message.portfolioLayout && (
                    <Card className="mt-4 bg-background/50">
                         <CardHeader>
                            <CardTitle className="font-headline text-base">Generated Portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert prose-sm max-w-none border rounded-md p-4 overflow-auto" dangerouslySetInnerHTML={{ __html: message.portfolioLayout }} />
                        </CardContent>
                    </Card>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                    <SynergyOSLogo className="w-5 h-5 text-primary" />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-lg p-3 text-sm bg-card flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Synergy OS anything..."
            className="pr-24 min-h-[48px] resize-none"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={isPending}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
            <Button type="button" size="icon" variant="ghost" disabled={isPending}>
              <Mic className="w-5 h-5" />
              <span className="sr-only">Use microphone</span>
            </Button>
            <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
