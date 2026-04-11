"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function FormSection({
  selectedTemplate,
  userFormInput,
  loading,
  defaultValues,
  isPremium,
  planLoading,
  usageCount,
}: any) {
  const [formData, setFormData] = useState<any>({});

  const isLocked =
    !isPremium &&
    !planLoading &&
    (selectedTemplate?.slug === "resume-builder" ||
      selectedTemplate?.slug === "explain-code");
  const isLimitReached =
    !isPremium &&
    !planLoading &&
    selectedTemplate?.slug === "write-code" &&
    usageCount >= 5;

  useEffect(() => {
    if (defaultValues) setFormData(defaultValues);
  }, [defaultValues]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4 md:p-6 shadow-md border rounded-lg bg-white dark:bg-slate-900 dark:border-gray-700 w-full h-fit">
      {/* Icon size slightly reduced for better initial visibility */}
      <Image src={selectedTemplate?.icon} alt="icon" width={50} height={50} />
      
      <h2 className="font-bold text-xl md:text-2xl mb-1 text-primary mt-2">
        {selectedTemplate?.name}
      </h2>
      
      {/* line-clamp prevents description from taking too much space */}
      <p className="text-gray-500 text-xs md:text-sm line-clamp-2">
        {selectedTemplate?.desc}
      </p>

      {/* Credit usage div with fixed height to prevent layout shift */}
      <div className="h-6 mt-2">
        {selectedTemplate?.slug === "write-code" && (
          <>
            {planLoading ? (
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-full" />
            ) : !isPremium ? (
              <p className="text-orange-500 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                Free Uses Left: {Math.max(0, 5 - usageCount)}/5
              </p>
            ) : null}
          </>
        )}
      </div>

      <form
        className="mt-4" // Reduced from mt-6
        onSubmit={(e) => {
          e.preventDefault();
          userFormInput(formData);
        }}
      >
        {selectedTemplate?.form?.map((item: any, index: number) => (
          <div key={index} className="my-2 flex flex-col gap-1.5 mb-4 md:mb-6">
            <label className="text-sm font-bold">{item.label}</label>
            {item.field === "input" ? (
              <Input
                name={item.name}
                required={item?.required}
                value={formData[item.name] || ""}
                onChange={handleInputChange}
                className="dark:bg-slate-800"
              />
            ) : (
              <Textarea
                name={item.name}
                required={item?.required}
                value={formData[item.name] || ""}
                onChange={handleInputChange}
                className="min-h-[100px] md:min-h-[120px] dark:bg-slate-800"
              />
            )}
          </div>
        ))}

        <Button
          type="submit"
          className="w-full py-6 flex gap-2 font-bold text-md"
          disabled={loading || planLoading || isLocked || isLimitReached}
        >
          {loading || planLoading ? (
            <Loader2Icon className="animate-spin h-5 w-5" />
          ) : isLocked || isLimitReached ? (
            <Lock className="w-4 h-4" />
          ) : null}

          {planLoading
            ? "Verifying Membership..."
            : isLocked || isLimitReached
              ? "Unlock with Pro"
              : "Generate Content"}
        </Button>
      </form>
    </div>
  );
}

export default FormSection