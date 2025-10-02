import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface VoiceCallProps {
  caller: {
    name: string;
    avatar: string;
  };
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function VoiceCall({ caller, onAccept, onDecline }: VoiceCallProps) {
  const [isRinging, setIsRinging] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playVKRingtone = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      const ctx = audioContextRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);

      const playTone = (frequency: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
        gain.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const startRingtone = () => {
        const currentTime = ctx.currentTime;
        const pattern = [
          { freq: 1046.5, time: 0, duration: 0.15 },
          { freq: 1174.7, time: 0.15, duration: 0.15 },
          { freq: 1318.5, time: 0.3, duration: 0.3 },
          { freq: 1046.5, time: 0.8, duration: 0.15 },
          { freq: 1174.7, time: 0.95, duration: 0.15 },
          { freq: 1318.5, time: 1.1, duration: 0.3 },
        ];

        pattern.forEach(({ freq, time, duration }) => {
          playTone(freq, currentTime + time, duration);
        });

        setTimeout(() => {
          if (isRinging) {
            startRingtone();
          }
        }, 2000);
      };

      startRingtone();
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
  };

  const stopRingtone = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (isRinging) {
      playVKRingtone();
    }

    return () => {
      stopRingtone();
    };
  }, [isRinging]);

  useEffect(() => {
    if (isInCall) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInCall]);

  const handleAccept = () => {
    setIsRinging(false);
    setIsInCall(true);
    stopRingtone();
    onAccept?.();
  };

  const handleDecline = () => {
    setIsRinging(false);
    stopRingtone();
    onDecline?.();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRinging && !isInCall) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        {isRinging && (
          <>
            <div className="relative mx-auto w-32 h-32">
              <img
                src={caller.avatar}
                alt={caller.name}
                className="w-32 h-32 rounded-full object-cover animate-pulse"
              />
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-75"></div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">{caller.name}</h3>
              <p className="text-gray-500 flex items-center justify-center gap-2">
                <Icon name="Phone" size={18} className="animate-bounce" />
                Входящий вызов...
              </p>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
                onClick={handleAccept}
              >
                <Icon name="Phone" size={24} />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={handleDecline}
              >
                <Icon name="PhoneOff" size={24} />
              </Button>
            </div>
          </>
        )}

        {isInCall && (
          <>
            <div className="relative mx-auto w-32 h-32">
              <img
                src={caller.avatar}
                alt={caller.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {formatDuration(callDuration)}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">{caller.name}</h3>
              <p className="text-green-600 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Идёт разговор
              </p>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14"
              >
                <Icon name="Mic" size={20} />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16"
                onClick={handleDecline}
              >
                <Icon name="PhoneOff" size={24} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14"
              >
                <Icon name="Volume2" size={20} />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
