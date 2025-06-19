'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { toast } from 'sonner';
import { Send, User, Bot, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Doc {
  pageContent?: string;
  metdata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}
interface IMessage {
  role: 'assistant' | 'user';
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSources] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(userMessage)}`);

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.message,
          documents: data?.docs,
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const handleDownloadDocument = (doc: Doc) => {
    if (!doc.pageContent) {
      toast.error('No content available to download');
      return;
    }

    try {
      // Create a blob from the content
      const blob = new Blob([doc.pageContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `document${doc.metdata?.loc?.pageNumber ? `-page-${doc.metdata.loc.pageNumber}` : ''}.txt`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Document downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-h-full">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">No messages yet</p>
              <p className="text-sm">Upload a PDF and start a conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-4 shadow-sm ${msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground border border-border'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === 'user' ? (
                    <>
                      <div className="bg-primary-foreground text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">You</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary rounded-full p-1 h-6 w-6 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                      <span className="font-medium">Assistant</span>
                    </>
                  )}
                </div>
                <div className={`break-words leading-relaxed ${msg.role === 'user' ? 'text-primary-foreground' : 'markdown-content'}`}>
                  {msg.role === 'user' ? (
                    <div>{msg.content}</div>
                  ) : (
                    <ReactMarkdown>
                      {msg.content || ''}
                    </ReactMarkdown>
                  )}
                </div>

                {showSources && msg.documents && msg.documents.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-border">
                    <div className="text-xs font-medium mb-1.5">Sources:</div>
                    <div className="space-y-1.5">
                      {msg.documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="flex items-center justify-between gap-1.5 text-xs p-1.5 bg-muted rounded group cursor-pointer hover:bg-muted/80 transition-colors w-xl"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {doc.metdata?.source ? `${doc.metdata.source}` : 'Document'}
                              {doc.metdata?.loc?.pageNumber ? ` (Page ${doc.metdata.loc.pageNumber})` : ''}
                            </span>
                          </div>
                          <Download className="w-3 h-3 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground max-w-[85%] rounded-lg p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary rounded-full p-1 h-6 w-6 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-medium">Assistant</span>
              </div>
              <div className="flex items-center gap-2 p-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <div className="flex flex-col gap-2 mx-auto w-full">
          <div className="flex gap-2 w-full h-16 items-center rounded-lg">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="flex-1 h-full"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendChatMessage}
              disabled={!message.trim() || isLoading}
              className="gap-2 shrink-0 h-full"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatComponent;
