import React from 'react';

const items = [
  {
    title: 'Calculus Textbook',
    price: '$45',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8h4mGlkN1j2CfrqMHH0nyui7maRd17J7PmoJmfqcSXJ02Lyx6x-Uu7h9PhF9gssORz__X9-nGgIXiL9UzQcm87eBSyXf7ZJ2-UGCDmq9yUvTYb5TP9mUml_y1iCuQEdQ5WqPY24bpUnWnj27zjZeKcHfWO4yyY2aQax4HR7EyHssRkcR-ZwUZTWz7jp88lLXn67uSkeMAxj3vTsp_-Z0k8WwX_85e9ovP06_sXcDHnU6i8Nmy5T5ueh9UggyT5mwkl5-7iYuZ_w',
  },
  {
    title: 'Laptop',
    price: '$350',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB97PCq3Nmp5VGhcmzjQODqe58cZCAGrfmN3QMiAMYx-gPocXWQBY8jDZwCYgQQ71puxg-pEGz89VK5X8NVLOMbGf_uBpL75ZHhle41YR7sqvC0S5wx-YsFm77yZU8K16L9XwbqXdrYINY-1NjM2pWuntEmrV3qwiK4czQ22pdzcEfeEFaSfHXAYRRImasBUcJReV2L9T9hYh4faaPyIXFJma6zli9SzK-mjP01zSWv_6wMaRqKWsKCoTIrhwzxyhCqR8_8j4V-jg',
  },
  {
    title: 'Dorm Desk',
    price: '$60',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE7LeQb9vnHXv2NnaDMQ_v3wut-Aed2K9B693bM-81OXxcwTq0RfqgIyfm9FtkG_1nPc6iOc5ULXQKkoIMMt1_euWSIoGKC95oE9kxpQnC_VU3IIDZTTc43tL-9_BL6ku9V_UNmFovEsfanvuFF7ZnF_A7U--nH4uVWQSG7AJ4Hq8pchM7HKC9zQcbVThsOYB_F2vVlw5FsINbUM7GIoE7-o2EgM-B1dSfETPyBB4Ead2JEKqrAElKwTUfm_5Dk2rqelumwXP3bg',
  },
  {
    title: 'Organic Chemistry Notes',
    price: '$15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCITMiY5xugWJmRq-OXhJNkwnT9vxw_KD9h9-uVacva3iO6bSU3NF3ida5M4bqtF0JBq0fle6AksN0K71IqZZuMwHUJxSLb4RXjuShws8lGW2EHGt6MmGyCuJ8EplqvMLcrvOEAP8So-i6SfafQZ5Z7xCKfA_kcdz-BRktitBzu1XV3ZwbgvkbZq39vzbLx_ikLqlybpy4nf-OTYTGeMcIqLkbYetCtrm1D5tbFg2vG45lfUcIRrOf4YOpQlHgEKewMvmIiKQPg0A',
  },
  {
    title: 'Mountain Bike',
    price: '$200',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS7WWYII7aQvi132jE0J5PjlbtD90i1DgKlb0xbhQzODa6y55qhn70-vaj9BBukHq8wcCxQTn-OBh5VNki11dkTrn5xqOilR9z96DoRURnWSYvLZMib9EikWV4GbYk-RMOL6YnNhLGUqxg0S4J7UZiPgPaXm0aTukAVT67cACAiwMi3DF9SiEvXHDCXaKI23lDitX4jG-4hvXCzJu-yT9nMIgLiGzVa42Oec5jjNjrJpSTs76f7Vj8Z3TWb9G49xWPAMC6ztOZzA',
  },
];

export default function Listings() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 pb-3">
          <div
            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
            style={{ backgroundImage: `url(${item.image})` }}
          ></div>
          <div>
            <p className="text-[#131712] text-base font-medium leading-normal">{item.title}</p>
            <p className="text-[#6d8566] text-sm font-normal leading-normal">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}