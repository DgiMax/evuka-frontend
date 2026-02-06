"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useRoomContext,
  useLocalParticipant,
  useRemoteParticipants,
  useConnectionState,
  useTracks,
  LayoutContextProvider,
} from '@livekit/components-react';
import { RoomEvent, ConnectionState, RemoteParticipant, Track } from 'livekit-client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Lock, Unlock, Hand, Clock, 
  FileText, Coffee, X, Maximize, Minimize, Download, Inbox, MessageSquare, Mic, MicOff, Video, VideoOff, Monitor
} from 'lucide-react';
import { motion } from "framer-motion";
import api from '@/lib/api/axios';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

interface Resource {
  id: number;
  title: string;
  file: string;
}

interface JoinResponse {
    token: string;
    url: string;
    is_host: boolean;
    host_identity: string;
    effective_end_datetime: string;
    resources: Resource[];
    mic_locked: boolean;
    camera_locked: boolean;
    screen_locked: boolean;
    course_slug: string;
}

interface EvukaLivePlayerProps {
  onExit: () => void;
  idOrSlug?: string;
  type: 'lesson' | 'event';
}

function Modal({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950 shrink-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-zinc-950 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EvukaLivePlayer({ onExit, idOrSlug, type }: EvukaLivePlayerProps) {
  const params = useParams();
  const router = useRouter();
  const { activeSlug } = useActiveOrg();
  
  const activeId = idOrSlug || (type === 'lesson' ? params?.lessonId : params?.slug) as string;
  
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [hostIdentity, setHostIdentity] = useState("");
  const [effectiveEndTime, setEffectiveEndTime] = useState<Date | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [initialMicLocked, setInitialMicLocked] = useState(false);
  const [initialCameraLocked, setInitialCameraLocked] = useState(false);
  const [initialScreenLocked, setInitialScreenLocked] = useState(false);
  const [courseSlug, setCourseSlug] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [waitInfo, setWaitInfo] = useState<{message: string, openAt: Date} | null>(null);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(type === 'event');

  const baseApiUrl = type === 'lesson' 
    ? `/live/lessons/${activeId}/` 
    : `/events/registered-events/${activeId}/`;

  const handleExit = useCallback(() => {
    if (type === 'lesson' && courseSlug) {
        router.push(`/course-learning/${courseSlug}`);
    } else if (type === 'event') {
        const basePath = activeSlug ? `/${activeSlug}` : '';
        router.push(`${basePath}/dashboard/registered-events`);
    } else {
        onExit();
    }
  }, [courseSlug, router, onExit, type, activeSlug]);

  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      if (!activeId) return;
      try {
        setIsLoading(true);
        const { data } = await api.get<JoinResponse>(`${baseApiUrl}join/`);
        if (!isMounted) return;
        
        setToken(data.token);
        setUrl(data.url);
        setHostIdentity(data.host_identity);
        setEffectiveEndTime(new Date(data.effective_end_datetime));
        setResources(data.resources || []);
        setInitialMicLocked(data.mic_locked);
        setInitialCameraLocked(data.camera_locked);
        setInitialScreenLocked(data.screen_locked || false);
        setCourseSlug(data.course_slug);
        setIsLoading(false);
      } catch (e: any) {
        if (!isMounted) return;
        setIsLoading(false);
        if (e.response?.status === 403 && e.response?.data?.error === 'too_early') {
          setWaitInfo({ message: e.response.data.message, openAt: new Date(e.response.data.open_at) });
        } else {
          toast.error("Failed to join session.");
        }
      }
    };
    initSession();
    return () => { isMounted = false; };
  }, [activeId, baseApiUrl]);

  useEffect(() => {
    const check = () => setIsMobilePortrait(window.innerWidth < window.innerHeight && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleFullscreen = () => {
    if (type === 'event') return;
    setIsFullscreen(!isFullscreen);
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden z-[500]">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <motion.div animate={{ rotate: [0, 360], borderRadius: ["15%", "0%", "15%"] }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} className="absolute h-16 w-16 border-2 border-[#2694C6]/30" />
          <motion.div animate={{ scale: [0.6, 1, 0.6], rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="h-8 w-8 bg-[#2694C6] rounded-sm shadow-xl shadow-[#2694C6]/20" />
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#2694C6]/90 animate-pulse font-sans">Joining Session</motion.p>
      </div>
    );
  }

  if (waitInfo) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center z-[500] font-sans">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-md max-w-md w-full shadow-2xl">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">{type === 'event' ? 'Event Not Started' : 'Class Not Started'}</h2>
          <p className="text-zinc-400 text-sm mb-6">{waitInfo.message}</p>
          <div className="bg-blue-900/20 text-blue-400 py-2 px-4 rounded-md text-xs font-bold inline-block uppercase tracking-widest">
            Opens at {waitInfo.openAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-md text-xs font-black uppercase transition-colors">Refresh Status</button>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div 
      className={cn(
        "bg-zinc-950 overflow-hidden relative font-sans",
        isFullscreen ? "fixed inset-0 w-screen h-screen z-[200]" : "relative w-full aspect-video min-h-[500px] rounded-md border border-zinc-900"
      )}
      style={isMobilePortrait && isFullscreen ? { width: "100vh", height: "100vw", transform: "rotate(90deg)", transformOrigin: "bottom left", position: "absolute", top: "-100vw", left: "0" } : {}}
    >
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={url}
        connect={true}
        onDisconnected={handleExit}
        className="h-full w-full relative flex flex-col overflow-hidden"
      >
        <LayoutContextProvider>
            <StudentClassroomWrapper 
              type={type}
              initialEndTime={effectiveEndTime}
              resources={resources}
              setResources={setResources}
              hostIdentity={hostIdentity}
              onExit={handleExit}
              initialMicLocked={initialMicLocked}
              initialCameraLocked={initialCameraLocked}
              initialScreenLocked={initialScreenLocked}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
        </LayoutContextProvider>
      </LiveKitRoom>
    </div>
  );
}

function StudentClassroomWrapper(props: any) {
  const participants = useRemoteParticipants();
  const roomState = useConnectionState();
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }]);
  const isHostPresent = useMemo(() => participants.some((p: RemoteParticipant) => p.identity === props.hostIdentity), [participants, props.hostIdentity]);
  const isWaitingForHost = roomState === ConnectionState.Connected && !isHostPresent;

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full bg-zinc-950 relative">
      <div className="relative flex-1 flex flex-col min-w-0 h-full">
        <div className={cn("flex-1 relative overflow-hidden", isWaitingForHost ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-500")}>
           <GridLayout tracks={tracks}>
              <ParticipantTile />
           </GridLayout>
        </div>

        {isWaitingForHost && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 text-white">
             <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 text-center max-w-md">
                <Coffee className="h-16 w-16 text-zinc-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">
                  {props.type === 'event' ? 'Waiting for Host' : 'Waiting for Tutor'}
                </h2>
                <p className="text-zinc-400 text-xs">The host hasn't joined the room yet. Please stay tuned.</p>
             </div>
          </div>
        )}

        <StudentRoomManager {...props} isWaitingForHost={isWaitingForHost} />
      </div>
    </div>
  );
}

function StudentRoomManager({ type, initialEndTime, resources, setResources, onExit, initialMicLocked, initialCameraLocked, initialScreenLocked, isWaitingForHost, toggleFullscreen, isFullscreen }: any) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [endTime, setEndTime] = useState<Date | null>(initialEndTime);
  const [timeLeft, setTimeLeft] = useState("");
  const [isMicLocked, setIsMicLocked] = useState(initialMicLocked);
  const [isCameraLocked, setIsCameraLocked] = useState(initialCameraLocked);
  const [isScreenLocked, setIsScreenLocked] = useState(initialScreenLocked);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const hasWarnedRef = useRef(false);

  const syncHardwareLocks = useCallback((micLocked: boolean, camLocked: boolean, screenLocked: boolean) => {
    setIsMicLocked(micLocked);
    setIsCameraLocked(camLocked);
    setIsScreenLocked(screenLocked);
    
    if (micLocked && !handRaised) localParticipant.setMicrophoneEnabled(false);
    if (camLocked && !handRaised) localParticipant.setCameraEnabled(false);
    if (screenLocked && !handRaised) localParticipant.setScreenShareEnabled(false);
  }, [localParticipant, handRaised]);

  useEffect(() => {
    if (localParticipant) {
      if (isWaitingForHost) {
        localParticipant.setMicrophoneEnabled(false);
        localParticipant.setCameraEnabled(false);
        localParticipant.setScreenShareEnabled(false);
      } else {
        syncHardwareLocks(initialMicLocked, initialCameraLocked, initialScreenLocked);
      }
    }
  }, [localParticipant, isWaitingForHost, initialMicLocked, initialCameraLocked, initialScreenLocked, syncHardwareLocks]);

  useEffect(() => {
    const lockInterval = setInterval(() => {
      if (isWaitingForHost) {
        if (localParticipant.isMicrophoneEnabled) localParticipant.setMicrophoneEnabled(false);
        if (localParticipant.isCameraEnabled) localParticipant.setCameraEnabled(false);
        if (localParticipant.isScreenShareEnabled) localParticipant.setScreenShareEnabled(false);
        return;
      }

      if (isMicLocked && localParticipant.isMicrophoneEnabled && !handRaised) {
        localParticipant.setMicrophoneEnabled(false);
      }
      if (isCameraLocked && localParticipant.isCameraEnabled && !handRaised) {
        localParticipant.setCameraEnabled(false);
      }
      if (isScreenLocked && localParticipant.isScreenShareEnabled && !handRaised) {
        localParticipant.setScreenShareEnabled(false);
      }
    }, 100);
    return () => clearInterval(lockInterval);
  }, [isMicLocked, isCameraLocked, isScreenLocked, localParticipant, handRaised, isWaitingForHost]);

  useEffect(() => {
    if (!room) return;
    const handleData = (payload: Uint8Array) => {
      const data = JSON.parse(new TextDecoder().decode(payload));
      if (data.type === 'PERMISSION_UPDATE') syncHardwareLocks(data.mic_locked, data.camera_locked, data.screen_locked);
      if (data.type === 'CLEAR_HANDS') {
        setHandRaised(false);
        syncHardwareLocks(isMicLocked, isCameraLocked, isScreenLocked);
      }
      if (data.type === 'TIME_EXTENDED') {
        setEndTime(new Date(data.new_end_time));
        hasWarnedRef.current = false;
      }
      if (data.type === 'RESOURCE_ADDED') {
        setResources((prev: any) => prev.some((r: any) => r.id === data.resource.id) ? prev : [...prev, data.resource]);
      }
    };
    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, syncHardwareLocks, setResources, isMicLocked, isCameraLocked, isScreenLocked]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!endTime) return;
      const diff = endTime.getTime() - new Date().getTime();
      if (diff <= 30000 && diff > 0 && !hasWarnedRef.current) {
        toast.warning("Session ends in 30 seconds.");
        hasWarnedRef.current = true;
      }
      if (diff <= 0) {
        clearInterval(timer);
        onExit();
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, onExit]);

  const raiseHand = async () => {
    if (handRaised || isWaitingForHost) return;
    await localParticipant.publishData(new TextEncoder().encode(JSON.stringify({ type: 'RAISE_HAND' })), { reliable: true });
    setHandRaised(true);
    toast.success("Hand raised!");
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden font-sans">
      <div className="absolute top-4 left-4 z-20 pointer-events-auto bg-black/60 backdrop-blur-md rounded-md p-2 text-white border border-white/10 flex items-center gap-2">
        <Clock className="h-3 w-3" />
        <span className="font-bold text-xs">{timeLeft}</span>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-4 bg-black/40 backdrop-blur-xl p-3 px-6 rounded-2xl border border-white/10 shadow-2xl">
         <div className="group relative">
           <button 
             onClick={() => localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled)}
             disabled={(isMicLocked && !handRaised) || isWaitingForHost}
             className={cn(
               "p-3 rounded-full transition-all active:scale-90",
               localParticipant.isMicrophoneEnabled ? "bg-zinc-800 text-white" : "bg-red-500/20 text-red-500",
               ((isMicLocked && !handRaised) || isWaitingForHost) && "opacity-40 cursor-not-allowed grayscale"
             )}
           >
             {localParticipant.isMicrophoneEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
           </button>
           {((isMicLocked && !handRaised) || isWaitingForHost) && (
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {isWaitingForHost ? 'Disabled in Waiting Mode' : 'Locked by Tutor'}
             </div>
           )}
         </div>

         <div className="group relative">
           <button 
             onClick={() => localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled)}
             disabled={(isCameraLocked && !handRaised) || isWaitingForHost}
             className={cn(
               "p-3 rounded-full transition-all active:scale-90",
               localParticipant.isCameraEnabled ? "bg-zinc-800 text-white" : "bg-red-500/20 text-red-500",
               ((isCameraLocked && !handRaised) || isWaitingForHost) && "opacity-40 cursor-not-allowed grayscale"
             )}
           >
             {localParticipant.isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
           </button>
           {((isCameraLocked && !handRaised) || isWaitingForHost) && (
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
               {isWaitingForHost ? 'Disabled in Waiting Mode' : 'Locked by Tutor'}
             </div>
           )}
         </div>

         <div className="group relative">
           <button 
             onClick={() => localParticipant.setScreenShareEnabled(!localParticipant.isScreenShareEnabled)}
             disabled={(isScreenLocked && !handRaised) || isWaitingForHost}
             className={cn(
               "p-3 rounded-full transition-all active:scale-90",
               localParticipant.isScreenShareEnabled ? "bg-blue-500 text-white" : "bg-zinc-800 text-white",
               ((isScreenLocked && !handRaised) || isWaitingForHost) && "opacity-40 cursor-not-allowed grayscale"
             )}
           >
             <Monitor className="h-5 w-5" />
           </button>
           {((isScreenLocked && !handRaised) || isWaitingForHost) && (
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
               {isWaitingForHost ? 'Disabled in Waiting Mode' : 'Locked by Tutor'}
             </div>
           )}
         </div>

         <div className="group relative">
           <button disabled className="p-3 rounded-full bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50">
             <MessageSquare className="h-5 w-5" />
           </button>
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">Under Development</div>
         </div>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
          <button 
            onClick={toggleFullscreen} 
            disabled={type === 'event'}
            className={cn(
              "bg-black/60 backdrop-blur-md text-white p-2 rounded-md border border-white/10 hover:bg-zinc-800 transition-colors shadow-lg active:scale-95",
              type === 'event' && "opacity-40 cursor-not-allowed grayscale"
            )}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase shadow-xl transition-colors">Exit</button>
      </div>

      {!isResourceModalOpen && !isWaitingForHost && (
        <div className="absolute top-20 left-4 z-20 pointer-events-auto flex flex-col gap-3 w-48 animate-in slide-in-from-left-4 fade-in duration-300">
          <div className="bg-zinc-950/90 backdrop-blur-md p-3 rounded-md border border-zinc-800 space-y-2 shadow-lg">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Permissions</h4>
            <div className={cn("flex items-center justify-between px-3 py-2 rounded-md text-xs", isMicLocked ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-zinc-900 text-zinc-400 border-transparent")}>
              <span className="flex items-center gap-2">{isMicLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />} Mic</span>
              <span className="text-[9px] uppercase font-bold opacity-60">{isMicLocked ? 'Locked' : 'On'}</span>
            </div>
            <div className={cn("flex items-center justify-between px-3 py-2 rounded-md text-xs border", isCameraLocked ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-zinc-900 text-zinc-400 border-transparent")}>
              <span className="flex items-center gap-2">{isCameraLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />} Cam</span>
              <span className="text-[9px] uppercase font-bold opacity-60">{isCameraLocked ? 'Locked' : 'On'}</span>
            </div>
            <div className={cn("flex items-center justify-between px-3 py-2 rounded-md text-xs border", isScreenLocked ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-zinc-900 text-zinc-400 border-transparent")}>
              <span className="flex items-center gap-2">{isScreenLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />} Screen</span>
              <span className="text-[9px] uppercase font-bold opacity-60">{isScreenLocked ? 'Locked' : 'On'}</span>
            </div>
          </div>

          <div className="bg-zinc-950/90 backdrop-blur-md p-3 rounded-md border border-zinc-800 space-y-2 shadow-lg">
             <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Actions</h4>
             <button onClick={raiseHand} disabled={handRaised} className={cn("w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-black uppercase transition-all shadow-lg active:scale-95", handRaised ? "bg-blue-600/20 text-blue-400 border border-blue-500/50" : "bg-blue-600 text-white hover:bg-blue-700")}>
               <Hand className={cn("h-3.5 w-3.5", handRaised && "animate-pulse")} /> {handRaised ? "Raised" : "Raise Hand"}
             </button>
             <button onClick={() => setIsResourceModalOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/5 shadow-lg active:scale-95 transition-all"><FileText className="h-3.5 w-3.5" /> Resources</button>
          </div>
        </div>
      )}

      <Modal title="Class Resources" isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)}>
         <div className="h-full flex flex-col bg-zinc-950">
            {resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 bg-zinc-900 rounded-lg border border-zinc-800 border-dashed">
                    <Inbox className="h-10 w-10 mb-4 opacity-20" /><p className="text-[10px] font-black uppercase tracking-[0.2em]">No materials yet</p>
                </div>
            ) : (
                <ul className="space-y-2">
                {resources.map((res: any) => (
                    <li key={res.id} className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-zinc-800 transition-colors group">
                    <a href={res.file} download target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-200 hover:text-blue-400 font-bold truncate w-full"><FileText className="h-4 w-4 shrink-0 text-blue-500" />{res.title}</a>
                    <Download className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </li>
                ))}
                </ul>
            )}
         </div>
      </Modal>

      <style jsx global>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }`}</style>
    </div>
  );
}