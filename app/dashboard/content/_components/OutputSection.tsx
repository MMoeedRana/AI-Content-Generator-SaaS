"use client";

import React from "react";
import showdown from "showdown";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, FileEdit, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";

function OutputSection({ aiOutput, isPremium }: { aiOutput: string; isPremium: boolean }) {
  const router = useRouter();

  const handleEditInDraft = () => {
    if (!aiOutput) return;
    if (!isPremium) {
      toast.error("Editor is for PRO users only!");
      router.push('/dashboard/billing');
      return;
    }
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(aiOutput);
    localStorage.setItem("editor-content", htmlContent);
    router.push("/dashboard/editor");
  };

  return (
    <div className="bg-white dark:bg-slate-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col h-auto md:h-[80vh] min-h-[450px]">
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 dark:bg-slate-800">
        <h2 className="font-semibold">Your Result</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditInDraft} disabled={!aiOutput} className="flex gap-2 text-xs">
            {isPremium ? <FileEdit className="w-4 h-4" /> : <Lock className="w-3 h-3 text-orange-500" />}
            Edit in Draft
          </Button>
          <Button onClick={() => { navigator.clipboard.writeText(aiOutput); toast.success("Copied!"); }} disabled={!aiOutput} className="flex gap-2 text-xs">
            <Copy className="w-4 h-4" /> Copy
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 prose dark:prose-invert max-w-none">
        <ReactMarkdown components={{
          code({ inline, className, children }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">{String(children)}</SyntaxHighlighter>
            ) : <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{children}</code>
          }
        }}>{aiOutput}</ReactMarkdown>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default OutputSection