import React, { useState } from "react";

interface RoomGalleryProps {
    images?: Array<{
        id: string;
        path: string;
    }>;
    roomName: string;
}

const RoomGallery: React.FC<RoomGalleryProps> = ({ images, roomName }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="mb-6">
                <img
                    src="/images/default-image.jpg"
                    alt={roomName}
                    className="w-full h-96 object-cover rounded-lg"
                />
            </div>
        );
    }

    return (
        <div className="mb-6">
            {/* Main image */}
            <div className="mb-4">
                <img
                    src={images[selectedImageIndex].path}
                    alt={`${roomName} ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                />
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 aspect-video ${index === selectedImageIndex
                                ? "ring-4 ring-[#D4902A] scale-105"
                                : "hover:scale-105 opacity-70 hover:opacity-100"
                            }`}
                    >
                        <img
                            src={image.path}
                            alt={`${roomName} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomGallery;
