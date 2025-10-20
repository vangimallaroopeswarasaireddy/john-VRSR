'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { type Task } from '@/lib/types';
import { ClipboardCheck } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface TaskManagerProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
}

export function TaskManager({ tasks, onTaskToggle }: TaskManagerProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground">
            Here are your tasks managed by the Productivity Agent.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Tasks you need to work on.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {pendingTasks.map(task => (
                  <li key={task.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onTaskToggle(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {task.text}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <ClipboardCheck className="mx-auto h-12 w-12" />
                <p className="mt-4">All caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>Tasks you have finished.</CardDescription>
          </CardHeader>
          <CardContent>
            {completedTasks.length > 0 ? (
              <ul className="space-y-3">
                {completedTasks.map(task => (
                  <li key={task.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onTaskToggle(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className="text-sm font-medium leading-none text-muted-foreground line-through peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {task.text}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No completed tasks yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
