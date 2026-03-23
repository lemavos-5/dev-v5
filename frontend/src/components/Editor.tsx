import { useState, useMemo } from 'react';
import { Eye, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type EditorMode = 'edit' | 'preview';

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your note...', 
  minHeight = '400px' 
}: EditorProps) {
  const [mode, setMode] = useState<EditorMode>('edit');
  
  // Validate entity mentions - matches [[Entity Name]] format
  const validateMentions = (text: string): Set<string> => {
    const mentionRegex = /\[\[([^\]]+)\]\]/g;
    const mentions = new Set<string>();
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.add(match[1]);
    }
    return mentions;
  };

  const mentions = useMemo(() => validateMentions(value), [value]);

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-input bg-muted/30 px-3 py-2">
        <button
          onClick={() => setMode('edit')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-smooth ${
            mode === 'edit'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code className="h-4 w-4" strokeWidth={1.5} />
          Edit
        </button>
        <button
          onClick={() => setMode('preview')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-smooth ${
            mode === 'preview'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          Preview
        </button>
      </div>

      {/* Editor Mode */}
      {mode === 'edit' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full bg-background px-4 py-3 text-sm font-mono leading-relaxed outline-none resize-none text-foreground placeholder:text-muted-foreground"
        />
      )}

      {/* Preview Mode */}
      {mode === 'preview' && (
        <div
          style={{ minHeight }}
          className="w-full overflow-auto px-4 py-3 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
        >
          {!value.trim() ? (
            <div className="text-muted-foreground italic">Nothing to preview</div>
          ) : (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-3">{children}</p>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {children}
                  </a>
                ),
                code: ({ inline, children }) => 
                  inline ? (
                    <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
                  ) : (
                    <code className="block bg-muted p-3 rounded text-sm font-mono text-foreground overflow-auto mb-3">
                      {children}
                    </code>
                  ),
                pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-auto mb-3">{children}</pre>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
              }}
            >
              {value}
            </ReactMarkdown>
          )}
        </div>
      )}

      {/* Mentions indicator */}
      {mentions.size > 0 && (
        <div className="border-t border-input px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
          Mentions: {Array.from(mentions).map(m => `[[${m}]]`).join(', ')}
        </div>
      )}
    </div>
  );
}

export default MarkdownEditor;
