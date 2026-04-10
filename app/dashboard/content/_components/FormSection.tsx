"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Loader2Icon, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function FormSection({ selectedTemplate, userFormInput, loading, defaultValues, isPremium, usageCount }: any) {
  const [formData, setFormData] = useState<any>({});
  
  const isLocked = !isPremium && (selectedTemplate?.slug === 'resume-builder' || selectedTemplate?.slug === 'explain-code');
  const isLimitReached = !isPremium && selectedTemplate?.slug === 'write-code' && usageCount >= 5;

  useEffect(() => {
    if (defaultValues) setFormData(defaultValues);
  }, [defaultValues]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4 md:p-6 shadow-md border rounded-lg bg-white dark:bg-slate-900 dark:border-gray-700 w-full">
      <Image src={selectedTemplate?.icon} alt="icon" width={60} height={60} />
      <h2 className="font-bold text-xl md:text-2xl mb-2 text-primary mt-2">
        {selectedTemplate?.name}
      </h2>
      <p className="text-gray-500 text-xs md:text-sm">{selectedTemplate?.desc}</p>
      
      {!isPremium && selectedTemplate?.slug === 'write-code' && (
        <p className="text-orange-500 text-xs mt-2 font-semibold">Free Uses Left: {5 - usageCount}/5</p>
      )}

      <form className="mt-6" onSubmit={(e) => { e.preventDefault(); userFormInput(formData); }}>
        {selectedTemplate?.form?.map((item: any, index: number) => (
          <div key={index} className="my-2 flex flex-col gap-2 mb-6">
            <label className="text-sm font-bold">{item.label}</label>
            {item.field === "input" ? (
              <Input name={item.name} required={item?.required} value={formData[item.name] || ""} onChange={handleInputChange} />
            ) : (
              <Textarea name={item.name} required={item?.required} value={formData[item.name] || ""} onChange={handleInputChange} className="min-h-[120px]" />
            )}
          </div>
        ))}
        <Button 
          type="submit" 
          className="w-full py-6 flex gap-2" 
          disabled={loading || isLocked || isLimitReached}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : (isLocked || isLimitReached) ? <Lock className="w-4 h-4" /> : null}
          {isLocked || isLimitReached ? "Unlock with Pro" : "Generate Content"}
        </Button>
      </form>
    </div>
  );
}

export default FormSection