import React from "react";

function HeroSection() {
  return (
    <div className="w-full">
      <div className="p-2 sm:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 sm:gap-8 rounded-xl sm:rounded-xl items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80")',
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-3xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
              Your Campus Marketplace
            </h1>
            <h2 className="text-white text-sm sm:text-base">
              Buy and sell items with fellow students. Find textbooks, electronics, furniture, and more.
            </h2>
          </div>
          <button className="h-10 sm:h-12 px-4 rounded-full bg-[#50d22c] text-[#131712] text-sm sm:text-base font-bold">
            <span className="truncate">Explore Items</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
