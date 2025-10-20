'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SynergyOSLogo } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import type { Message, Task, ViewType } from '@/lib/types';
import { ChatPanel } from './chat-panel';
import { TaskManager } from './task-manager';
import { TutorView } from './tutor-view';
import { PortfolioView } from './portfolio-view';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { Separator } from './ui/separator';

const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Synergy OS! I'm your integrated AI assistant. I can help you with tasks, tutoring, and your portfolio. How can I assist you today?",
    },
];

const initialTasks: Task[] = [
    { id: '1', text: 'Design the UI for Synergy OS', completed: true },
    { id: '2', text: 'Develop the multi-agent backend', completed: false },
    { id: '3', text: 'Prepare for the final presentation', completed: false },
];

export function Dashboard() {
  const [activeView, setActiveView] = React.useState<ViewType>('chat');
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

  const addTask = (taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatPanel messages={messages} setMessages={setMessages} addTask={addTask} />;
      case 'tasks':
        return <TaskManager tasks={tasks} onTaskToggle={toggleTask} />;
      case 'tutor':
        return <TutorView />;
      case 'portfolio':
        return <PortfolioView />;
      default:
        return <ChatPanel messages={messages} setMessages={setMessages} addTask={addTask} />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <SynergyOSLogo className="w-8 h-8" />
            <h1 className="text-xl font-semibold font-headline">Synergy OS</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav activeView={activeView} setActiveView={setActiveView} />
        </SidebarContent>
        <SidebarFooter>
            <Separator className="my-2" />
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="person face" />
                        <AvatarFallback>VR</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Vangimalla Roopeswara Sai Reddy</span>
                </div>
                <Button variant="ghost" size="icon">
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h2 className="text-lg font-semibold font-headline capitalize">{activeView}</h2>
            </div>
        </header>
        <main className="flex-1 overflow-auto" style={{ height: 'calc(100vh - 3.5rem)' }}>
            {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
