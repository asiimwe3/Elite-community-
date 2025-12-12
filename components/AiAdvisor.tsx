import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { Campaign, ChatMessage } from '../types';
import { createMarketingChat } from '../services/geminiService';
import { GenerateContentResponse, Chat } from "@google/genai";

interface AiAdvisorProps {
  campaigns: Campaign[];
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ campaigns }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your AI Marketing Analyst. I've analyzed your campaigns. How can I help you optimize your performance today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat with campaign context
    chatRef.current = createMarketingChat(campaigns);
  }, [campaigns]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result: GenerateContentResponse = await chatRef.current.sendMessage({ message: input });
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: result.text || "I'm having trouble analyzing that right now.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Icons.AI className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">AI Marketing Advisor</h2>
            <p className="text-xs text-gray-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold opacity-70">
                  <Icons.AI className="w-3 h-3" />
                  AI Analyst
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-4 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            placeholder="Ask about your campaign performance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icons.Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-xs text-gray-400">
                AI can make mistakes. Please review critical marketing decisions.
            </p>
        </div>
      </div>
    </div>
  );
};
