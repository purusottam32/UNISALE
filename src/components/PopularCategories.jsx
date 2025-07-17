import React from "react";

const categories = [
  { name: "Books", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbWJY-IE77hAf8i3kBO-8oGGJgcmbNWXZV1hI4AOd3gVxbZQWV1dMkDKc7xabgJkMIiRj1qcHBORJzaGc36wYXCcXvuPFg2kjF3J1wKJbOOpllVw50jiufcdJnZWkmLFg6uAGhgVs07PKpXFf6A4YDhOmQVhpbWm57FjdyjIU2gW6xyQtdN21Zxi4BSHzJAZU67vtunZfvD2gQA_KYqbtqsC0d6yYKKrb-w8CMvuIFRouZsX3LiHCKEPlfIYqCyxUhvCgmGKCs-g" },
  { name: "Electronics", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzW7TvOhRqdwc4poZWEF05N9EkZiKDtILTYAy8rUK8NY3-XJxeCyeZjGE4wxwig7sHvDdJ2Qowb1TCUf-YpYvZJjDokbMLzsOvBwHvsLl3yaVoN4pSH7YtQuPM9Prm626TtUJSnWTK3a83orCnMgYSjMf3MtHtcauSy1VtojpWGXXMSXKFAp-AFgiA-EjiXDROmUvO7jJwzGj_gEv0gufIjXqeZM6jc8yaUJr3SzM8gmk9pTSMcAqmrCN6gUa6pqCjZcX7WSZYBg" },
  { name: "Furniture", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGTdwtn8a1d-pMSDYrbF7j47MpUe_TeTqaejmMB-DVjTwsolQk388SJd32a9pjd5JB0KIsg-shnPv-ilpqQbhw8hsfjugw675tqPv9urgKkezUXDU7NsopZrIbW0Wg-84ilfdzO_bqoj8ewJxjnN82fAAdrpTMg9UuuyeYqwuOYDdV_Yw24r3j1WTuVXp7n2Lr-UVapUawSYdnGylHHtNlisnwZYSBij9mYdg7og6TG7cigsz8mH_KbnF_Oyuva8NugrDMV2hZ9g" },
  { name: "Bikes", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2gOTRi2X8p1VQnEuI_rJZD2i-JsTaBkg1_ztTWBiz0P8fEsFv1wYp1Q8WzcPrq1JoUXnvfboZEpu1CrAef73WXuCiB9OPauFgFgpLMRtSRoNpkuX0AMRRJO-NWlv2kWqINSeHvUxGViNIfZVDDC7lv_DgXbsVQ5oy5SqxoTdz-CbHUdCnbwGZ_TDWQoCQP9gl-oDhYf7CExQvqFHb13c_USMLs4aJdA_tf0Z4QEccIjwr_29AvG8_zxM8nb65l9KhJDgogkxPHg" },
  { name: "Notes", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr9CHU4j8kcCK4yDyjH_UGqyG4xZzgVqiLARsZqa_M5hmBr15YAoOv_IcwaYD4BSFr64sAGbRRNli0W6pf--lKeF_XpfticIEo_M9VeP93lYseqt8l50A413bCxjSyopI6d_ivpahyGx4Lob5PjjjvVVCz0RYbTa5_q8KScaqH85S7tCJxvGIbR-8Yb0diJcSDR6uzv93HtqqMttC9PeX2b-g69T4EU20RjpclkWN1ouoUgRoqWQQpGdXsMT3Lb54E1mgX15ZafQ" },
];

function PopularCategories() {
  return (
    <>
      <h2 className="text-[#131712] text-[22px] font-bold px-4 pb-3 pt-5">Popular Categories</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col gap-3 pb-3">
            <div
              className="w-full aspect-square bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url(${cat.url})` }}
            ></div>
            <p className="text-[#131712] text-base font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default PopularCategories;