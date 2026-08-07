import React from "react";

const Navbar =() => {
    return(
        <div className='w-full flex justify-between h-15 px-5 items-center bg-gray-200'>
           <div className='w-[10%] flex items-center h-full'>
            <h1 className='font-bold text-zinc-800'>LOGO</h1>
           </div>
           <div className='w-[50%] h-full'>
            <ul className='w-full gap-6 list-none h-full flex items-center text-zinc-800 font-semibold'>
                <li className='cursor-pointer'>HOME</li>
                <li className='cursor-pointer'>ABOUT</li>
                <li className='cursor-pointer'>CONTACT</li>
            </ul>
           </div>

        </div>
    );
}
export default Navbar;