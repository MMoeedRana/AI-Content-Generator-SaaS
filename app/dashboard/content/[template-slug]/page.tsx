"use client";

import moment from "moment";
import Link from "next/link";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { AIOutput } from "@/utils/schema";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/AiModal";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
// import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";

interface PROPS {
  params: Promise<{
    "template-slug": string;
  }>;
}

function CreateNewContent(props: PROPS) {
  // Unwrapping params with React.use()
  const params = React.use(props.params);
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"]
  );

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const { user } = useUser();
  const router=useRouter();
  const {totalUsage,setTotalUsage}=useContext(TotalUsageContext);
  // const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext);
  const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext);

  /**
   * Used to generate content from AI
   * @param formData 
   * @returns 
   */

  const GenerateAIContent = async (formData: any) => {
    // if(totalUsage>=10000&&!userSubscription)
    // {
    //   console.log("Please Upgrade");
    //   router.push('/dashboard/billing')
    //   return ;
    // }
    setLoading(true);
    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

    try {
      const result = await chatSession.sendMessage(FinalAIPrompt);
      const aiResponse = await result.response.text(); // Await `response.text()`

      setAiOutput(aiResponse);

      // Save to DB
      await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, aiResponse);
    } catch (error) {
      console.error("Error generating AI content or saving to DB:", error);
    } finally {
      setLoading(false);
    }
    setUpdateCreditUsage(Date.now())
  };

  // SaveInDb function
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
        createdAt: moment().toISOString(), // Use ISO format for universal compatibility
      });
      console.log("Data successfully saved to the database.");
    } catch (error) {
      console.error("Error saving to the database:", error);
    }
  };

  return (
    <div className="p-5">
      <Link href={"/dashboard"}>
        <Button>
          <ArrowLeft /> Back
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

export default CreateNewContent
