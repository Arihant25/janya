'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mic, ArrowLeft, MoreVertical, Sparkles, ThumbsUp, ThumbsDown, 
         BookOpen, Camera, Image, Calendar } from 'lucide-react';

// Global theme configuration
const GLOBAL_THEME = {
  current: 'default',
  colors: {
    default: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb'
    }
  }
};

const getCurrentTheme = () => GLOBAL_THEME.colors[GLOBAL_THEME.current];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'typing' | 'suggestion';
  suggestions?: string[];
  reaction?: 'like' | 'dislike' | null;
}

export default function ChatPageComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const theme = getCurrentTheme();

  // Quick suggestion prompts
  const suggestionPrompts = [
    "How can I be more mindful today?",
    "Help me reflect on my feelings",
    "I need journaling ideas",
    "Tell me about mood tracking"
  ];

  // Initialize with welcome message and suggestions
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: "Hi! I'm here to help with your journaling journey. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    
    const suggestionMessage: Message = {
      id: '2',
      content: "Here are some things we can talk about:",
      sender: 'ai',
      timestamp: new Date(),
      type: 'suggestion',
      suggestions: suggestionPrompts
    };
    
    setMessages([welcomeMessage, suggestionMessage]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, reaction: message.reaction === reaction ? null : reaction }
        : message
    ));
  };

  const handleSendMessage = async (content = inputMessage) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI response with typing indicator and delayed message
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Occasionally send a follow-up suggestion
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const followupSuggestions: Message = {
            id: (Date.now() + 2).toString(),
            content: "Would you like to explore more?",
            sender: 'ai',
            timestamp: new Date(),
            type: 'suggestion',
            suggestions: [
              "Tell me more about your day",
              "Help me identify my emotions",
              "Give me a reflective prompt",
              "How to journal consistently?"
            ]
          };
          setMessages(prev => [...prev, followupSuggestions]);
        }, 1000);
      }
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's really interesting. Tell me more about how that made you feel.",
      "I can sense there's a lot on your mind. Would you like to explore that further?",
      "It sounds like you're processing something important. How has this affected your day?",
      "Thank you for sharing that with me. What do you think might help in this situation?",
      "I appreciate your openness. Have you considered writing about this in your journal?",
      "That's a valuable insight. How do you think this connects to your overall wellbeing?",
      "Your thoughts matter. How about we explore ways to incorporate these reflections into your journal?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'inherit';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
    setInputMessage(target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
      {/* Simplified Chat Header */}
      <div 
        className="sticky top-0 z-20 border-b shadow-sm"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-xl transition-colors"
              style={{ backgroundColor: theme.background }}
            >
              <ArrowLeft size={20} style={{ color: theme.text }} />
            </button>
            
            <div className="flex items-center gap-3">
              {/* Simple Avatar */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <Sparkles size={20} className="text-white" />
              </div>
              
              <div>
                <h1 className="font-semibold" style={{ color: theme.text }}>
                  Your Journal Companion
                </h1>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Ready to chat
                </p>
              </div>
            </div>
          </div>

          <button 
            className="p-2 rounded-xl transition-colors"
            style={{ backgroundColor: theme.background }}
          >
            <MoreVertical size={20} style={{ color: theme.text }} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="animate-fadeIn">
              {message.type === 'suggestion' ? (
                <div className="flex justify-center my-4">
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs sm:max-w-md">
                    {message.suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                        style={{ 
                          backgroundColor: theme.surface, 
                          border: `1px solid ${theme.border}`,
                          color: theme.text 
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                      style={{ backgroundColor: theme.primary + '20' }}
                    >
                      <Sparkles size={16} style={{ color: theme.primary }} />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-xs lg:max-w-md rounded-2xl ${
                      message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                    } shadow-sm`}
                    style={{
                      backgroundColor: message.sender === 'user' ? theme.primary : theme.surface,
                      color: message.sender === 'user' ? 'white' : theme.text,
                      border: message.sender === 'ai' ? `1px solid ${theme.border}` : 'none'
                    }}
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      <div className={`flex items-center justify-between mt-2 ${
                        message.sender === 'user' ? 'text-white' : ''
                      }`} style={{ 
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.textSecondary 
                      }}>
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {message.sender === 'ai' && (
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleReaction(message.id, 'like')}
                              className={`p-1 rounded-full transition-colors ${
                                message.reaction === 'like' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                              }`}
                              style={{ 
                                backgroundColor: message.reaction === 'like' ? theme.success + '20' : 'transparent'
                              }}
                            >
                              <ThumbsUp 
                                size={14} 
                                style={{ 
                                  color: message.reaction === 'like' ? theme.success : theme.textSecondary 
                                }} 
                              />
                            </button>
                            <button 
                              onClick={() => handleReaction(message.id, 'dislike')}
                              className={`p-1 rounded-full transition-colors ${
                                message.reaction === 'dislike' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                              }`}
                              style={{ 
                                backgroundColor: message.reaction === 'dislike' ? '#ef444420' : 'transparent'
                              }}
                            >
                              <ThumbsDown 
                                size={14} 
                                style={{ 
                                  color: message.reaction === 'dislike' ? '#ef4444' : theme.textSecondary 
                                }} 
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0"
                      style={{ backgroundColor: theme.accent + '20' }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                style={{ backgroundColor: theme.primary + '20' }}
              >
                <Sparkles size={16} style={{ color: theme.primary }} />
              </div>
              
              <div 
                className="px-4 py-3 rounded-2xl rounded-tl-none shadow-sm"
                style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
              >
                <div className="flex space-x-1 items-center h-5">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme.primary }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Simplified Message Input */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t p-4"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <div className="max-w-3xl mx-auto rounded-2xl shadow-sm" style={{ backgroundColor: theme.surface }}>
          {/* Simplified Quick actions */}
          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg transition-colors" style={{ color: theme.textSecondary }}>
                <BookOpen size={18} />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: theme.textSecondary }}>
                <Camera size={18} />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: theme.textSecondary }}>
                <Image size={18} />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: theme.textSecondary }}>
                <Calendar size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-end gap-2 p-3">
            {/* Input area */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={adjustTextareaHeight}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: theme.background,
                  color: theme.text,
                  minHeight: '48px', 
                  maxHeight: '120px',
                  focusRingColor: theme.primary + '40'
                }}
                rows={1}
              />
            </div>

            {/* Voice input button */}
            <button 
              className="p-3 rounded-full transition-colors"
              style={{ backgroundColor: theme.background, color: theme.textSecondary }}
            >
              <Mic size={20} />
            </button>

            {/* Send button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className={`p-3 rounded-full transition-all ${
                inputMessage.trim() 
                  ? 'shadow-md hover:shadow-lg transform hover:scale-105' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                backgroundColor: inputMessage.trim() ? theme.primary : theme.border,
                color: 'white'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}