import React from 'react';

export default function PriceRange() {
  return (
    <div className="@container">
      <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row">
        <p className="text-[#131712] text-base font-medium leading-normal w-full shrink-[3]">Price Range</p>
        <div className="flex h-[38px] w-full pt-1.5">
          <div className="flex h-1 w-full rounded-sm bg-[#dee4dc] pl-[60%] pr-[15%]">
            <div className="relative">
              <div className="absolute -left-3 -top-1.5 flex flex-col items-center gap-1">
                <div className="size-4 rounded-full bg-[#131712]"></div>
                <p className="text-[#131712] text-sm font-normal leading-normal">$0</p>
              </div>
            </div>
            <div className="h-1 flex-1 rounded-sm bg-[#131712]"></div>
            <div className="relative">
              <div className="absolute -left-3 -top-1.5 flex flex-col items-center gap-1">
                <div className="size-4 rounded-full bg-[#131712]"></div>
                <p className="text-[#131712] text-sm font-normal leading-normal">$500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}