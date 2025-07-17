import React from "react";

const items = [
  {
    name: "Calculus Textbook",
    price: "$30",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmYsvkmmY_VhoEy4fAjm724l6mE8C5nhP8ZE1DZU382RYQmufS0njQQwnedsKMlUD4Zo8ELqCrvAca0ETZZmNBproDy03iSF1YwNkThnQg6ewG7-xslYfbFKGQ4g30wjs6p3qivmxcypiexifpFnnyAzzoQqRhvqguPc0AgTKMsL0fAMcamQDRnD43FPWDEzHmdjloT5p9-4qrepbgH588NYsRLbgli4g74wJABKwxJEjTTt6aHlYkHQp3p_h_lqqUDGoJBPyU6Q",
  },
  {
    name: "Laptop - Excellent Condition",
    price: "$450",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe5BDpzrjUfmceKLkUxGQBYYb9NswryiPMM8XbBq4301YtzVTa3boaZwjM4TxVJs0hnBHi97c-vZkgTIXjx-RsGlaTRRjWatMYLtpI9aQTXmW-0LIOm63qI-bXzFRB-5TLQBZ1TQSqkosoiOgCuv217nsiTwzkJC7r2iYAuSQEn-KDtto7e-CHOa_16BAdh5DsVJ05MKvwOuCOLpffhP6r9YaYxJF9d5PacWyDw75PmdWaUUiTLlZ5dXnjoXja5T1y6lNJovypKA",
  },
  {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    {
    name: "Dorm Room Desk",
    price: "$75",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX99AEuiwY-g93TnwbCd2z3gGyWk7FXXq8u1jOU-BME1bMvfsTetQX6dlxIx0m265DEhIuCNlz3xjEVrdDYw9v_0G3mnfTrupSVPrFoUX0rhHjkQpvdlx_UP09LaPNhnatBw0U1pu8EPYL0rl1J0KLq_C4Do_nvj0r6w1Q-s8NPU-is4XBz9VMwARob1pOUfCI7PwF0N_UgYlCWEMLDoO_USNgnxTcnnpHMQLusVQr0If87q3pmSS6AOQXc6tOTlAorjBHWuvk9A",
  },
    
];
function FeaturedItems() {
  return (
    <section>
      <h2 className="text-[#131712] text-[22px] font-bold px-4 pb-3 pt-5">
        Featured Items
      </h2>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-5 p-4 max-w-6xl justify-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="w-[160px] sm:w-[180px] flex flex-col gap-3 rounded-lg"
            >
              <div
                className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl"
                style={{ backgroundImage: `url(${item.url})` }}
              ></div>
              <div>
                <p className="text-[#131712] text-sm font-medium truncate">
                  {item.name}
                </p>
                <p className="text-[#6d8566] text-sm">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedItems;