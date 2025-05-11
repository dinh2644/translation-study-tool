'use client'
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface PlayTooltipProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    tooltip: string;
}

const PlayTooltip = ({ src, alt, width = 30, height = 30, onClick, tooltip }: PlayTooltipProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);

    const handleMouseEnter = () => {
        {/* 
            Shows tooltip when hovering over image
            Returns: void
        */}
        setShowTooltip(true);
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom + 5
            });
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <Image
                ref={imageRef} // Add ref to the image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="cursor-pointer"
                onClick={onClick}
            />
            {showTooltip && createPortal(
                <div
                    className="fixed px-2 py-1 text-xs bg-black text-white rounded shadow z-50 whitespace-nowrap"
                    style={{
                        top: `${tooltipPosition.y}px`,
                        left: `${tooltipPosition.x}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {tooltip}
                </div>,
                document.body
            )}
        </div>
    )
}

export default PlayTooltip