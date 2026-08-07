"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        bulletClass: "swiper-pagination-bullet !w-4 !h-4 !border-2 !border-gray-300 !bg-transparent !rounded-full !opacity-100 !mx-1 transition-all duration-300",
        bulletActiveClass: "!border-[#56A02C] !bg-transparent relative after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-[#56A02C] after:rounded-full",
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {/* Slide 1 - MightyOlu Standard */}
      <SwiperSlide>
        <div className="flex items-center flex-col lg:flex-row h-full pb-14 pt-8 lg:pb-0 lg:pt-0 max-w-[1200px] mx-auto min-h-[500px]">
          
          {/* Left Side: Images & Floating Elements */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative p-8 lg:p-14">
            <div className="relative w-full max-w-[500px] aspect-square flex justify-center items-center">
              
              {/* Main Image */}
              <div className="relative w-full h-[80%] z-10">
                <Image
                  src="/images/hero/hero-03.png" // Replace with fish/grocery image if available
                  alt="fresh produce"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute top-[10%] right-[10%] z-20 flex items-center justify-center w-28 h-28 bg-[#C81A1A] text-white rounded-full border-4 border-white shadow-xl rotate-[15deg]">
                <div className="text-center">
                  <span className="block text-2xl font-serif italic leading-none">35%</span>
                  <span className="block text-xl font-serif italic leading-none">off</span>
                </div>
              </div>

              {/* Floating Leaves Decor (Optional, using CSS shapes or small img) */}
              <div className="absolute top-[20%] left-[5%] z-20 text-green-500 opacity-80 rotate-45 text-4xl">
                🌿
              </div>
              <div className="absolute bottom-[10%] left-[15%] z-20 text-green-500 opacity-80 -rotate-12 text-4xl">
                🌿
              </div>
            </div>
          </div>

          {/* Right Side: Text & CTA */}
          <div className="w-full lg:w-1/2 px-8 sm:px-14 lg:px-10 flex flex-col justify-center items-start text-left">
            
            <h1 className="font-bold text-[#0D162B] text-4xl sm:text-6xl leading-[1.1] mb-4">
              Your Kitchen<br />Starts Here
            </h1>

            <h2 className="font-bold text-[#56A02C] text-xl sm:text-3xl leading-tight mb-8">
              Fresh Produce, Quality Brands,<br />Great Prices
            </h2>

            <p className="text-gray-600 text-base sm:text-lg mb-10 max-w-[450px] leading-relaxed">
              From Farm-fresh produce to pantry essentials, find everything you need to whip up something amazing
            </p>

            <a
              href="/product"
              className="inline-flex items-center gap-2 font-medium text-white bg-[#56A02C] py-3.5 px-8 rounded-full ease-out duration-300 hover:bg-[#438121] hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

        </div>
      </SwiperSlide>

      {/* Slide 2 - Duplicate/Alternative content */}
      <SwiperSlide>
        <div className="flex items-center flex-col lg:flex-row h-full pb-14 pt-8 lg:pb-0 lg:pt-0 max-w-[1200px] mx-auto min-h-[500px]">
          
          <div className="w-full lg:w-1/2 flex justify-center items-center relative p-8 lg:p-14">
            <div className="relative w-full max-w-[500px] aspect-square flex justify-center items-center">
              
              <div className="relative w-full h-[80%] z-10">
                <Image
                  src="/images/hero/hero-04.png"
                  alt="fresh fruits"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              <div className="absolute top-[15%] right-[5%] z-20 flex items-center justify-center w-24 h-24 bg-[#E2A422] text-white rounded-full border-4 border-white shadow-xl -rotate-12">
                <div className="text-center">
                  <span className="block text-xl font-serif italic leading-none">Best</span>
                  <span className="block text-lg font-serif italic leading-none">Deal</span>
                </div>
              </div>

            </div>
          </div>

          <div className="w-full lg:w-1/2 px-8 sm:px-14 lg:px-10 flex flex-col justify-center items-start text-left">
            
            <h1 className="font-bold text-[#0D162B] text-4xl sm:text-6xl leading-[1.1] mb-4">
              Premium Business to Business<br />Supplies
            </h1>

            <h2 className="font-bold text-[#56A02C] text-xl sm:text-3xl leading-tight mb-8">
              Wholesale Pricing, Bulk Orders,<br />Fast Delivery
            </h2>

            <p className="text-gray-600 text-base sm:text-lg mb-10 max-w-[450px] leading-relaxed">
              Stock your business with the best quality ingredients and products sourced directly from top suppliers.
            </p>

            <a
              href="/product"
              className="inline-flex items-center gap-2 font-medium text-white bg-[#56A02C] py-3.5 px-8 rounded-full ease-out duration-300 hover:bg-[#438121] hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
