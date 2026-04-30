import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Bot,
  Send,
  Sparkles,
  Heart,
  Target,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  Smile,
  ThumbsUp
} from 'lucide-react';

interface PostureCoachProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    level: number;
    points: number;
    streak: number;
    postureScore: number;
  };
}

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function PostureCoach({ isOpen, onClose, user }: PostureCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: `Hi ${user.name}! I'm your AI posture coach. I noticed you've been doing great with your ${user.streak}-day streak! 🎉 How are you feeling today?`,
      timestamp: new Date(),
      suggestions: ['I feel great!', 'A bit tired', 'Having back pain', 'Need motivation']
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');

  const coachResponses = {
    'I feel great!': {
      content: "That's wonderful! Your positive energy shows in your posture score of 85%. Let's keep this momentum going! Would you like some tips to reach 90% today?",
      suggestions: ['Yes, give me tips!', 'How can I improve?', 'What exercises help?']
    },
    'A bit tired': {
      content: "I understand. When we're tired, our posture tends to suffer. Try the 'Wall Angel' exercise for 2 minutes - it's great for re-energizing your shoulders and spine!",
      suggestions: ['Show me the exercise', 'Other quick fixes?', 'Thanks for the tip!']
    },
    'Having back pain': {
      content: "I'm sorry to hear that. Back pain often indicates we need to strengthen our core and improve our sitting posture. Let's start with some gentle stretches. Would you like me to guide you?",
      suggestions: ['Yes, guide me', 'What causes this?', 'Prevention tips?']
    },
    'Need motivation': {
      content: "You've got this! Remember, you're already a Level 12 Posture Master with 2,840 points. Every small adjustment you make is building stronger habits. Your future self will thank you! 💪",
      suggestions: ['Set a new goal', 'Track my progress', 'Challenge a friend']
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = coachResponses[content as keyof typeof coachResponses] || {
        content: "I appreciate you sharing that with me! Based on your current progress, I'd recommend focusing on maintaining your excellent streak. Small, consistent improvements lead to big results!",
        suggestions: ['Tell me more', 'What should I focus on?', 'Set a reminder']
      };

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, coachMessage]);
    }, 1000);

    setInputMessage('');
  };

  const quickTips = [
    { icon: Target, title: "Perfect Posture", tip: "Imagine a string pulling you up from the crown of your head" },
    { icon: Clock, title: "20-20-20 Rule", tip: "Every 20 minutes, look at something 20 feet away for 20 seconds" },
    { icon: Heart, title: "Deep Breathing", tip: "Take 3 deep breaths to naturally straighten your spine" },
    { icon: TrendingUp, title: "Gradual Progress", tip: "Small improvements daily lead to lasting changes" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span>SitBax AI Coach</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'coach' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1 px-2 mr-1"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Tips */}
          <div className="p-4 border-t bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Quick Tips
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="p-2 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">{tip.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tip.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about posture..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              />
              <Button 
                size="sm" 
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}