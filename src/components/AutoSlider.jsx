import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "./ui/Skeleton";
import siteConfig from "../config/siteConfig";

const AutoSlider = () => {
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleBannerClick = (bannerId) => {
    switch (bannerId) {
      case 1:
        // Banner 1 - Redirect to purchase page
        navigate("/purchase/11004");
        break;
      case 2:
        // Banner 2 - Redirect to add fund with 100rs preselected
        localStorage.setItem("prefilledAmount", "100");
        navigate("/addfund");
        break;
      case 3:
        // Banner 3 - Open WhatsApp
        window.open("https://wa.me/917225979671?text=Hello%20SmmGuru", "_blank");
        break;
      default:
        break;
    }
  };
  return (
    <div className="w-full max-w-[calc(100vw-2rem)] mx-auto mt-6">
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="rounded-xl overflow-hidden"
      >
        {siteConfig.banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div 
              className="relative w-full aspect-[2000/734] cursor-pointer"
              onClick={() => handleBannerClick(banner.id)}
            >
              {!loadedImages[banner.id] && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <LazyLoadImage
                src={banner.src}
                alt={banner.alt}
                width={banner.width}
                height={banner.height}
                className="w-full h-full object-cover rounded-xl"
                afterLoad={() => handleImageLoad(banner.id)}
                loading={banner.id === 1 ? "eager" : "lazy"}
                fetchPriority={banner.id === 1 ? "high" : "auto"}
                wrapperClassName="!block !w-full !h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AutoSlider;