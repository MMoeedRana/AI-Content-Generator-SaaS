"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
// @ts-ignore
import "react-quill-new/dist/quill.snow.css";
import jsPDF from "jspdf";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-[450px] w-full bg-slate-100 animate-pulse rounded-xl" />
});

// Full Professional Font List
const fontOptions = [
  'arial', 
  'roboto', 
  'mirza', 
  'times-new-roman', 
  'courier', 
  'georgia', 
  'comic-sans',
  'serif', 
  'monospace'
];

function Editor() {
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedContent = localStorage.getItem("editor-content");
    if (savedContent) setContent(savedContent);
    
    if (typeof window !== 'undefined') {
        const Quill = require('react-quill-new').Quill;
        const Font = Quill.import('formats/font');
        Font.whitelist = fontOptions;
        Quill.register(Font, true);
    }
  }, []);

  const downloadPDF = async () => {
    const element = document.querySelector('.ql-editor') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save("professional-document.pdf");
  };

  const modules = {
    toolbar: [
      [{ 'font': fontOptions }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="p-5 md:p-10 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-8">
        
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b pb-6 dark:border-gray-800">
          <Button variant="ghost" onClick={() => router.back()} className="dark:text-gray-300 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <div className="flex gap-3">
            <Button onClick={downloadPDF} variant="outline" className="border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20">
              <FileText className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Button className="bg-primary hover:opacity-90 shadow-md text-white">
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="bg-white dark:bg-slate-900 min-h-[600px] rounded-b-xl overflow-hidden">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            className="editor-canvas"
          />
        </div>
      </div>

      <style jsx global>{`
        /* Fonts Import */
        @import url('https://fonts.googleapis.com/css2?family=Mirza&family=Roboto&display=swap');

        /* Dynamic Font Labels in Toolbar */
        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before { content: 'Arial' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="mirza"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="mirza"]::before { content: 'Mirza' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: 'Times New Roman' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier"]::before { content: 'Courier' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: 'Georgia' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="comic-sans"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="comic-sans"]::before { content: 'Comic Sans' !important; }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before { content: 'Serif' !important; }
        
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before { content: 'Monospace' !important; }

        /* Font Family Mappings */
        .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .ql-font-roboto { font-family: 'Roboto', sans-serif; }
        .ql-font-mirza { font-family: 'Mirza', serif; }
        .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif; }
        .ql-font-courier { font-family: 'Courier New', Courier, monospace; }
        .ql-font-georgia { font-family: Georgia, serif; }
        .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive; }

        /* Dark Mode Compatibility Fixes */
        .dark .ql-toolbar.ql-snow {
          background: #1e293b !important;
          border-color: #334155 !important;
        }
        .dark .ql-toolbar .ql-stroke { stroke: #cbd5e1 !important; }
        .dark .ql-toolbar .ql-fill { fill: #cbd5e1 !important; }
        .dark .ql-toolbar .ql-picker { color: #cbd5e1 !important; }
        .dark .ql-toolbar .ql-picker-options {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: #cbd5e1 !important;
        }

        .dark .ql-container.ql-snow {
          border-color: #334155 !important;
          background-color: #0f172a !important;
        }
        .dark .ql-editor {
          color: #f1f5f9 !important;
        }

        /* Editor General UI */
        .ql-toolbar.ql-snow {
          border-radius: 12px 12px 0 0 !important;
          background: #f8fafc !important;
          padding: 12px !important;
          border-color: #e2e8f0 !important;
        }
        .ql-container.ql-snow {
          border-radius: 0 0 12px 12px !important;
          min-height: 550px;
          border-color: #e2e8f0 !important;
        }
        .ql-editor { padding: 40px !important; font-size: 16px; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default Editor