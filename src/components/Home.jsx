import React from 'react'

function Home() {
  return (
    <>
    
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: Manrope, "Noto Sans", sans-serif;'>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f4f1] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#131712]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em]">Campus Exchange</h2>
            </div>
            <div className="flex items-center gap-9">
              <a className="text-[#131712] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#131712] text-sm font-medium leading-normal" href="#">Categories</a>
              <a className="text-[#131712] text-sm font-medium leading-normal" href="#">Sell</a>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#6d8566] flex border-none bg-[#f1f4f1] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131712] focus:outline-0 focus:ring-0 border-none bg-[#f1f4f1] focus:border-none h-full placeholder:text-[#6d8566] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value=""
                />
              </div>
            </label>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f1f4f1] text-[#131712] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#131712]" data-icon="Heart" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                  ></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMnu-D4RSgIxhsmnAe23kH9RD5QJ5AAHsdrQcSbJgHJvlP5NmaF-O5GV3F27tkwjqCXKj-f7nLsjh2fO7biGST85d-9PS5AqEmpJKwexjaPQeS_h2NMtqTSz-IKcXWDsCACp_i0KN9Te9zkGbEZVhTM-M47KD-WFVMba__fgqc_N_xrc47HrH4L_QblZdpDaFBnnRyphXNU4kW49K1kE9d170LUe6zvtV1SziIMobbmGNdcdi3WPH5_YcUGhQK5d-rVFvDBdqKqA");'
            ></div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                  style='background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqs4GCZRuxHFEdz5ILKaemJXzK1Eyt188XFvfARD_e0qmUNNuBlv-vqnkKZnE-VNWIcGTnnGgs3572eUGLMxm_A5WNkOKXdxF9Hie_fJPRqELAcfGIC8bav84shyUI4VpjH8mISDv-uCHIzMYZZIj0lRQOl2nJIiiKu0iQLnP497jnrpLc-S52YBfrLTQhtPJGjtG4ijVtUQcrgF01aPGP3hxxUi6jlg00fcMoi2EugvJ5LfBksvwEb77Fi6qtCmi8sG8vdRug_A");'
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Your Campus Marketplace
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Buy and sell items with fellow students. Find textbooks, electronics, furniture, and more.
                    </h2>
                  </div>
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#50d22c] text-[#131712] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                  >
                    <span className="truncate">Explore Items</span>
                  </button>
                </div>
              </div>
            </div>
            <h2 className="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Categories</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbWJY-IE77hAf8i3kBO-8oGGJgcmbNWXZV1hI4AOd3gVxbZQWV1dMkDKc7xabgJkMIiRj1qcHBORJzaGc36wYXCcXvuPFg2kjF3J1wKJbOOpllVw50jiufcdJnZWkmLFg6uAGhgVs07PKpXFf6A4YDhOmQVhpbWm57FjdyjIU2gW6xyQtdN21Zxi4BSHzJAZU67vtunZfvD2gQA_KYqbtqsC0d6yYKKrb-w8CMvuIFRouZsX3LiHCKEPlfIYqCyxUhvCgmGKCs-g");'
                ></div>
                <p className="text-[#131712] text-base font-medium leading-normal">Books</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzW7TvOhRqdwc4poZWEF05N9EkZiKDtILTYAy8rUK8NY3-XJxeCyeZjGE4wxwig7sHvDdJ2Qowb1TCUf-YpYvZJjDokbMLzsOvBwHvsLl3yaVoN4pSH7YtQuPM9Prm626TtUJSnWTK3a83orCnMgYSjMf3MtHtcauSy1VtojpWGXXMSXKFAp-AFgiA-EjiXDROmUvO7jJwzGj_gEv0gufIjXqeZM6jc8yaUJr3SzM8gmk9pTSMcAqmrCN6gUa6pqCjZcX7WSZYBg");'
                ></div>
                <p className="text-[#131712] text-base font-medium leading-normal">Electronics</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGTdwtn8a1d-pMSDYrbF7j47MpUe_TeTqaejmMB-DVjTwsolQk388SJd32a9pjd5JB0KIsg-shnPv-ilpqQbhw8hsfjugw675tqPv9urgKkezUXDU7NsopZrIbW0Wg-84ilfdzO_bqoj8ewJxjnN82fAAdrpTMg9UuuyeYqwuOYDdV_Yw24r3j1WTuVXp7n2Lr-UVapUawSYdnGylHHtNlisnwZYSBij9mYdg7og6TG7cigsz8mH_KbnF_Oyuva8NugrDMV2hZ9g");'
                ></div>
                <p className="text-[#131712] text-base font-medium leading-normal">Furniture</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2gOTRi2X8p1VQnEuI_rJZD2i-JsTaBkg1_ztTWBiz0P8fEsFv1wYp1Q8WzcPrq1JoUXnvfboZEpu1CrAef73WXuCiB9OPauFgFgpLMRtSRoNpkuX0AMRRJO-NWlv2kWqINSeHvUxGViNIfZVDDC7lv_DgXbsVQ5oy5SqxoTdz-CbHUdCnbwGZ_TDWQoCQP9gl-oDhYf7CExQvqFHb13c_USMLs4aJdA_tf0Z4QEccIjwr_29AvG8_zxM8nb65l9KhJDgogkxPHg");'
                ></div>
                <p className="text-[#131712] text-base font-medium leading-normal">Bikes</p>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDr9CHU4j8kcCK4yDyjH_UGqyG4xZzgVqiLARsZqa_M5hmBr15YAoOv_IcwaYD4BSFr64sAGbRRNli0W6pf--lKeF_XpfticIEo_M9VeP93lYseqt8l50A413bCxjSyopI6d_ivpahyGx4Lob5PjjjvVVCz0RYbTa5_q8KScaqH85S7tCJxvGIbR-8Yb0diJcSDR6uzv93HtqqMttC9PeX2b-g69T4EU20RjpclkWN1ouoUgRoqWQQpGdXsMT3Lb54E1mgX15ZafQ");'
                ></div>
                <p className="text-[#131712] text-base font-medium leading-normal">Notes</p>
              </div>
            </div>
            <h2 className="text-[#131712] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Items</h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmYsvkmmY_VhoEy4fAjm724l6mE8C5nhP8ZE1DZU382RYQmufS0njQQwnedsKMlUD4Zo8ELqCrvAca0ETZZmNBproDy03iSF1YwNkThnQg6ewG7-xslYfbFKGQ4g30wjs6p3qivmxcypiexifpFnnyAzzoQqRhvqguPc0AgTKMsL0fAMcamQDRnD43FPWDEzHmdjloT5p9-4qrepbgH588NYsRLbgli4g74wJABKwxJEjTTt6aHlYkHQp3p_h_lqqUDGoJBPyU6Q");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Calculus Textbook</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$30</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe5BDpzrjUfmceKLkUxGQBYYb9NswryiPMM8XbBq4301YtzVTa3boaZwjM4TxVJs0hnBHi97c-vZkgTIXjx-RsGlaTRRjWatMYLtpI9aQTXmW-0LIOm63qI-bXzFRB-5TLQBZ1TQSqkosoiOgCuv217nsiTwzkJC7r2iYAuSQEn-KDtto7e-CHOa_16BAdh5DsVJ05MKvwOuCOLpffhP6r9YaYxJF9d5PacWyDw75PmdWaUUiTLlZ5dXnjoXja5T1y6lNJovypKA");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Laptop - Excellent Condition</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$450</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Dorm Room Desk</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$75</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmevD2mJf1R4s4Fjfb7K2KOpctrI6SLoEZaE4Rf0izPEPbQO6VPxDoQlap-Pw7fD7icp8oKvcM4mUYnr4uJd-RlSiyptvwgrO5SgsmSgYX85Onpg8P2GARwQIuC2yYg85spBU_npYG5fQ4mJbdOvkQ3qacz0XhSw5gWOExGR-tuM6Tmk-TZFhANjQX0_LoMJ3mdBCW88Eb1Bm_QFbK6DrjHeTDry-sTCVJmbjOpWfZ1kLWzn3bU4UmrJrH5MiAXxYEjTxAou6Tjw");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Mountain Bike</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$200</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEIiI4khYjHw5CGgT-bjXTKv-U_2XMen0wFH0K1fhC-aXmU3D0KLzfsWXh1NumtsFOxnUHYXMufCM9b0IpMn4_wG3u6uXzb2j4CfcZL6Xi9lx5qnDzD84JW9mWPyonqmxTW6zojos-mpmk2ZMMDz_6d_452v8v6k_upJnGpRyDr38ENerkL5NltO_DtGzuBMnRGTk8l1gqfUfnAxL_UgeTRECKRJC0xE8WGdpAsIiPrfdphCYP7_blJJAgGIqDkjPA89oCFonAKQ");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Organic Chemistry Notes</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$15</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBz-EzJ16kNQuqKhT162nriRp_gLC5xhqUlTXCDgkZ0puAwwc0KVUKmIKdG8WbKdCa4YI207kIYdJvNFyHPW4kh-ijxie9BWcqXV7K_ns0vc99cPhPLpXSKuVUrPNd-XNh2nbLY71Q2fnEPSZM1_5SjeAHqQV_iSgN_dZ-gNTZe-YfLuP1BkhX3gxo4SycU8AaYCkmfPiClVweHQQYp8e1D0ytwDEX5ppF8IWG0yhR9c4TPH8_T1H78ZKW7PPlFWLzTLRIDKPFEBQ");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Used novels</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$20</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzkuOT0YyIgiorXX5e7BX7Swqqre_Ocja4a1ysLAXQKXfng8e4FqkAkeSd-Jm_bTPOxG_dh7Dvb9Du9uA2OhsgYqUWriC_Hrw5DfIzqQuQj4ATGi-eDmDfZb6XxAYZRYLUkQgorYOBmKE9I6clyy8hRPrjvmZ5Z_xFRS59TVeNcY0Wf_sJTM2DYURFhJJJwgrq__g13JCiWUauF-41lw3-PXKyMBMXP36qPIbIfAP5THP4JdlZuDOjScTYjX_kWJPaywCX8uueCg");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Wireless headphones</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$80</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGAPKxn39ErBT2d44xZg7fsYyYIXynMjM0_5XOshWay7nWHvhHz4KoqpkWLPwaqeZK-RPPwjdu3FvQcQoxMdxYAWGyFlu5_1cfJi1OvpDye35GoBCVZXs9xOK-vxWzHnQD2n6hZFM8_AbBqAk19fXQUccn52KR6gxnc90c5nDPywhGScX79RQo0zezIoe2ureJQYRvZCQxLqlrSJ91UshX090MKNxXOkcRAHXMkOXntGNc4H0KaC2GoHX3XOlE1q3mpck3iROHIA");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Mini fridge</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$50</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRhXtNmeS4KupxCsPbwMVEQj09oIsQDqhvmZyRiWSOK0B5Y0cyNjsgckmVh4maQT_ktR-s_JggD78CKoYbjM7IRLRZS2vFaGZJRGQdCMfjySdJ-eYVA9sHfOw9g1dVoss62pVvq-G0rJbhwbSS9xW0FBmVWHIa-0GcuFN71jFMTjKa4jOaa7nJB0kIpLU0NQp433AYrDke0FPrMS-mdQb7L_hAbl73QBEWMr1VxqGK_h8WHeKdCruohQT-f2QHFHow_TSQOx2SuA");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Scooter</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$120</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeqRneUjsOGiBdCxrrq2fLKI5TO-ENiDPuXRnS4XtqaO2Xwku-xHWxRBP0Ub4go-ymrHSQedMOYy35siZ81h1rCHb-uEVrIsySM6HFiwOTvSJpyNdpDa6rF-IiTWWeU4UXWuXl4qgqeDfIoeny_u6AxfprRJ98_D__iGCbYTGFnMuPayhgKKKUxOWTI0ne0iIX0phEO3PoAXXyUPIM-pnWbLuz3eWXLXSiHs7-ly0VezH2nbYIS-PSheuGUtBH-DyAB1IpSreJdA");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Physics notes</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$10</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMRhiXlmwQd1VqxAwKfvDl8NowGW7tEvrv4wH94_LzOYj2yln6shvFZb8Jj9z0QjxIas82gDwbNpycTm-t8QY_cPDk2kpEcPxeTk5bTg6cpfGuPReS7nCb3bpRRAYG3HEjKhdeIQIzyZcKIWljDr_QVyaoiKb3Vp_Pp4RA8lVNsq_xQvfOCN8FROxZKMJeTxihpHWtGsUgQCnlhiR0adqJJ_r71kT-43596iBMbLNPDmpHphWESy5aTAg1cbLjBSVFuhbrC-hepQ");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Art supplies</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$25</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQJCXs93HSyw3RCGpPqRtkQO9CxyWf1JfX5H3F6I-LZx46q_-iYCWGTKscKRnl3WksMWFpYvCb49OuIbCFd7Iv6-jniB6eReC9MKY6o8Afj8vOJ52k9UUXm9cB4N3CpCXZJtkUNkpnUNQdl3XLBGJsfibIFtaJUjaSSgNXLyXqPmrETlWVLSiZ6XruvX996tcbv_u-ZWKDEs3XpWxrgl_A73ZlN_g9Qhd29hBN09ymitnswZYg0VDPPJ_24EQM-uEfWA7TRhgzCQ");'
                  ></div>
                  <div>
                    <p className="text-[#131712] text-base font-medium leading-normal">Study lamp</p>
                    <p className="text-[#6d8566] text-sm font-normal leading-normal">$40</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  


    </>
  )
}

export default Home