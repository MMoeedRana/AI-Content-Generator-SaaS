"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import { Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Templates from "@/app/(data)/Templates";
import CopyButton from "../_components/CopyButton";

function HistoryList({ initialHistory, currentPage, totalRecords, limit, dbSearchTerm }: any) {
  const [historyList, setHistoryList] = useState(initialHistory);
  const [searchInput, setSearchInput] = useState(dbSearchTerm || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHistoryList(initialHistory);
    setLoading(false);
  }, [initialHistory]);

  // Global Search Logic: Typing ke 500ms baad URL update karega
  useEffect(() => {
    if (searchInput === dbSearchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      params.set("page", "0"); // Search par page reset
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const cleanContent = (text: string) => {
    if (!text) return "";
    return text.replace(/```[a-z]*\n?/gi, "").replace(/[*#]/g, "").trim();
  };

  const totalPages = Math.ceil(totalRecords / limit);

  const getGroupLabel = (dateStr: string) => {
    const date = moment(dateStr, "DD/MM/YYYY");
    if (date.isSame(moment(), "day")) return "Today";
    if (date.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
    return "Older Records";
  };

  return (
    <div className="mt-5">
      {/* Search UI (Same as before) */}
      <div className="flex gap-2 p-3 border rounded-xl mb-10 items-center bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <Search className="text-primary h-5 w-5" />
        <input
          type="text"
          placeholder="Search History..."
          className="outline-none w-full bg-transparent dark:text-white"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {loading && <Loader2 className="animate-spin h-4 w-4 text-primary" />}
      </div>

      {/* List */}
      <div className="space-y-4 min-h-[400px]">
        {historyList.length > 0 ? (
          historyList.map((item: any, index: number) => (
            <div key={item.id}>
              {(index === 0 ||
                getGroupLabel(item.createdAt) !==
                  getGroupLabel(historyList[index - 1].createdAt)) && (
                <h3 className="font-bold text-lg text-primary mb-4 mt-8 pb-1 border-b dark:border-slate-700">
                  {getGroupLabel(item.createdAt)}
                </h3>
              )}
              <div
                onClick={() =>
                  router.push(
                    `/dashboard/content/${item.templateSlug}?editId=${item.id}`
                  )
                }
                className="grid grid-cols-7 py-4 px-3 items-center hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all rounded-lg cursor-pointer group"
              >
                <div className="col-span-2 flex gap-2 items-center">
                  <Image
                    src={
                      Templates.find((t) => t.slug === item.templateSlug)
                        ?.icon || "/icon.png"
                    }
                    width={25}
                    height={25}
                    alt="icon"
                  />
                  <span className="font-medium dark:text-white group-hover:text-primary">
                    {Templates.find((t) => t.slug === item.templateSlug)?.name}
                  </span>
                </div>
                <div className="col-span-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {cleanContent(item.aiResponse)}
                </div>
                <div className="text-sm text-gray-500">{item.createdAt}</div>
                <div className="text-sm font-semibold text-primary/80">
                  {item.wordCount || 0} words
                </div>
                <div
                  className="flex gap-2 justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CopyButton aiResponse={item.aiResponse} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600"
                    onClick={async () => {
                      await axios.delete(`/api/history?id=${item.id}`);
                      setHistoryList(
                        historyList.filter((h: any) => h.id !== item.id)
                      );
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            No records found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-10 pb-10 border-t pt-5 dark:border-slate-800">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-black dark:text-white">
            {currentPage * limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-black dark:text-white">
            {Math.min((currentPage + 1) * limit, totalRecords)}
          </span>{" "}
          of <span className="font-semibold text-black dark:text-white">
            {totalRecords}
          </span>{" "}
          entries
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="dark:border-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center px-4 text-sm font-medium">
            Page {currentPage + 1} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            disabled={currentPage + 1 >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="dark:border-slate-700"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryList