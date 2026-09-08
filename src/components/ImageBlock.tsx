import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InlineImage } from '../types';
import { useApp } from '../store';

interface ImageBlockProps {
  image: InlineImage;
  onUpdate: (updates: Partial<InlineImage>) => void;
  onRemove: () => void;
}

export default function ImageBlock({ image, onUpdate, onRemove }: ImageBlockProps) {
  const { isRTL } = useApp();
  const [isResizing, setIsResizing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setStartSize({ width: image.width, height: image.height });
    setStartPos({ x: clientX, y: clientY });
  }, [image.width, image.height]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;

    // Maintain aspect ratio
    const aspectRatio = startSize.width / startSize.height;
    let newWidth = startSize.width + (isRTL ? -deltaX : deltaX);
    let newHeight = newWidth / aspectRatio;

    // Minimum size
    newWidth = Math.max(100, Math.min(800, newWidth));
    newHeight = Math.max(60, Math.min(600, newHeight));

    onUpdate({ width: Math.round(newWidth), height: Math.round(newHeight) });
  }, [isResizing, startPos, startSize, onUpdate, isRTL]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleResizeMove);
      window.addEventListener('touchend', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Quick resize presets
  const presets = [
    { label: isRTL ? 'کوچک' : 'S', width: 200, height: Math.round(200 * (image.height / image.width)) },
    { label: isRTL ? 'متوسط' : 'M', width: 400, height: Math.round(400 * (image.height / image.width)) },
    { label: isRTL ? 'بزرگ' : 'L', width: 600, height: Math.round(600 * (image.height / image.width)) },
    { label: isRTL ? 'کامل' : 'Full', width: 750, height: Math.round(750 * (image.height / image.width)) },
  ];

  return (
    <div
      ref={containerRef}
      className="my-4 relative group inline-block"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isResizing && setShowControls(false)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Image */}
      <div
        className="relative rounded-xl overflow-hidden shadow-md border-2 border-transparent hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
        style={{ width: image.width, maxWidth: '100%' }}
      >
        <img
          src={image.src}
          alt={image.alt}
          style={{ width: image.width, height: image.height, objectFit: 'cover' }}
          className="rounded-xl block"
          draggable={false}
        />

        {/* Resize handles */}
        {showControls && (
          <>
            {/* Corner resize handle */}
            <div
              className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-6 h-6 cursor-${isRTL ? 'sw' : 'se'}-resize bg-violet-500 rounded-tl-lg flex items-center justify-center opacity-80 hover:opacity-100`}
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            >
              <i className="fas fa-expand-alt text-white text-[8px]"></i>
            </div>

            {/* Remove button */}
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </>
        )}
      </div>

      {/* Size controls */}
      {showControls && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 border border-gray-100 dark:border-gray-700 z-10">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onUpdate({ width: preset.width, height: preset.height })}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                Math.abs(image.width - preset.width) < 20
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <span className="text-[10px] text-gray-400 px-1">
            {image.width}×{image.height}
          </span>
        </div>
      )}
    </div>
  );
}

// Image upload helper
export function ImageUploader({ onImageSelected }: { onImageSelected: (image: InlineImage) => void }) {
  const { isRTL } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        // Calculate appropriate inline size (max 500px wide, maintain aspect ratio)
        const maxWidth = 500;
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        onImageSelected({
          id: Date.now().toString(),
          src,
          width: Math.round(width),
          height: Math.round(height),
          alt: file.name,
          position: 0,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-right"
      >
        <i className="fas fa-image text-green-500 w-5"></i>
        {isRTL ? 'افزودن تصویر' : 'Insert Image'}
      </button>
    </>
  );
}
