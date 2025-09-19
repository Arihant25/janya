'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Brain, Sparkles, MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mood?: string;
  suggestions?: string[];
}

interface UserContext {
  recentEntries: string[];
  dominantMoods: string[];
  interests: string[];
  goals: string[];
  challenges: string[];
}

// AI Insight Card Component
const AIInsightCard = ({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) => (
  <div className="bg-white bg-opacity-80 rounded-xl p-3 border border-purple-100">
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <h3 className="font-medium text-sm text-gray-800">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{content}</p>
      </div>
    </div>
  </div>
);

// Message Bubble Component
const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
  <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
    {!isUser && (
      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
    )}
    
    <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
      <div className={`rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'bg-white border border-gray-200 text-gray-800'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
      
      {!isUser && message.suggestions && (
        <div className="flex flex-wrap gap-2 mt-2">
          {message.suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
              onClick={() => {
                // Handle suggestion click
                const event = new Event('suggestion-click');
                event.suggestion = suggestion;
                window.dispatchEvent(event);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1 px-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
    
    {isUser && (
      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
        <User size={16} className="text-white" />
      </div>
    )}
  </div>
);

function ChatPageComponent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history and user context when component mounts
    loadChatHistory();
    loadUserContext();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Start with welcome message if no history
      setMessages([{
        id: '1',
        type: 'ai',
        content: `Hello ${user?.name || 'there'}! I'm your personal AI companion. I've been analyzing your recent journal entries and I'm here to support you. How are you feeling today?`,
        timestamp: new Date(),
        suggestions: ["Tell me about your day", "I'm feeling anxious", "I want to reflect on my goals"]
      }]);
    }
  };

  const loadUserContext = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        // Extract context from user's journal entries and profile
        setUserContext({
          recentEntries: profile.recentEntries || [],
          dominantMoods: profile.dominantMoods || ['thoughtful'],
          interests: profile.interests || ['personal growth'],
          goals: profile.goals || ['better work-life balance'],
          challenges: profile.challenges || ['work stress']
        });
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: userContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || [
          "Tell me more about this",
          "How can I improve?",
          "What patterns do you see?"
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Implement speech-to-text functionality
  };

  return (
    <div>
      <Navigation />
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">Your AI Companion</h1>
                <p className="text-sm text-gray-600">Always here to listen and understand</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        {userContext && (
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="grid grid-cols-1 gap-3 mb-4">
              <AIInsightCard
                title="Mood Pattern"
                content={`You've been predominantly ${userContext.dominantMoods[0]} lately, with a focus on ${userContext.interests[0]}.`}
                icon={<Heart size={16} className="text-purple-600" />}
              />
              <AIInsightCard
                title="Growth Opportunity"
                content={`Your entries show progress toward "${userContext.goals[0]}". Keep building on this momentum!`}
                icon={<Sparkles size={16} className="text-purple-600" />}
              />
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 max-w-md mx-auto px-4 overflow-y-auto">
          <div className="pb-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.type === 'user'}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white bg-opacity-95 backdrop-blur-lg border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts with me..."
                  className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all duration-300 resize-none max-h-32"
                  rows={1}
                  style={{ minHeight: '48px' }}
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                    isListening ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                <Send size={20} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 px-2">
              <p className="text-xs text-gray-500">
                Your AI companion learns from your journal entries
              </p>
              <button className="text-xs text-purple-600 hover:text-purple-700">
                <Volume2 size={14} className="inline mr-1" />
                Read aloud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatPageComponent);