"use client";

import axios from "axios";
import moment from "moment";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { UserSubscription } from "@/utils/schema";
import React, { useContext, useState } from "react";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";

function Billing() {
  const [loading,setLoading]=useState(false);
  const {user}=useUser();
  //   const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext)
  // const CreateSubscription = () => {
  //   setLoading(true);
  //   axios
  //     .post("/api/create-subscription", {})
  //     .then((resp) => {
  //       console.log(resp.data);
  //       onPayment(resp.data.id)
  //     },(error)=>{
  //       setLoading(false);
  //     });
  // };

  // const onPayment=(subId:string)=>{
  //   const options={
  //     "key":process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //     "subscription_id":subId,
  //     "name":'Full stack web development apps',
  //     description:'Monthly Subscription',
  //     handler:async(resp:any)=>{
  //       console.log(resp);
  //       if(resp)
  //       {
  //         SaveSubscription(resp?.razorpay_payment_id)
  //       }
  //       setLoading(false);
  //     }
  //   }
  //   //@ts-ignore
  //   const rzp=new window.Razorpay(options);
  //   rzp.open();
  // }

  // const SaveSubscription=async(paymentId:string)=>{
  //   const result=await db.insert(UserSubscription)
  //   .values({
  //     email:user?.primaryEmailAddress?.emailAddress,
  //     userName:user?.fullName,
  //     active:true,
  //     paymentId:paymentId,
  //     joinDate:moment().format('DD/MM/yyyy')
  //   })
  //   console.log(result);
  //   if(result)
  //   {
  //     window.location.reload();
  //   }
  // }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h2 className="text-center font-bold text-4xl my-5">
        Upgrade With Monthly Plan
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg text-gray-900 font-semibold">Free</h3>
            </div>

            <div className="flex justify-center items-center py-3"><span className="font-bold text-4xl text-black text-center">0$</span><span className="text-gray-900 text-center text-md">/month</span></div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">10,000 Words/Month</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">50+ Content Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">Unlimited Download & Copy</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">1 Month of History</span>
              </li>
            </ul>
          </div>
          <Button
            className="mt-8 w-[80%] mx-auto rounded-full border px-8 py-3 text-center text-sm font-medium text-white bg-gray-500 border-indigo-600 hover:bg-transparent hover:border-2 hover:bg-gray-600 focus:outline-none flex items-center justify-center"
          >
            Currently Active Plan
          </Button>
        </div>

        {/* Monthly Plan */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg text-gray-900 font-semibold">Monthly</h3>
            </div>

            <div className="flex justify-center items-center py-3"><span className="font-bold text-4xl text-black text-center">9.99$</span><span className="text-gray-900 text-center text-md">/month</span></div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">100,000 Words/Month</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">50+ Content Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">Unlimited Download & Copy</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10c-3 0-6 1.79-6 3s3 3 6 3s6-1.79 6-3s-3-3-6-3z"
                  />
                </svg>
                <span className="text-gray-700">1 Year of History</span>
              </li>
            </ul>
          </div>
          {/* <Button
          disabled={loading}
            onClick={() => CreateSubscription()}
            className="mt-8  w-[80%] mx-auto rounded-full border px-8 py-3 text-center text-sm font-medium text-indigo-600 bg-white border-indigo-600 hover:bg-transparent hover:border-2 hover:border-indigo-700 focus:outline-none flex gap-2 items-center justify-center"
          >
            {loading&&<Loader2Icon className="animate-spin"/>}
            {userSubscription?'Active Plan' : 'Get Started'}
          </Button> */}

          <Button
          disabled={loading}
            className="mt-8  w-[80%] mx-auto rounded-full border px-8 py-3 text-center text-sm font-medium text-indigo-600 bg-white border-indigo-600 hover:bg-transparent hover:border-2 hover:border-indigo-700 focus:outline-none flex gap-2 items-center justify-center"
          >
            Get Started
          </Button>

        </div>
      </div>
    </div>
  );
}

export default Billing;
