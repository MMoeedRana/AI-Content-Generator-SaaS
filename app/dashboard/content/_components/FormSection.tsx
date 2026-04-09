"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PROPS {
  selectedTemplate?: any;
  userFormInput: (data: any) => void;
  loading: boolean;
  defaultValues?: any; // New Prop
}

function FormSection({ selectedTemplate, userFormInput, loading, defaultValues }: PROPS) {
  const [formData, setFormData] = useState<any>({});

  // Jab history se data aaye toh form state update karein
  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userFormInput(formData);
  };

  return (
    <div className="p-4 md:p-6 shadow-md border rounded-lg bg-white dark:bg-slate-900 dark:border-gray-700 w-full transition-all">
      <Image src={selectedTemplate?.icon} alt="icon" width={60} height={60} />
      <h2 className="font-bold text-xl md:text-2xl mb-2 text-primary mt-2">
        {selectedTemplate?.name}
      </h2>
      <p className="text-gray-500 text-xs md:text-sm dark:text-gray-400">{selectedTemplate?.desc}</p>

      <form className="mt-6" onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((item: any, index: number) => (
          <div key={index} className="my-2 flex flex-col gap-2 mb-6">
            <label className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-200">
              {item.label}
            </label>
            {item.field === "input" ? (
              <Input
                name={item.name}
                required={item?.required}
                value={formData[item.name] || ""} // Controlled Input
                onChange={handleInputChange}
                className="dark:bg-slate-800 dark:text-gray-100"
              />
            ) : item.field === "textarea" ? (
              <Textarea
                name={item.name}
                required={item?.required}
                value={formData[item.name] || ""} // Controlled Input
                onChange={handleInputChange}
                className="dark:bg-slate-800 dark:text-gray-100 min-h-[120px]"
              />
            ) : null}
          </div>
        ))}
        <Button type="submit" className="w-full py-6" disabled={loading}>
          {loading && <Loader2Icon className="animate-spin mr-2" />}
          Generate Content
        </Button>
      </form>
    </div>
  );
}

export default FormSection