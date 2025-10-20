'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Bot, Briefcase, ClipboardCheck, LayoutDashboard, BookOpen } from 'lucide-react';
import type { ViewType } from '@/lib/types';

interface MainNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export function MainNav({ activeView, setActiveView }: MainNavProps) {
  const menuItems = [
    { id: 'chat', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: ClipboardCheck },
    { id: 'tutor', label: 'Tutor', icon: BookOpen },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  ] as const;

  return (
    <SidebarMenu>
      {menuItems.map(item => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => setActiveView(item.id)}
            isActive={activeView === item.id}
            tooltip={{ children: item.label }}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
