import React from "react";
import { FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Left side: Address & Contact */}
        <div className="mb-6 md:mb-0 space-y-2">
          <p className="font-semibold text-white">Jafsa Resto Cafe</p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-500" />
            Mysuru Road, Kottakkunnu, <br /> Sulthan Bathery, Wayanad
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneAlt className="text-yellow-500" />
            <a href="tel:8926900700" className="text-yellow-500 hover:underline">
              +91 89269 00700
            </a>
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex space-x-6 mb-6 md:mb-0">
          <a
            href="https://www.instagram.com/jafsa_bakes?igsh=ZTZ3bXJ2Y3Q0MHVv"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-2xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/share/1WKRUJMicp/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-2xl"
          >
            <FaFacebook />
          </a>
        </div>

        {/* Right side: Powered by */}
        <div>
          <p className="text-sm">
            Powered by{" "}
            <a 
              href="https://imcbs.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-yellow-500 hover:underline"
            >
              IMCB Solution LLP
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
