import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { uploadFile, createShareLink } from '../api/storage';

const ImageUpload = ({ label, value, onChange, error: propError, required = false }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [localPreview, setLocalPreview] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Cleanup local preview URL on unmount
    useEffect(() => {
        return () => {
            if (localPreview) URL.revokeObjectURL(localPreview);
        };
    }, [localPreview]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG, WebP).');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (file.size > maxSize) {
            setError('Image size too large. Max 5MB allowed.');
            return;
        }

        setError('');
        
        // Show local preview
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);

        // Start upload process
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // 1. Upload the file
            const fd = new FormData();
            fd.append('file', file);
            fd.append('description', `Uploaded via ${label || 'Image Upload'}`);
            
            const uploadRes = await uploadFile(fd, setUploadProgress);
            const fileId = uploadRes.data?.data?.id;

            if (!fileId) throw new Error('Failed to get file ID from upload.');

            // 2. Create an unlimited public share link immediately
            const shareRes = await createShareLink(fileId, {
                label: `Public access for ${file.name}`,
                access_type: 'unlimited',
                allow_download: true
            });

            const shareUrl = shareRes.data?.data?.share_url;
            if (!shareUrl) throw new Error('Failed to generate public share link.');

            // 3. Update parent with the public share URL
            onChange(shareUrl);
            toast.success('Image uploaded and optimized.');
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.meta?.message || 'Failed to upload image.');
            setLocalPreview(null); // Reset preview on failure
        } finally {
            setIsUploading(false);
        }
    };

    const triggerBrowse = () => {
        if (!isUploading) fileInputRef.current?.click();
    };

    const displayImage = localPreview || value;

    return (
        <div className="space-y-1.5 px-1">
            {label && (
                <label className="text-sm font-medium text-surface-on block uppercase tracking-widest text-[10px]">
                    {label} {required && <span className="text-error">*</span>}
                </label>
            )}
            
            <div 
                className={`relative group h-48 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden bg-surface-container-low
                    ${error || propError ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container'}`}
            >
                {displayImage ? (
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src={displayImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={triggerBrowse}
                                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg  hover:scale-105 active:scale-95 transition-all"
                            >
                                Change Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer p-6 text-center"
                        onClick={triggerBrowse}
                    >
                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-surface-on">Click to upload image</p>
                            <p className="text-[10px] text-surface-on-variant mt-1">PNG, JPG or WebP (Max 5MB)</p>
                        </div>
                    </div>
                )}

                {/* Uploading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-[2px] z-10 flex flex-col items-center justify-center px-8 text-center">
                        <div className="w-full max-w-[120px] mb-3">
                            <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300" 
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                            Uploading {uploadProgress}%
                        </p>
                    </div>
                )}
            </div>

            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {(error || propError) && (
                <p className="text-[10px] text-error font-bold uppercase tracking-wider mt-1 px-1">
                    {error || propError}
                </p>
            )}
        </div>
    );
};

ImageUpload.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool
};

export default ImageUpload;
