"use client";

import React, { useState, useEffect } from "react";
import {
  focusAudio,
  FOCUS_SOUND_TRACKS,
  FocusSoundType,
} from "@/lib/audio/FocusAudioEngine";
import {
  Volume2,
  VolumeX,
  Radio,
  Play,
  Square,
  Sparkles,
  CloudRain,
  Waves,
  Brain
} from "lucide-react";

export function FocusFrequencyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentType, setCurrentType] = useState<FocusSoundType | null>(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const unsubscribe = focusAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentType(state.currentType);
      setVolume(state.volume);
    });
    return unsubscribe;
  }, []);

  const handleSelectTrack = (type: FocusSoundType) => {
    focusAudio.play(type);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      focusAudio.stop();
    } else {
      // Default to 40 Hz Gamma wave if none selected
      focusAudio.play(currentType || "40hz");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    focusAudio.setVolume(val);
  };

  const getTrackIcon = (id: FocusSoundType) => {
    switch (id) {
      case "40hz":
        return <Brain className="w-3.5 h-3.5 text-blue-400" />;
      case "425hz":
        return <Waves className="w-3.5 h-3.5 text-blue-400" />;
      case "528hz":
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case "rain":
        return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
      case "brownNoise":
        return <Radio className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl surface-1 hairline-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 hairline-b">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg surface-2 hairline-border flex items-center justify-center text-blue-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Focus Audio Engine</h3>
              {isPlaying && (
                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Procedural 40 Hz & 425 Hz neural frequencies and rain soundscapes
            </p>
          </div>
        </div>

        {/* Global Play / Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isPlaying
              ? "bg-rose-600 hover:bg-rose-500 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Play Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Frequency / Track Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {FOCUS_SOUND_TRACKS.map((track) => {
          const isSelected = currentType === track.id && isPlaying;
          return (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(track.id)}
              className={`p-3 rounded-xl text-left transition-all hairline-border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-blue-600/15 border-blue-500 text-white"
                  : "surface-2 hover:bg-white/[0.05] text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getTrackIcon(track.id)}
                  <span className="text-xs font-semibold text-white truncate">
                    {track.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-blue-400 animate-[pulse_0.8s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-2 bg-blue-400 animate-[pulse_0.5s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-3.5 bg-blue-400 animate-[pulse_0.9s_ease-in-out_infinite]" />
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {track.description}
              </p>

              <div className="mt-2 pt-2 hairline-t flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{track.badge}</span>
                <span className={isSelected ? "text-blue-400 font-semibold" : ""}>
                  {track.frequencyLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume Bar & Active Info */}
      <div className="pt-2 hairline-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-[11px] font-medium text-slate-300 shrink-0">
            Audio Volume: {Math.round(volume * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full sm:w-36 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <span className="text-[11px] text-slate-500">
          Pure Web Audio Synthesis • Zero buffering • Offline ready
        </span>
      </div>
    </div>
  );
}
