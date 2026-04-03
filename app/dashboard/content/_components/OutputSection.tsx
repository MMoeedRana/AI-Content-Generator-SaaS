import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  aiOutput: string;
}

function OutputSection({ aiOutput }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutput || '').then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy!');
    });
  };

  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button className="flex gap-2" onClick={handleCopy}>
          <Copy className="w-4 h-4" /> Copy
        </Button>
      </div>
      <div className="p-5 prose max-w-none">
        <ReactMarkdown>{aiOutput || 'Your result will appear here'}</ReactMarkdown>
      </div>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </div>
  );
}

export default OutputSection;
