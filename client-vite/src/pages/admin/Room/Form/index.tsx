import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import amenityService from '@/services/amenityService';
import roomService from '@/services/roomService';
import { Amenity } from '@/types/amenity';
import { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room';

interface RoomFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (loading: boolean, data: Room | null, error?: unknown) => void;
    initialValues?: Partial<Room>;
    loading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [name, setName] = useState<string>('');
    const [roomType, setRoomType] = useState<'Single' | 'Double' | 'Suite'>('Double');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [maxGuests, setMaxGuests] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
    const [images, setImages] = useState<string[]>([]); 
    const [newImages, setNewImages] = useState<File[]>([]); 
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const roomTypeOptions = ['Single', 'Double', 'Suite'];

    const isUpdate = !!initialValues?.id;

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await amenityService.getAllAmenities({});
                setAvailableAmenities(data.amenities);
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

        if (initialValues?.id) {
            setName(initialValues.name || '');
            setRoomType((initialValues.roomType as 'Single' | 'Double' | 'Suite') || 'Double');
            setDescription(initialValues.description || '');
            setPrice(initialValues.price !== undefined ? String(initialValues.price) : '');
            setMaxGuests(initialValues.maxGuests !== undefined ? String(initialValues.maxGuests) : '');
            setQuantity(initialValues.quantity !== undefined ? String(initialValues.quantity) : '');
            setImages(initialValues.images || []);
            const initialAmenityIds = initialValues.amenities?.map((amenity: Amenity) => amenity.id) || [];
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    useEffect(() => {
        if (newImages.length === 0) {
            setImagePreviews([]);
            return;
        }
        const objectUrls = newImages.map((file: File) => URL.createObjectURL(file));
        setImagePreviews(objectUrls);
        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [newImages]);

    const handleAmenityChange = (amenityId: string) => {
        setSelectedAmenities(prevAmenities => {
            if (prevAmenities.includes(amenityId)) {
                return prevAmenities.filter(id => id !== amenityId);
            } else {
                return [...prevAmenities, amenityId];
            }
        });
    };

    const handleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (!files || files.length === 0) return;
        const maxNewFiles = 5 - images.length;
        if (files.length > maxNewFiles) { 
            alert(`Chọn tối đa ${maxNewFiles} hình ảnh mới.`);
            return;
        }
        setNewImages(files);
    };

    const handleRemoveExistingImage = (indexToRemove: number) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveNewImage = (indexToRemove: number) => {
        setNewImages(prevNewImages => prevNewImages.filter((_, index) => index !== indexToRemove));
        if (newImages.length - 1 === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(true, null, undefined);
        try {
            let responseData: Room | null = null;
            if (isUpdate && initialValues?.id) {
                // Update: build UpdateRoomInput
                const updateData: UpdateRoomInput = {
                    id: initialValues.id,
                    name,
                    roomType,
                    description,
                    price: Number(price),
                    maxGuests: Number(maxGuests),
                    quantity: Number(quantity),
                    amenities: selectedAmenities,
                    images,
                };
                responseData = await roomService.updateRoom(initialValues.id, updateData);
            } else {
                // Create: build CreateRoomInput
                if (newImages.length === 0) {
                    alert("Vui lòng chọn ít nhất một hình ảnh.");
                    onSubmit(false, null);
                    return;
                }
                const createData: CreateRoomInput = {
                    name,
                    roomType,
                    description,
                    price: Number(price),
                    maxGuests: Number(maxGuests),
                    quantity: Number(quantity),
                    amenities: selectedAmenities,
                    images: [],
                };
                responseData = await roomService.createRoom(createData);
            }
            onSubmit(false, responseData, undefined);
        } catch (error) {
            console.error(`Error ${isUpdate ? 'updating' : 'creating'} room:`, error);
            // @ts-expect-error: error có thể là bất kỳ object nào
            const errorMsg = error?.response?.data?.message || error?.message || "Lỗi không xác định";
            alert(`Lỗi ${isUpdate ? 'cập nhật' : 'tạo'} phòng: ${errorMsg}`);
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
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                {/* Modal Panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all 
                sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4" id="modal-title"> {/* Increased font size and margin */}
                                {initialValues?.id ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}
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
                                        onChange={(e) => setRoomType(e.target.value as 'Single' | 'Double' | 'Suite')}
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
                                            <div key={amenity.id}>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-red-700 border-gray-300 rounded focus:ring-red-600"
                                                        value={amenity.id}
                                                        checked={selectedAmenities.includes(amenity.id)}
                                                        onChange={() => handleAmenityChange(amenity.id)}
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
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
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
                                {loading ? 'Đang xử lý...' : initialValues?.id ? 'Lưu thay đổi' : 'Thêm phòng'}
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
