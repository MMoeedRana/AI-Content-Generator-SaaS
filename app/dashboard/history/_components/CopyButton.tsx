"use client";
import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';

interface CopyButtonProps {
  aiResponse: string;
}

function CopyButton({ aiResponse }: CopyButtonProps) {
  
  const handleCopy = () => {
    if (!aiResponse) {
      toast.error("Nothing to copy!");
      return;
    }
    const cleanText = aiResponse
      .replace(/[#*`~_]/g, '') 
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
      .trim();

    navigator.clipboard.writeText(cleanText)
      .then(() => {
        toast.success("Clean text copied!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
        });
      })
      .catch(() => {
        toast.error("Failed to copy!");
      });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-primary hover:bg-primary/10 flex gap-2 items-center font-medium transition-all"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
      Copy
    </Button>
  );
}

export default CopyButton