import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../store';
import { DrawingStroke } from '../types';

type Tool = 'pen' | 'highlighter' | 'eraser' | 'lasso';
type StrokeTool = 'pen' | 'highlighter' | 'eraser';

export default function DrawingCanvas() {
  const { currentNote, setViewMode, updateNote, isRTL } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#7c3aed');
  const [brushSize, setBrushSize] = useState(3);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw strokes
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    allStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const midX = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
        const midY = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, midX, midY);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }, [strokes, currentStroke]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'lasso') return;
    e.preventDefault();
    const { x, y } = getCanvasPoint(e);
    setIsDrawing(true);
    const activeTool = tool as StrokeTool;
    setCurrentStroke({
      points: [{ x, y }],
      color: activeTool === 'eraser' ? '#ffffff' : color,
      width: activeTool === 'highlighter' ? brushSize * 4 : activeTool === 'eraser' ? brushSize * 6 : brushSize,
      tool: activeTool,
    });
  }, [tool, color, brushSize, getCanvasPoint]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    const { x, y } = getCanvasPoint(e);
    setCurrentStroke(prev => prev ? { ...prev, points: [...prev.points, { x, y }] } : null);
  }, [isDrawing, currentStroke, getCanvasPoint]);

  const handleEnd = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
    setIsDrawing(false);
  }, [currentStroke]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redrawCanvas();
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redrawCanvas]);

  const undo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    setStrokes([]);
  };

  const saveDrawing = () => {
    if (currentNote) {
      updateNote(currentNote.id, { hasDrawing: strokes.length > 0 });
    }
    setViewMode('editor');
  };

  const colors = ['#1a1a2e', '#7c3aed', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#6b7280'];

  const noteRTL = currentNote?.isRTL ?? isRTL;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900" dir={noteRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={saveDrawing}
          className="px-4 py-2 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors"
        >
          <i className={`fas ${noteRTL ? 'fa-check' : 'fa-check'} ml-2`}></i>
          {noteRTL ? 'ذخیره' : 'Save'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {strokes.length} {noteRTL ? 'خط' : 'strokes'}
          </span>
          <button onClick={undo} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
            <i className="fas fa-undo text-sm"></i>
          </button>
          <button onClick={clearCanvas} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
            <i className="fas fa-trash text-sm"></i>
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Tools */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {[
              { id: 'pen' as Tool, icon: 'fa-pen', label: noteRTL ? 'قلم' : 'Pen' },
              { id: 'highlighter' as Tool, icon: 'fa-highlighter', label: noteRTL ? 'هایلایتر' : 'Highlighter' },
              { id: 'eraser' as Tool, icon: 'fa-eraser', label: noteRTL ? 'پاک‌کن' : 'Eraser' },
              { id: 'lasso' as Tool, icon: 'fa-draw-polygon', label: noteRTL ? 'لاسو' : 'Lasso' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                  tool === t.id
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className={`fas ${t.icon}`}></i>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Colors & Size */}
          <div className="flex items-center justify-center gap-4">
            {/* Colors */}
            <div className="flex gap-1.5">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                    color === c ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Brush size */}
            <div className="flex items-center gap-2">
              <i className="fas fa-circle text-[6px] text-gray-400"></i>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-violet-500"
              />
              <i className="fas fa-circle text-sm text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
