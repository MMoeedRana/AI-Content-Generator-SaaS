"use client";

import React, { useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { AIOutput } from "@/utils/schema";
import { aiClient, AI_MODEL_NAME } from "@/utils/AiModal";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { toast } from "sonner";
import Loading from "../_components/Loading";
import { eq } from "drizzle-orm";

interface PROPS {
  params: Promise<{ "template-slug": string }>;
}

function CreateNewContent(props: PROPS) {
  const params = React.use(props.params);
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const selectedTemplate = Templates?.find((item) => item.slug === params["template-slug"]);

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>(""); // Expects string
  const [historyFormData, setHistoryFormData] = useState<any>(null);

  const { user } = useUser();
  const { setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const [maxWords, setMaxWords] = useState(10000);

  useEffect(() => {
    if (editId && user) {
      GetHistoryRecord();
    }
  }, [editId, user]);

  const GetHistoryRecord = async () => {
    if (!editId) return;
    
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.id, Number(editId)));

      if (result && result.length > 0) {
        // FIXED: Null check added using nullish coalescing (??)
        // Agar result[0].aiResponse null hoga toh "" (empty string) set hogi
        setAiOutput(result[0].aiResponse ?? ""); 
        
        if (result[0].formData) {
          setHistoryFormData(JSON.parse(result[0].formData));
        }
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history data");
    } finally {
      setLoading(false);
    }
  };

  const GenerateAIContent = async (formData: any) => {
    if (totalUsage >= maxWords) {
      toast.error("Credit limit exceeded!");
      return;
    }

    setLoading(true);
    try {
      const FinalPrompt = `User Input: ${JSON.stringify(formData)}\nTask: ${selectedTemplate?.aiPrompt}`;
      const result = await aiClient.models.generateContent({
        model: AI_MODEL_NAME,
        contents: [{ role: "user", parts: [{ text: FinalPrompt }] }],
      });

      const aiResponse = result?.text ?? "";
      if (aiResponse) {
        setAiOutput(aiResponse);
        await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, aiResponse);
        toast.success("Content generated!");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI Error occurred.");
    } finally {
      setLoading(false);
      setUpdateCreditUsage(Date.now());
    }
  };

  const SaveInDb = async (formData: string, slug: string | undefined, aiResp: string) => {
    if (!slug || !user?.primaryEmailAddress?.emailAddress) return;
    const wordCount = aiResp.trim().split(/\s+/).length;
    
    try {
      await db.insert(AIOutput).values({
        formData,
        templateSlug: slug,
        aiResponse: aiResp,
        wordCount,
        createdBy: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD/MM/YYYY"),
      });
    } catch (error) {
      console.error("DB Save Error:", error);
    }
  };

  return (
    <div className="p-5 md:p-10 dark:bg-slate-900 min-h-screen">
      <Loading loading={loading} />
      <div className="max-w-7xl mx-auto">
        <Link href={"/dashboard"}>
          <Button className="flex gap-2 mb-6 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FormSection
            selectedTemplate={selectedTemplate}
            userFormInput={GenerateAIContent}
            loading={loading}
            defaultValues={historyFormData}
          />
          <div className="md:col-span-2">
            <OutputSection aiOutput={aiOutput} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent