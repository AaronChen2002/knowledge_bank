import { 
  Highlight, 
  Note, 
  CreateHighlightRequest, 
  UpdateHighlightRequest, 
  CreateNoteRequest, 
  UpdateNoteRequest,
  SearchHighlightsRequest,
  SearchHighlightsResponse,
  HighlightColor 
} from '@/shared/types';

/**
 * Mock Highlight & Note Service
 * 
 * Provides local storage for highlights and notes until backend is ready.
 * Will be replaced with real API calls when backend is implemented.
 */

const STORAGE_KEYS = {
  HIGHLIGHTS: 'knowledge_bank_highlights',
  NOTES: 'knowledge_bank_notes',
};

// Mock data for testing
const MOCK_HIGHLIGHTS: Highlight[] = [
  {
    id: '1',
    entryId: 'entry-1',
    text: 'React is a powerful JavaScript library',
    startOffset: 0,
    endOffset: 35,
    color: 'yellow',
    note: 'Important framework to learn',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
  },
  {
    id: '2',
    entryId: 'entry-1',
    text: 'building user interfaces',
    startOffset: 45,
    endOffset: 70,
    color: 'green',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
  },
];

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    entryId: 'entry-1',
    highlightId: '1',
    content: 'This is a key concept for frontend development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
  },
];

/**
 * Get all highlights from storage
 */
async function getHighlights(): Promise<Highlight[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Return mock data for first time
    return MOCK_HIGHLIGHTS;
  } catch (error) {
    console.error('Failed to get highlights:', error);
    return [];
  }
}

/**
 * Get all notes from storage
 */
async function getNotes(): Promise<Note[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (stored) {
      return JSON.parse(stored);
    }
    // Return mock data for first time
    return MOCK_NOTES;
  } catch (error) {
    console.error('Failed to get notes:', error);
    return [];
  }
}

/**
 * Save highlights to storage
 */
async function saveHighlights(highlights: Highlight[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  } catch (error) {
    console.error('Failed to save highlights:', error);
  }
}

/**
 * Save notes to storage
 */
