import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';

interface StoryLogProps {
  messages: Message[];
  isLoading: boolean;
}

const StoryLog: React.FC<StoryLogProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/30 rounded-lg border border-gray-700">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.speaker === 'DM' ? (
            <div className="prose prose-lg prose-invert text-gray-200 font-serif-dnd max-w-none">
              <p>{msg.text}</p>
            </div>
          ) : (
            <div className="text-amber-300 italic text-lg text-right font-sans-dnd">
              <p>&gt; {msg.text}</p>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="text-center text-gray-400 animate-pulse font-serif-dnd text-lg">
          <p>El Dungeon Master está tejiendo el destino...</p>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default StoryLog;