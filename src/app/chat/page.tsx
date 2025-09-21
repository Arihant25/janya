'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, MessageCircle } from 'lucide-react';
import { Card, Button, IconButton, TextField, LinearProgress, List, ListItem, FAB, Chip } from '@/app/components/MaterialComponents';
import withAuth from '@/components/withAuth';
import Navigation from '@/app/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

function ChatPageComponent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestionPrompts = [
    "How can I improve my mood today?",
    "Help me reflect on my recent journal entries",
    "What patterns do you notice in my emotional journey?",
    "Can you suggest some mindfulness exercises?",
    "What are some techniques to manage stress?"
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getChatMessages();
      const formattedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);

      // Add welcome message if no chat history
      if (formattedMessages.length === 0) {
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Hello ${user?.name}! I'm Janya, your personal wellness companion. I'm here to support you on your journey and help you reflect on your thoughts and emotions. How are you feeling today?`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Add fallback welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${user?.name}! I'm Janya, your personal wellness companion. I'm here to support you on your journey. How are you feeling today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    // Create thinking message
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: 'thinking...',
      timestamp: new Date(),
      streaming: true
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      const response = await apiService.sendChatMessage(message.trim());

      // Update message with actual response
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: response.message || 'I apologize, but I didn\'t receive a proper response. Please try again.',
            streaming: false
          }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);

      // Update the message with error
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? {
            ...msg,
            content: 'I apologize, but I encountered an error processing your message. Please try again.',
            streaming: false
          }
          : msg
      ));
    } finally {
      setStreamingMessageId(null);
      setIsSending(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 75)}px`;
    }
  };

  // Ensure textarea resizes on inputMessage change
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--md-sys-color-background)' }}>
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-spin" style={{ background: 'linear-gradient(90deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}>
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-white" />
            </div>
            <p style={{ color: 'var(--janya-text-secondary)' }}>Loading your conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--md-sys-color-background)' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        {/* <div className="sticky top-0 z-10 shadow-sm" style={{ background: 'var(--md-sys-color-surface)', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}>
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-2xl mb-0" style={{ color: 'var(--janya-text-primary)' }}>Janya</p>
                <p className="text-sm" style={{ color: 'var(--janya-text-secondary)' }}>Your wellness companion</p>
              </div>
              <button
                onClick={loadChatHistory}
                className="p-2 rounded-lg transition-colors"
                style={{ background: 'transparent' }}
                title="Refresh chat"
              >
                <RefreshCw size={18} style={{ color: 'var(--janya-text-secondary)' }} />
              </button>
            </div>
          </div>
        </div> */}

        {/* Messages */}
        <div className="px-4 py-4 space-y-6 pb-40">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                style={message.role === 'user'
                  ? { background: 'var(--md-sys-color-primary)' }
                  : { background: 'linear-gradient(90deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}
              >
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>

              {/* Message */}
              <div className={`flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`p-3 rounded-2xl`}
                  style={message.role === 'user'
                    ? { background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', width: 'fit-content', marginLeft: 'auto' }
                    : { background: 'var(--md-sys-color-surface)', color: 'var(--janya-text-primary)', border: '1px solid var(--md-sys-color-outline-variant)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.streaming && message.content === 'thinking...' ? (
                      <span className="flex items-center gap-1">
                        <span>thinking</span>
                        <span className="flex gap-1">
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </span>
                    ) : (
                      <>
                        {message.content}
                        {message.streaming && (
                          <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse" />
                        )}
                      </>
                    )}
                  </p>
                </div>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-right' : ''}`}
                  style={{ color: 'var(--janya-text-secondary)' }}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-20 left-0 right-0 z-50">
          {/* Suggestions */}
          {messages.length <= 1 && !isSending && (
            <div className="space-y-3 mb-5">
              <p className="text-md text-center" style={{ color: 'var(--janya-text-secondary)' }}>Try asking me:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestionPrompts.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 rounded-full text-sm transition-colors shadow-sm"
                    style={{ background: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline-variant)', color: 'var(--janya-text-primary)' }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="max-w-4xl mx-auto px-4 py-2"
            style={{ background: 'var(--md-sys-color-surface)', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
            <div className="flex items-end gap-3 flex">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell me what's on your mind..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl resize-none focus:outline-none"
                  rows={1}
                  disabled={isSending}
                  style={{ minHeight: '48px', maxHeight: '120px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface)', color: 'var(--janya-text-primary)', boxShadow: 'none', overflow: 'hidden' }}
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  className="p-3 my-2 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex-shrink-0"
                  style={{ minHeight: '48px', maxHeight: '120px', background: 'linear-gradient(90deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))', color: 'white', border: 'none' }}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>

            {isSending && (
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--janya-text-secondary)' }}>
                Janya is thinking...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatPageComponent);