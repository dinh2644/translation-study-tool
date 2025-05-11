"use client"
import React from 'react';
import Link from 'next/link';
import { GalleryHorizontalEnd, Info, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';


const Navbar = () => {
    const { user } = useUser();

    return (
        <div className="fixed top-0 left-0 h-full w-16 flex flex-col bg-opacity-30 z-50" data-testid="NavbarId">
            {/* Logo at the top */}
            <div className='pt-4 flex justify-center z-[9999] cursor-pointer'>
                <Link
                    href="/home"
                    title="Home"
                >
                    <Image
                        src="/images/language.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className='rounded-full shadow'
                    />
                </Link>

            </div>

            {/* Icons centered in remaining space */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-4 -mt-20">
                <Link
                    href="/decks"
                    title="Decks"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow transition-transform hover:translate-x-1 hover:scale-105"
                >
                    <GalleryHorizontalEnd size={20} />
                </Link>

                <Link
                    href="/about"
                    title="About LiveLingo"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow transition-transform hover:translate-x-1 hover:scale-105"
                >
                    <Info size={20} />
                </Link>
                {/* This has to be <a> tag (for auth0 routes to work) */}
                {user &&
                    <a
                        href="/auth/logout"
                        title="Logout"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow transition-transform hover:translate-x-1 hover:scale-105"
                    >
                        <LogOut size={20} />
                    </a>}

            </div>
        </div>
    );
};

export default Navbar;
