"use client";

import moment from "moment";
import Link from "next/link";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { AIOutput } from "@/utils/schema";
import { useRouter } from "next/navigation";
import { aiClient, AI_MODEL_NAME } from "@/utils/AiModal";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

interface PROPS {
  params: Promise<{
    "template-slug": string;
  }>;
}

function CreateNewContent(props: PROPS) {
  const params = React.use(props.params);
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"]
  );

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const { user } = useUser();
  const { setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);

  /**
   * Generate content using NEW Google GenAI SDK
   */
  const GenerateAIContent = async (formData: any) => {
    setLoading(true);
    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

    try {
      // Nayi SDK ka call: aiClient.models.generateContent
      const result = await aiClient.models.generateContent({
        model: AI_MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: FinalAIPrompt }] }],
        config: {
          temperature: 1,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        }
      });

      // Nayi SDK mein response direct text property mein hota hai
      const aiResponse = result.text; 

      if (aiResponse) {
        setAiOutput(aiResponse);
        // Save to Database
        await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, aiResponse);
      }
      
    } catch (error) {
      console.error("Error with New SDK Content Generation:", error);
    } finally {
      setLoading(false);
    }
    setUpdateCreditUsage(Date.now());
  };

  /**
   * Save in DB logic
   */
  const SaveInDb = async (formData: string, slug: string | undefined, aiResp: string) => {
    if (!slug || !user?.primaryEmailAddress?.emailAddress) {
      console.error("Missing required data for saving to DB.");
      return;
    }

    try {
      await db.insert(AIOutput).values({
        formData,
        templateSlug: slug,
        aiResponse: aiResp,
        createdBy: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD/MM/yyyy'),
      });
      console.log("Data successfully saved to DB.");
    } catch (error) {
      console.error("Error saving to the database:", error);
    }
  };

  return (
    <div className="p-5">
      <Link href={"/dashboard"}>
        <Button className="flex gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={GenerateAIContent}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent;