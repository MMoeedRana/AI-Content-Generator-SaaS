"use client";

import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { eq, and } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { AIOutput } from "@/utils/schema";
import Loading from "../_components/Loading";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { aiClient, AI_MODEL_NAME } from "@/utils/AiModal";
import { useSearchParams, useRouter } from "next/navigation";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import React, { useContext, useState, useEffect, Suspense } from "react";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

interface PROPS {
  params: Promise<{ "template-slug": string }>;
}

function CreateNewContent(props: PROPS) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Editor...</div>}>
      <CreateContentLogic {...props} />
    </Suspense>
  );
}

function CreateContentLogic(props: PROPS) {
  const params = React.use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const selectedTemplate = Templates?.find((item) => item.slug === params["template-slug"]);

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [isPremium, setIsPremium] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [writeCodeUsage, setWriteCodeUsage] = useState(0);
  const [historyFormData, setHistoryFormData] = useState<any>(null);

  const { user } = useUser();
  const { setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);
  const { totalUsage } = useContext(TotalUsageContext);

  useEffect(() => {
    if (user) {
      checkUserStatus();
      getTemplateSpecificUsage();
      if (editId) GetHistoryRecord();
    }
  }, [user, editId, selectedTemplate]);

  const checkUserStatus = async () => {
    setPlanLoading(true);
    try {
      const resp = await axios.get("/api/credits-usage", {
        params: { email: user?.primaryEmailAddress?.emailAddress },
      });
      if (resp.data?.plan === "paid") setIsPremium(true);
    } catch (e) {
      console.error("Error checking status:", e);
    } finally {
      setPlanLoading(false);
    }
  };

  const getTemplateSpecificUsage = async () => {
    if (selectedTemplate?.slug === 'write-code' && user) {
      const result = await db.select().from(AIOutput)
        .where(and(
          eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress!),
          eq(AIOutput.templateSlug, 'write-code')
        ));
      setWriteCodeUsage(result.length);
    }
  };

  const GetHistoryRecord = async () => {
    setLoading(true);
    try {
      const result = await db.select().from(AIOutput).where(eq(AIOutput.id, Number(editId)));
      if (result?.[0]) {
        setAiOutput(result[0].aiResponse ?? "");
        setHistoryFormData(JSON.parse(result[0].formData));
      }
    } finally { setLoading(false); }
  };

  const GenerateAIContent = async (formData: any) => {
    if (!isPremium && (selectedTemplate?.slug === 'resume-builder' || selectedTemplate?.slug === 'explain-code')) {
      toast.error("Premium tool! Please upgrade to unlock.");
      router.push('/dashboard/billing');
      return;
    }

    if (!isPremium && selectedTemplate?.slug === 'write-code' && writeCodeUsage >= 5) {
      toast.error("Free limit for Write Code reached! Upgrade for unlimited.");
      router.push('/dashboard/billing');
      return;
    }

    if (totalUsage >= 10000 && !isPremium) {
      toast.error("Overall credit limit reached. Please upgrade!");
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
      setAiOutput(aiResponse);
      await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, aiResponse);
      toast.success("Generated successfully!");
    } catch (error) {
      toast.error("AI Generation failed.");
    } finally {
      setLoading(false);
      setUpdateCreditUsage(Date.now());
      getTemplateSpecificUsage(); 
    }
  };

  const SaveInDb = async (formData: string, slug: string | undefined, aiResp: string) => {
    if (!slug || !user?.primaryEmailAddress?.emailAddress) return;
    const wordCount = aiResp.trim().split(/\s+/).length;
    await db.insert(AIOutput).values({
      formData,
      templateSlug: slug,
      aiResponse: aiResp,
      wordCount,
      createdBy: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD/MM/YYYY"),
    });
  };

  return (
    // Fixed padding to ensure content starts from top
    <div className="p-4 md:p-10 dark:bg-slate-900 min-h-screen">
      <Loading loading={loading} />
      <div className="max-w-7xl mx-auto">
        {/* Compact margin on link */}
        <Link href={"/dashboard"}>
          <Button variant="outline" size="sm" className="flex gap-2 mb-4 md:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FormSection
            selectedTemplate={selectedTemplate}
            userFormInput={GenerateAIContent}
            loading={loading}
            defaultValues={historyFormData}
            isPremium={isPremium}
            planLoading={planLoading}
            usageCount={writeCodeUsage}
          />
          <div className="md:col-span-2">
            <OutputSection aiOutput={aiOutput} isPremium={isPremium} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent