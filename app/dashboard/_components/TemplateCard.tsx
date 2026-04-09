import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TEMPLATE } from "./TemplateListSection";

function TemplateCard(item: TEMPLATE) {
  return (
    <Link href={"/dashboard/content/" + item?.slug}>
      <div className="p-5 shadow-sm rounded-xl border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 flex flex-col gap-3 cursor-pointer hover:border-primary dark:hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full group">
        <div className="p-2 bg-gray-50 dark:bg-slate-800 w-fit rounded-lg group-hover:bg-primary/10 transition-colors">
            <Image src={item.icon} alt="icon" width={35} height={35} className="group-hover:scale-110 transition-transform" />
        </div>

        <h2 className="font-bold text-lg text-black dark:text-white group-hover:text-primary transition-colors">
          {item.name}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
          {item.desc}
        </p>
      </div>
    </Link>
  );
}

export default TemplateCard