"use client";

import { Copy, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import showdown from "showdown"; // Conversion library
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from "next/navigation";

interface Props {
  aiOutput: string;
}

function OutputSection({ aiOutput }: Props) {
  const router = useRouter();

  const handleCopy = async () => {
    if (!aiOutput) return;

    // Markdown symbols remove for clean plain text copy
    const cleanText = aiOutput
      .replace(/[#*`~]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    try {
      await navigator.clipboard.writeText(cleanText);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const handleEditInDraft = () => {
    if (!aiOutput) return;

    // Initialize Converter
    const converter = new showdown.Converter();
    // Convert Markdown (###) to HTML (<h3>) for the Rich Text Editor
    const htmlContent = converter.makeHtml(aiOutput);

    localStorage.setItem("editor-content", htmlContent);
    router.push("/dashboard/editor");
  };

  return (
    <div className="bg-white dark:bg-slate-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-auto md:h-[80vh] min-h-[450px]">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
        <h2 className="font-semibold text-base md:text-lg text-gray-800 dark:text-gray-100">
          Your Result
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEditInDraft}
            disabled={!aiOutput}
            className="flex gap-2 text-xs border-primary text-primary hover:bg-primary/5"
          >
            <FileEdit className="w-4 h-4" /> Edit as Draft
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!aiOutput}
            className="flex items-center gap-2 text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 text-white transition-all active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Copy
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 prose max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 leading-relaxed scrollbar-thin">
        {aiOutput ? (
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-xl md:text-2xl font-bold mt-4 mb-2 border-b pb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg md:text-xl font-semibold mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base md:text-lg font-semibold mt-3 mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-3 text-sm md:text-base text-gray-700 dark:text-gray-300">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-4 md:ml-6 mb-3 text-sm md:text-base">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 md:ml-6 mb-3 text-sm md:text-base">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="rounded-lg overflow-hidden my-4 text-xs md:text-sm shadow-inner">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ maxWidth: "100%", overflowX: "auto", padding: "1.5rem" }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono text-pink-600 dark:text-pink-400">
                    {children}
                  </code>
                );
              },
            }}
          >
            {aiOutput}
          </ReactMarkdown>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-4">
              <Copy className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium">No Content Yet</h3>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
    </div>
  );
}

export default OutputSection