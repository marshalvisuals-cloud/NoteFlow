import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceRecording } from '../types';
import { useApp } from '../store';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: VoiceRecording) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const { isRTL } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const blobUrl = URL.createObjectURL(blob);

        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          onRecordingComplete({
            id: Date.now().toString(),
            blobUrl,
            base64Data: base64,
            duration: recordingTime,
            insertedAt: Date.now(),
            position: 0,
          });
        };
        reader.readAsDataURL(blob);

        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Audio level visualization
      const updateLevel = () => {
        if (analyserRef.current) {
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setAudioLevel(avg / 255);
        }
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert(isRTL ? 'دسترسی به میکروفون رد شد' : 'Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    onCancel();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Generate waveform bars
  const waveformBars = Array.from({ length: 40 }, (_, i) => {
    const height = isRecording
      ? 20 + Math.sin(i * 0.5 + recordingTime * 2) * audioLevel * 60 + Math.random() * audioLevel * 20
      : 20 + Math.sin(i * 0.3) * 10;
    return Math.max(8, Math.min(80, height));
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-[90%] max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {isRTL ? 'ضبط صدا' : 'Voice Recording'}
          </h3>
          <button onClick={cancelRecording} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center gap-[2px] h-24 mb-6 bg-gray-50 dark:bg-gray-900 rounded-2xl px-4">
          {waveformBars.map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                isRecording ? 'bg-red-500' : 'bg-violet-400'
              }`}
              style={{ height: `${h}%`, opacity: isRecording ? 0.5 + audioLevel * 0.5 : 0.4 }}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <span className={`text-4xl font-mono font-bold ${isRecording ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {formatTime(recordingTime)}
          </span>
          {isRecording && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm text-red-500">{isRTL ? 'در حال ضبط...' : 'Recording...'}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              <i className="fas fa-microphone"></i>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              <i className="fas fa-stop"></i>
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {isRTL ? 'برای ضبط دکمه میکروفون را فشار دهید' : 'Press the microphone button to start recording'}
        </p>
      </div>
    </div>
  );
}

// Inline Voice Player Component
interface VoicePlayerProps {
  recording: VoiceRecording;
  onRemove?: () => void;
}

export function VoicePlayer({ recording, onRemove }: VoicePlayerProps) {
  const { isRTL } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording.blobUrl) {
      audioRef.current = new Audio(recording.blobUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
      };
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [recording.blobUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (progressInterval.current) clearInterval(progressInterval.current);
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(pct) ? 0 : pct);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Generate static waveform
  const waveformBars = Array.from({ length: 30 }, (_, i) => {
    return 15 + Math.sin(i * 0.7) * 25 + Math.cos(i * 1.3) * 15;
  });

  return (
    <div className="my-3 mx-1 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-violet-100 dark:border-violet-800/30" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        {/* Play button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-md shadow-violet-500/30 hover:bg-violet-600 transition-colors flex-shrink-0"
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm ${!isPlaying ? 'mr-[-1px]' : ''}`}></i>
        </button>

        {/* Waveform & Progress */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-[2px] h-8">
            {waveformBars.map((h, i) => {
              const barProgress = (i / waveformBars.length) * 100;
              const isActive = barProgress <= progress;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-colors duration-100 ${
                    isActive ? 'bg-violet-500' : 'bg-violet-200 dark:bg-violet-800'
                  }`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-100 dark:bg-violet-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Time */}
        <span className="text-xs font-mono text-violet-600 dark:text-violet-400 flex-shrink-0 min-w-[40px] text-center">
          {formatTime(currentTime)} / {formatTime(recording.duration)}
        </span>

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center text-xs hover:bg-red-200 dark:hover:bg-red-900/50 flex-shrink-0"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
}
