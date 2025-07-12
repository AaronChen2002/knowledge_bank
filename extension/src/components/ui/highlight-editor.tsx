import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Highlighter, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  MessageSquare,
  Palette
} from 'lucide-react';
import { Highlight, Note, HighlightColor } from '@/shared/types';
import { getHighlightColorClass, getHighlightColorHex, getHighlightColors } from '@/api/highlightService';

interface HighlightEditorProps {
  highlight: Highlight;
  note?: Note;
  onSave: (highlight: Highlight, note?: Note) => void;
  onDelete: (highlightId: string) => void;
  onCancel: () => void;
}

export const HighlightEditor: React.FC<HighlightEditorProps> = ({
  highlight,
  note,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHighlight, setEditedHighlight] = useState<Highlight>(highlight);
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = () => {
    const updatedHighlight = {
      ...editedHighlight,
      note: noteContent.trim() || undefined,
    };
    
    const updatedNote = noteContent.trim() ? {
      id: note?.id || `note-${Date.now()}`,
      entryId: highlight.entryId,
      highlightId: highlight.id,
      content: noteContent.trim(),
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: highlight.userId,
    } : undefined;

    onSave(updatedHighlight, updatedNote);
    setIsEditing(false);
  };

  const handleColorChange = (color: HighlightColor) => {
    setEditedHighlight(prev => ({ ...prev, color }));
    setShowColorPicker(false);
  };

  const handleDelete = () => {
    onDelete(highlight.id);
  };

  return (
    <Card className="shadow-sm border-l-4" style={{ borderLeftColor: getHighlightColorHex(highlight.color) }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Highlighter className="w-4 h-4 text-primary" />
            <span>Highlight</span>
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: getHighlightColorHex(highlight.color) + '20',
                color: getHighlightColorHex(highlight.color).replace('fe', '99'),
                borderColor: getHighlightColorHex(highlight.color) + '40'
              }}
            >
              {highlight.color}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {!isEditing && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-6 w-6 p-0 text-green-600"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCancel}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Highlighted Text */}
        <div className="p-3 rounded-md" style={{ backgroundColor: getHighlightColorHex(highlight.color) + '20' }}>
          <p className="text-sm font-medium">{highlight.text}</p>
        </div>

        {/* Color Picker (when editing) */}
        {isEditing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Color</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="h-6 px-2"
              >
                Change
              </Button>
            </div>
            {showColorPicker && (
              <div className="flex gap-2 p-2 bg-muted rounded-md">
                {getHighlightColors().map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      editedHighlight.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: getHighlightColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Note Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Note</span>
          </div>
          
          {isEditing ? (
            <Textarea
              placeholder="Add a note to this highlight..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
          ) : (
            noteContent ? (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{noteContent}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No note added</p>
            )
          )}
        </div>

        {/* Metadata */}
        <Separator />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {new Date(highlight.createdAt).toLocaleDateString()}</span>
          {highlight.updatedAt !== highlight.createdAt && (
            <span>Updated {new Date(highlight.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 