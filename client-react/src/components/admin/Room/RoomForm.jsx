import React, { useState, useEffect } from 'react';
import amenityService from '../../../services/amenityService';

const RoomForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [name, setName] = useState('');
    const [roomType, setRoomType] = useState('Double');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    
    const roomTypeOptions = ['Single', 'Double', 'Triple', 'Suite', 'Deluxe', 'Family', 'VIP'];

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await amenityService.getAllAmenities();
                console.log(data);
                setAvailableAmenities(data);

            } catch (error) {
                console.error("Could not fetch amenities:", error);
            }
        };

        fetchAmenities();
    }, []);

    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name || '');
            setRoomType(initialValues.room_type || 'Double');
            setDescription(initialValues.description || '');
            setPrice(initialValues.price || '');
            setMaxGuests(initialValues.max_guests || '');
            setQuantity(initialValues.quantity || '');
            setImages(initialValues.images || []);

            // Pre-select amenities based on initialValues
            const initialAmenityIds = initialValues.amenities.map(amenity => amenity._id);
            setSelectedAmenities(initialAmenityIds);

        } else {
            setName('');
            setRoomType('Double');
            setDescription('');
            setPrice('');
            setMaxGuests('');
            setQuantity('');
            setImages([]);
            setSelectedAmenities([]);
        }
    }, [initialValues]);

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prevAmenities => {
            if (prevAmenities.includes(amenityId)) {
                return prevAmenities.filter(id => id !== amenityId);
            } else {
                return [...prevAmenities, amenityId];
            }
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        const formData = new FormData();
        files.forEach(file => formData.append('images', file)); // Use 'images' to match backend expectation

        try {
            const response = await fetch('/api/upload-images', { // Replace with your actual image upload API endpoint
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Image upload failed, status: ${response.status}`);
            }

            const data = await response.json();
            setImages(prevImages => [...prevImages, ...data.imagePaths]); // Assuming backend returns file paths
            setNewImages(files); // Store files for form submission
            setUploadingImage(false);

        } catch (error) {
            console.error("Image upload error:", error);
            setUploadingImage(false);
            // Optionally display an error message to the user
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const roomData = {
            name,
            room_type: roomType,
            description,
            price: parseInt(price, 10), 
            max_guests: parseInt(maxGuests, 10), 
            quantity: parseInt(quantity, 10), 
            amenities: selectedAmenities, // Send selected amenity IDs
            images: images, // Send uploaded image paths, assuming backend expects paths
            newImages: newImages // Send file object for new image to backend
        };

        const isUpdate = !!initialValues;
        const method = isUpdate ? 'PUT' : 'POST'; // Or PATCH depending on your API
        const url = isUpdate ? `/api/rooms/${initialValues._id}` : '/api/rooms'; // Replace with your actual API endpoint

        try {
            onSubmit(true); // Set loading state in parent component
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Try to get error details from server
                throw new Error(`Form submission failed, status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }

            const responseData = await response.json();
            onSubmit(false, responseData.room || responseData); 
            onCancel(); 

        } catch (error) {
            console.error("Form submission error:", error);
            onSubmit(false, null, error); 
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Vertical centering helper */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                {/* Modal Panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"> {/* Increased max-width sm:max-w-4xl */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4" id="modal-title"> {/* Increased font size and margin */}
                                {initialValues ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}
                            </h3>

                            {/* Main form grid - 2 cols on medium, 4 cols on large */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4"> {/* Changed grid structure */}

                                {/* Name - takes 2 cols on md+, 4 cols on lg+ */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên phòng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Room Type - takes 2 cols on md+, 4 cols on lg+ */}
                                <div className="md:col-span-2">
                                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại phòng <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="roomType"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                    >
                                        {roomTypeOptions.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price - 1 col */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá (VND) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* Max Guests - 1 col */}
                                <div>
                                    <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sức chứa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        id="maxGuests"
                                        value={maxGuests}
                                        onChange={(e) => setMaxGuests(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>

                                {/* Quantity - takes 2 cols */}
                                <div className="md:col-span-2">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                        Số lượng phòng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* Description - full width */}
                                <div className="md:col-span-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3} // Control height
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {/* Amenities - full width */}
                                <div className="md:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiện nghi
                                    </label>
                                    {/* Inner grid for checkboxes */}
                                    <div className="border border-gray-300 rounded-md p-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto"> {/* Added max-height and scroll */}
                                        {availableAmenities.length > 0 ? availableAmenities.map(amenity => (
                                            <div key={amenity._id}>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-red-700 border-gray-300 rounded focus:ring-red-600"
                                                        value={amenity._id}
                                                        checked={selectedAmenities.includes(amenity._id)}
                                                        onChange={() => handleAmenityChange(amenity._id)}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{amenity.name}</span>
                                                </label>
                                            </div>
                                        )) : <p className="text-sm text-gray-500 col-span-full">Không có tiện nghi nào.</p>}
                                    </div>
                                </div>

                                {/* Images - full width */}
                                <div className="md:col-span-4">
                                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình ảnh phòng
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg, image/webp" // Be specific
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                                        file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 
                                        hover:file:bg-red-100" // Styled file input
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage} // Disable while uploading
                                    />
                                    {uploadingImage && <p className="mt-1 text-sm text-gray-500">Đang tải ảnh lên...</p>}
                                    {/* Image Previews */}
                                    <div className="mt-2 flex flex-wrap gap-2"> {/* Use flex-wrap */}
                                        {images.map((imagePath, index) => (
                                            <div key={`${imagePath}-${index}`} className="relative">
                                                 <img
                                                    src={`http://localhost:3000/${imagePath.replace(/\\/g, '/')}`} // Ensure forward slashes
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-20 w-20 object-cover rounded border border-gray-200"
                                                    onError={(e) => { e.target.style.display = 'none'; /* Hide broken img */ }}
                                                 />
                                                {/* Optional: Add a remove button per image */}
                                                {/* <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">×</button> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div> {/* End of main grid */}
                        </div>

                        {/* Modal Actions */}
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm 
                                px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-900 focus:outline-none 
                                focus:ring-2 focus:ring-offset-2 focus:ring-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" // Adjusted colors and added disabled style
                                disabled={loading || uploadingImage}
                            >
                                {(loading || uploadingImage) ? 'Đang xử lý...' : initialValues ? 'Lưu thay đổi' : 'Thêm phòng'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm 
                                px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto 
                                sm:text-sm disabled:opacity-50" // Added disabled style
                                onClick={onCancel}
                                disabled={loading || uploadingImage}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RoomForm;