async function saveNotes(notes: Note[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
}

/**
 * Create a new highlight
 */
export async function createHighlight(request: CreateHighlightRequest): Promise<Highlight> {
  const highlights = await getHighlights();
  
  const newHighlight: Highlight = {
    id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entryId: request.entryId,
    text: request.text,
    startOffset: request.startOffset,
    endOffset: request.endOffset,
    color: request.color || 'yellow',
    note: request.note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1', // Mock user ID
  };
  
  highlights.push(newHighlight);
  await saveHighlights(highlights);
  
  return newHighlight;
}

/**
 * Update an existing highlight
 */
export async function updateHighlight(request: UpdateHighlightRequest): Promise<Highlight> {
  const highlights = await getHighlights();
  const index = highlights.findIndex(h => h.id === request.id);
  
  if (index === -1) {
    throw new Error('Highlight not found');
  }
  
  const updatedHighlight: Highlight = {
    ...highlights[index],
    ...request,
    updatedAt: new Date().toISOString(),
  };
  
  highlights[index] = updatedHighlight;
  await saveHighlights(highlights);
  
  return updatedHighlight;
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(highlightId: string): Promise<void> {
  const highlights = await getHighlights();
  const filtered = highlights.filter(h => h.id !== highlightId);
  await saveHighlights(filtered);
  
  // Also delete associated notes
  const notes = await getNotes();
  const filteredNotes = notes.filter(n => n.highlightId !== highlightId);
  await saveNotes(filteredNotes);
}

/**
 * Get highlights for a specific entry
 */
export async function getHighlightsForEntry(entryId: string): Promise<Highlight[]> {
  const highlights = await getHighlights();
  return highlights.filter(h => h.entryId === entryId);
}

/**
 * Create a new note
 */
export async function createNote(request: CreateNoteRequest): Promise<Note> {
  const notes = await getNotes();
  
  const newNote: Note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entryId: request.entryId,
    highlightId: request.highlightId,
    content: request.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1', // Mock user ID
  };
  
  notes.push(newNote);
  await saveNotes(notes);
  
  return newNote;
}

/**
 * Update an existing note
 */
export async function updateNote(request: UpdateNoteRequest): Promise<Note> {
  const notes = await getNotes();
  const index = notes.findIndex(n => n.id === request.id);
  
  if (index === -1) {
    throw new Error('Note not found');
  }
  
  const updatedNote: Note = {
    ...notes[index],
    content: request.content,
    updatedAt: new Date().toISOString(),
  };
  
  notes[index] = updatedNote;
  await saveNotes(notes);
  
  return updatedNote;
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  const notes = await getNotes();
  const filtered = notes.filter(n => n.id !== noteId);
  await saveNotes(filtered);
}

/**
 * Get notes for a specific entry
 */
export async function getNotesForEntry(entryId: string): Promise<Note[]> {
  const notes = await getNotes();
  return notes.filter(n => n.entryId === entryId);
}

/**
 * Get notes for a specific highlight
 */
export async function getNotesForHighlight(highlightId: string): Promise<Note[]> {
  const notes = await getNotes();
  return notes.filter(n => n.highlightId === highlightId);
}

/**
 * Search highlights and notes
 */
export async function searchHighlights(request: SearchHighlightsRequest): Promise<SearchHighlightsResponse> {
  const highlights = await getHighlights();
  const notes = await getNotes();
  
  let filteredHighlights = highlights;
  let filteredNotes = notes;
  
  // Filter by entry ID
  if (request.entryId) {
    filteredHighlights = filteredHighlights.filter(h => h.entryId === request.entryId);
    filteredNotes = filteredNotes.filter(n => n.entryId === request.entryId);
  }
  
  // Filter by color
  if (request.filters?.color?.length) {
    filteredHighlights = filteredHighlights.filter(h => 
      request.filters!.color!.includes(h.color)
    );
  }
  
  // Filter by has notes
  if (request.filters?.hasNotes) {
    const highlightIdsWithNotes = new Set(notes.map(n => n.highlightId).filter(Boolean));
    filteredHighlights = filteredHighlights.filter(h => highlightIdsWithNotes.has(h.id));
  }
  
  // Search by query
  if (request.query) {
    const query = request.query.toLowerCase();
    filteredHighlights = filteredHighlights.filter(h => 
      h.text.toLowerCase().includes(query) || 
      (h.note && h.note.toLowerCase().includes(query))
    );
    filteredNotes = filteredNotes.filter(n => 
      n.content.toLowerCase().includes(query)
    );
  }
  
  // Apply pagination
  const page = request.pagination?.page || 1;
  const limit = request.pagination?.limit || 20;
  const start = (page - 1) * limit;
  
  const paginatedHighlights = filteredHighlights.slice(start, start + limit);
  const paginatedNotes = filteredNotes.slice(start, start + limit);
  
  return {
    success: true,
    highlights: paginatedHighlights,
    notes: paginatedNotes,
    pagination: {
      page,
      limit,
      total: filteredHighlights.length + filteredNotes.length,
      totalPages: Math.ceil((filteredHighlights.length + filteredNotes.length) / limit),
      hasNext: start + limit < filteredHighlights.length + filteredNotes.length,
      hasPrevious: page > 1,
    },
  };
}

/**
 * Get highlight color options
 */
export function getHighlightColors(): HighlightColor[] {
  return ['yellow', 'green', 'blue', 'pink', 'purple', 'orange'];
}

/**
 * Get highlight color CSS class
 */
export function getHighlightColorClass(color: HighlightColor): string {
  const colorMap: Record<HighlightColor, string> = {
    yellow: 'bg-yellow-200 text-yellow-800',
    green: 'bg-green-200 text-green-800',
    blue: 'bg-blue-200 text-blue-800',
    pink: 'bg-pink-200 text-pink-800',
    purple: 'bg-purple-200 text-purple-800',
    orange: 'bg-orange-200 text-orange-800',
  };
  return colorMap[color];
}

/**
 * Get highlight color hex value
 */
export function getHighlightColorHex(color: HighlightColor): string {
  const colorMap: Record<HighlightColor, string> = {
    yellow: '#fef3c7',
    green: '#d1fae5',
    blue: '#dbeafe',
    pink: '#fce7f3',
    purple: '#e9d5ff',
    orange: '#fed7aa',
  };
  return colorMap[color];
} 