import { KnowledgeEntry } from '@/shared/types';

/**
 * Mock Chat Service for Intelligent Knowledge Assistant
 * 
 * Simulates an AI assistant that can answer questions about the user's knowledge vault.
 * Will be replaced with real AI integration when backend is ready.
 */

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];
    confidence?: number;
    query?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    recentEntries?: KnowledgeEntry[];
    searchHistory?: string[];
  };
}

export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
  suggestions?: string[];
  sources?: {
    entryId: string;
    title: string;
    relevance: number;
    excerpt: string;
  }[];
}

// Mock conversation templates
const CONVERSATION_TEMPLATES = [
  {
    title: "What have I been researching lately?",
    message: "What have I been researching lately?",
    tags: ['research', 'overview']
  },
  {
    title: "Find information about React",
    message: "Find information about React in my knowledge vault",
    tags: ['search', 'technology']
  },
  {
    title: "Summarize my recent saves",
    message: "Can you summarize what I've been saving recently?",
    tags: ['summary', 'overview']
  },
  {
    title: "Find tutorials I've saved",
    message: "Show me all the tutorials I've saved",
    tags: ['filter', 'tutorials']
  },
  {
    title: "What's important from this week?",
    message: "What important information did I save this week?",
    tags: ['important', 'recent']
  }
];

// Mock AI responses based on query patterns
const MOCK_RESPONSES: Record<string, string[]> = {
  'react': [
    "I found several entries about React in your knowledge vault. You have 3 articles about React components, 2 tutorials on hooks, and 1 guide about state management. The most recent one is about React 18 features.",
    "Based on your saved content, you've been learning about React hooks, component patterns, and performance optimization. Would you like me to show you the specific articles?",
    "You have React-related content spanning from basic concepts to advanced patterns. I can help you find specific information about any React topic you're interested in."
  ],
  'tutorial': [
    "I found 5 tutorials in your vault. You have tutorials on React hooks, Python data analysis, machine learning basics, and web development. The most recent tutorial is about building a Chrome extension.",
    "Your tutorial collection covers frontend development, data science, and programming fundamentals. Would you like me to show you tutorials on a specific topic?",
    "I can see you've been following a structured learning path. Your tutorials progress from basic concepts to more advanced implementations."
  ],
  'research': [
    "Based on your recent saves, you've been researching AI and machine learning topics. You have 8 articles about neural networks, 3 papers on natural language processing, and 2 guides on data preprocessing.",
    "Your research focus seems to be on artificial intelligence and its applications. I can help you find specific research papers or articles on any AI topic.",
    "You've been building a comprehensive knowledge base around AI research. Would you like me to create a summary of your key findings?"
  ],
  'important': [
    "I've identified 4 entries you've marked as important. These include a React performance guide, an AI research paper, a Python best practices article, and a web development tutorial.",
    "Your important items seem to focus on practical development skills and cutting-edge technology. Would you like me to show you the details of any of these?",
    "Based on your important saves, you're prioritizing performance optimization and AI knowledge. This suggests you're working on advanced projects."
  ],
  'summary': [
    "Here's a summary of your recent activity: You've saved 12 items this week, with a focus on React development (40%), AI research (35%), and web development (25%). Your most active day was Tuesday with 4 saves.",
    "Your knowledge vault shows a clear progression from basic web development to advanced AI concepts. You're building a solid foundation for full-stack development with AI integration.",
    "Recent trends in your saves indicate you're preparing for a project that combines React frontend development with AI backend capabilities."
  ]
};

/**
 * Generate a mock AI response based on the user's message
 */
function generateMockResponse(message: string, context?: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific topics
  for (const [topic, responses] of Object.entries(MOCK_RESPONSES)) {
    if (lowerMessage.includes(topic)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default responses
  const defaultResponses = [
    "I found some relevant information in your knowledge vault. Let me search through your saved content to give you a more specific answer.",
    "Based on your saved knowledge, I can help you with that. Would you like me to show you the most relevant entries?",
    "I've analyzed your knowledge base and found several items that might be helpful. Let me organize that information for you.",
    "That's an interesting question! I can see you have some related content in your vault. Would you like me to explore that further?",
    "I found some relevant information in your saved content. Let me provide you with a summary of what I discovered."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

/**
 * Send a message to the AI assistant
 */
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responseContent = generateMockResponse(request.message, request.context);
  
  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'assistant',
    content: responseContent,
    timestamp: new Date().toISOString(),
    metadata: {
      confidence: 0.85 + Math.random() * 0.1,
      query: request.message,
    }
  };
  
  return {
    message: assistantMessage,
    conversationId: request.conversationId || `conv-${Date.now()}`,
    suggestions: [
      "Show me more details",
      "Find related content",
      "Summarize this topic",
      "What else should I know?"
    ],
    sources: [
      {
        entryId: 'entry-1',
        title: 'React Performance Optimization',
        relevance: 0.92,
        excerpt: 'Advanced techniques for optimizing React applications...'
      },
      {
        entryId: 'entry-2',
        title: 'AI and Machine Learning Basics',
        relevance: 0.87,
        excerpt: 'Introduction to artificial intelligence concepts...'
      }
    ]
  };
}

/**
 * Get conversation templates
 */
export async function getConversationTemplates(): Promise<typeof CONVERSATION_TEMPLATES> {
  return CONVERSATION_TEMPLATES;
}

/**
 * Get recent conversations
 */
export async function getRecentConversations(): Promise<Conversation[]> {
  const stored = localStorage.getItem('knowledge_bank_conversations');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return mock conversations
  return [
    {
      id: 'conv-1',
      title: 'React Development Questions',
      messages: [
        {
          id: 'msg-1',
          type: 'user' as const,
          content: 'What React topics have I been studying?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'msg-2',
          type: 'assistant' as const,
          content: 'Based on your knowledge vault, you\'ve been focusing on React hooks, component patterns, and performance optimization. You have 3 recent articles about these topics.',
          timestamp: new Date(Date.now() - 86400000 + 5000).toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 + 5000).toISOString(),
      tags: ['react', 'development']
    }
  ];
}

/**
 * Save a conversation
 */
export async function saveConversation(conversation: Conversation): Promise<void> {
  const conversations = await getRecentConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);
  
  if (index !== -1) {
    conversations[index] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  // Keep only last 10 conversations
  const recentConversations = conversations.slice(-10);
  localStorage.setItem('knowledge_bank_conversations', JSON.stringify(recentConversations));
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const conversations = await getRecentConversations();
  const filtered = conversations.filter(c => c.id !== conversationId);
  localStorage.setItem('knowledge_bank_conversations', JSON.stringify(filtered));
}

/**
 * Export conversation as markdown
 */
export function exportConversation(conversation: Conversation): string {
  let markdown = `# ${conversation.title}\n\n`;
  markdown += `**Date:** ${new Date(conversation.createdAt).toLocaleDateString()}\n\n`;
  
  conversation.messages.forEach(message => {
    const prefix = message.type === 'user' ? '**You:**' : '**Assistant:**';
    markdown += `${prefix} ${message.content}\n\n`;
  });
  
  return markdown;
} 