import React from 'react';
import { ChatInterface } from '../components/assistant/ChatInterface';
import { Bot, Sparkles, BookOpen, FileCheck } from 'lucide-react';

export const KnowledgeAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <ChatInterface />
    </div>
  );
};
