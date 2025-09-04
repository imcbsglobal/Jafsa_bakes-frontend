import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaStar } from "react-icons/fa";

const Banner = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white shadow-lg z-50 flex justify-around items-center py-3 md:py-2">
      <a
        href="https://www.instagram.com/jafsa_bakes?igsh=ZTZ3bXJ2Y3Q0MHVv"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl hover:scale-110 transition-transform"
      >
        <FaInstagram />
      </a>
      <a
        href="https://www.facebook.com/share/1WKRUJMicp/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl hover:scale-110 transition-transform"
      >
        <FaFacebookF />
      </a>
      <a
        href="https://wa.me/918926900700"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl hover:scale-110 transition-transform"
      >
        <FaWhatsapp />
      </a>
      <a
        href="https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-lg font-semibold hover:scale-105 transition-transform"
      >
        <FaStar /> Review
      </a>
    </div>
  );
};

export default Banner;
