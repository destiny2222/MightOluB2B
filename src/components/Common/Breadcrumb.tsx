import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px]">
      <div className="border-t border-gray-3 bg-slate-50/50">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-6 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-bold text-dark text-2xl sm:text-3xl xl:text-[32px] tracking-tight">
              {title}
            </h1>

            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-dark transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Home
                  </Link>
                </li>

                {pages.length > 0 &&
                  pages.map((page, key) => (
                    <li className="flex items-center" key={key}>
                      <svg className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      {key === pages.length - 1 ? (
                        <span className="text-[#418729] capitalize ml-1 cursor-default">{page}</span>
                      ) : (
                        <span className="text-gray-500 hover:text-dark transition-colors capitalize ml-1 cursor-pointer">{page}</span>
                      )}
                    </li>
                  ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;

