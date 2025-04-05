import React, { useState, useEffect, useRef } from 'react';
import amenityService from '../../../services/amenityService';
import roomService from '../../../services/roomService';

const RoomForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [name, setName] = useState('');
    const [roomType, setRoomType] = useState('Double');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [images, setImages] = useState([]); 
    const [newImages, setNewImages] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]);

    const fileInputRef = useRef(null);
    
    const roomTypeOptions = ['Single', 'Double', 'Suite'];

    const isUpdate = !!initialValues?._id; // Trick to convert value to boolean

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await amenityService.getAllAmenities();
                setAvailableAmenities(data);
            } catch (error) {
                console.error("Could not fetch amenities:", error);
                setAvailableAmenities([]);
            }
        };

        fetchAmenities();
    }, []);

    useEffect(() => {
        // Clear previous previews when initialValues change
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setNewImages([]); // Clear newly selected files

        if (initialValues?._id) { // Check specifically for _id for update mode
            setName(initialValues.name || '');
            setRoomType(initialValues.room_type || 'Double');
            setDescription(initialValues.description || '');
            setPrice(initialValues.price || '');
            setMaxGuests(initialValues.max_guests || '');
            setQuantity(initialValues.quantity || '');
            setImages(initialValues.images || []); // Existing image paths

            const initialAmenityIds = initialValues.amenities?.map(amenity => amenity._id) || [];
            setSelectedAmenities(initialAmenityIds);
        } else {
            // Reset form for create mode
            setName('');
            setRoomType('Double');
            setDescription('');
            setPrice('');
            setMaxGuests('');
            setQuantity('');
            setImages([]); // No existing images
            setSelectedAmenities([]);
            // setNewImages([]); // Already cleared above
        }
        // Reset file input visually
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    }, [initialValues]);

    // Generate previews when newImages changes
    useEffect(() => {
        if (newImages.length === 0) {
            setImagePreviews([]);
            return;
        }
        const objectUrls = newImages.map(file => URL.createObjectURL(file));
        setImagePreviews(objectUrls);

        // Cleanup function to revoke URLs when component unmounts or newImages change again
        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [newImages]);

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities(prevAmenities => {
            if (prevAmenities.includes(amenityId)) {
                return prevAmenities.filter(id => id !== amenityId);
            } else {
                return [...prevAmenities, amenityId];
            }
        });
    };

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        // You might want to limit the number of new files based on existing ones
        const maxNewFiles = 5 - images.length;
        if (files.length > maxNewFiles) { 
            alert(`Chọn tối đa ${maxNewFiles} hình ảnh mới.`);
            return;
        }

        setNewImages(files); // Store the File objects
    };

    // Function to remove an existing image (for update form)
    const handleRemoveExistingImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
        // NOTE: You'll need corresponding backend logic to handle image removal during update
    };

    // Function to remove a newly selected image before upload
    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages(prevNewImages => prevNewImages.filter((_, index) => index !== indexToRemove));
         // Reset file input visually if all new images are removed
         if (newImages.length - 1 === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set loading state via prop passed from parent
        onSubmit(true, null, null); // Pass loading=true, data=null, error=null

        // Use FormData for multipart request
        const formData = new FormData();

        formData.append('name', name);
        formData.append('room_type', roomType);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('max_guests', maxGuests);
        formData.append('quantity', quantity);

        // Append each ID individually
        selectedAmenities.forEach(id => formData.append('amenities', id));

        try {
            let responseData;
            if (isUpdate) {
                // UPDATE LOGIC
                // Append *new* files for upload
                newImages.forEach(file => formData.append('images', file, file.name));
                // Send existing image paths (backend needs to handle this)
                // Option A: Send all current paths
                formData.append('existingImages', JSON.stringify(images));
                // Option B: Only send paths if backend expects specific handling
                // images.forEach(imgPath => formData.append('existingImagePaths', imgPath));

                console.log("Updating room with ID:", initialValues._id);
                responseData = await roomService.updateRoom(initialValues._id, formData);

            } else {
                // CREATE LOGIC
                // Append the actual File objects for upload
                if (newImages.length === 0) {
                    // Handle case where no images are selected for creation if needed
                    alert("Vui lòng chọn ít nhất một hình ảnh.");
                    onSubmit(false, null); // Stop loading
                    return;
                }
                newImages.forEach(file => formData.append('images', file, file.name)); // 'images' must match backend field

                console.log("Creating new room...");
                // createRoom service should handle FormData
                responseData = await roomService.createRoom(formData);
            }
            onSubmit(false, responseData, null); // Pass loading=false, data=responseData, error=null
            //onCancel();
        } catch (error) {
            console.error(`Error ${isUpdate ? 'updating' : 'creating'} room:`, error);
            const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
            alert(`Lỗi ${isUpdate ? 'cập nhật' : 'tạo'} phòng: ${errorMsg}`);
            onSubmit(false, null, error); // Pass loading=false, data=null, error=error object
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all 
                sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4" id="modal-title"> {/* Increased font size and margin */}
                                {initialValues?._id ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}
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
                                        {isUpdate ? 'Thêm/Thay đổi hình ảnh' : 'Hình ảnh phòng'}
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        id="images"
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                                        file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 
                                        hover:file:bg-red-100" // Styled file input
                                        onChange={handleImageSelection}
                                    />
                                    {/* --- Preview Area --- */}
                                    <div className="mt-3 text-sm text-gray-600">Xem trước:</div>
                                    <div className="mt-2 flex flex-wrap gap-2 border border-gray-200 p-2 rounded min-h-[6rem]">
                                        {/* Existing Images (only show in update mode) */}
                                        {isUpdate && images.map((imagePath, index) => (
                                            <div key={`existing-${index}`} className="relative">
                                                <img
                                                    src={`http://localhost:3000/${imagePath.replace(/\\/g, '/')}`}
                                                    alt={`Existing ${index + 1}`}
                                                    className="h-20 w-20 object-cover rounded border border-gray-300"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold leading-none hover:bg-red-700 focus:outline-none"
                                                    aria-label="Remove existing image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {/* New Image Previews */}
                                        {imagePreviews.map((previewUrl, index) => (
                                            <div key={`new-${index}`} className="relative">
                                                <img
                                                    src={previewUrl}
                                                    alt={`New preview ${index + 1}`}
                                                    className="h-20 w-20 object-cover rounded border border-green-400" // Green border for new
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewImage(index)}
                                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold leading-none hover:bg-red-700 focus:outline-none"
                                                    aria-label="Remove new image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {/* Placeholder if no images */}
                                        {!isUpdate && imagePreviews.length === 0 && images.length === 0 && (
                                            <p className="text-sm text-gray-400 italic self-center">Chưa có ảnh nào được chọn.</p>
                                        )}
                                        {isUpdate && imagePreviews.length === 0 && images.length === 0 && (
                                            <p className="text-sm text-gray-400 italic self-center">Không có ảnh nào.</p>
                                        )}
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
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : initialValues?._id ? 'Lưu thay đổi' : 'Thêm phòng'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm 
                                px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto 
                                sm:text-sm disabled:opacity-50" // Added disabled style
                                onClick={onCancel}
                                disabled={loading}
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
