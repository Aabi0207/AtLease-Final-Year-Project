import { useState, useRef } from 'react';
import { UploadCloud, X, File, Image as ImageIcon, Film } from 'lucide-react';

const MediaUploader = ({ files, setFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    // Optional: add validation here (size, type)
    const filesWithPreviews = newFiles.map(file => {
      // Create a local object URL for previewing images/videos
      const previewUrl = URL.createObjectURL(file);
      return { file, previewUrl, id: Math.random().toString(36).substr(2, 9) };
    });
    setFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (idToRemove) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== idToRemove);
      // Clean up object URLs to avoid memory leaks
      const removed = prev.find(f => f.id === idToRemove);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
          ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-gray-900' : 'text-gray-400'}`} />
          <p className="mb-2 text-sm text-gray-500 font-medium">
            <span className="text-gray-900 underline decoration-gray-300">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">SVG, PNG, JPG, MP4 or WebM (MAX. 50MB)</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {files.map((item) => {
            const isVideo = item.file.type.startsWith('video/');
            const isImage = item.file.type.startsWith('image/');
            
            return (
              <div key={item.id} className="relative group rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {isImage ? (
                    <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                  ) : isVideo ? (
                    <video src={item.previewUrl} className="w-full h-full object-cover" />
                  ) : (
                    <File className="w-8 h-8 text-gray-400" />
                  )}
                  
                  {/* Overlay for icon indicator */}
                  <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-md backdrop-blur-sm">
                    {isVideo ? <Film className="w-4 h-4 text-white" /> : <ImageIcon className="w-4 h-4 text-white" />}
                  </div>

                  {/* Remove Button (Hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 truncate">{item.file.name}</p>
                  <p className="text-[10px] text-gray-400">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;