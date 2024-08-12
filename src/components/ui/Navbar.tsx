import React from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";


export default function Navbar() {
  return (
    <nav className="flex justify-around items-center bg-[#242424] w-full h-[68px] fixed text-white z-10">
      <div className="flex gap-2">
        <figure className="w-[48px] ml-4 sm:w-[40px] sm:h-[40px]">
          <Image src={logo} alt="WebCraft Logo" className="invert" />
        </figure>
        <input
          className="rounded-sm mt-1 h-[36px] text-black  pl-1"
          placeholder="Search..."
        />
      </div>
        <div className="flex gap-2">
        </div>
    </nav>
  );
}
