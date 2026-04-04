import { X, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface SqlSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sqlCode: string;
}

export function SqlSnippetModal({ isOpen, onClose, title, sqlCode }: SqlSnippetModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">Copy and paste this SQL into your Supabase SQL Editor to fix permissions.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="relative group">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy SQL'}
            </button>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{sqlCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
