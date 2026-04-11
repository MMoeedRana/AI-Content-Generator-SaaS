"use client";

import React from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface LoadingProps {
  loading: boolean;
}

const Loading = ({ loading }: LoadingProps) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border-none shadow-2xl">
        <VisuallyHidden.Root>
          <AlertDialogTitle>Loading Content</AlertDialogTitle>
        </VisuallyHidden.Root>

        <AlertDialogHeader>
          <AlertDialogDescription asChild>
            <div className="flex items-center flex-col py-10">
              <Image
                src={"/LoadingCourse.gif"}
                alt="loading"
                width={120}
                height={120}
                unoptimized
              />
              <h2 className="font-bold text-lg mt-5 text-gray-800 dark:text-gray-100">
                Please wait...
              </h2>
              <span className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                AI is working on your content.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Loading;
