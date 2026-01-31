"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
  useLocalParticipant,
  useRemoteParticipants,
  useConnectionState,
} from '@livekit/components-react';
import { RoomEvent, ConnectionState, RemoteParticipant } from 'livekit-client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Loader2, RotateCcw, Lock, Hand, Clock, 
  FileText, LogOut, UserX, Coffee, X
} from 'lucide-react';
import api from '@/lib/api/axios';
import { toast } from 'sonner';
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

interface Resource {
  id: number;
  title: string;
  file: string;
}

interface WaitInfo {
  message: string;
  openAt: Date;
}

interface JoinResponse {
  token: string;
  url: string;
  is_host: boolean;
  host_identity: string;
  effective_end_time: string;
  resources: Resource[];
}

function Modal({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function StudentLiveClassroom() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const { activeSlug } = useActiveOrg();
  
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [hostIdentity, setHostIdentity] = useState("");
  const [effectiveEndTime, setEffectiveEndTime] = useState<Date | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [waitInfo, setWaitInfo] = useState<WaitInfo | null>(null);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get<JoinResponse>(`/live/lessons/${lessonId}/join/`);
        
        setToken(data.token);
        setUrl(data.url);
        setHostIdentity(data.host_identity);
        setEffectiveEndTime(new Date(data.effective_end_time));
        setResources(data.resources || []);
        setIsLoading(false);

      } catch (e: any) {
        setIsLoading(false);
        if (e.response?.status === 403 && e.response?.data?.error === 'too_early') {
          setWaitInfo({
            message: e.response.data.message,
            openAt: new Date(e.response.data.open_at)
          });
        } else {
          toast.error("Failed to join session.");
        }
      }
    };

    if (lessonId) initSession();
  }, [lessonId]);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < window.innerHeight && window.innerWidth < 768) {
        setIsMobilePortrait(true);
      } else {
        setIsMobilePortrait(false);
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const handleDisconnect = () => {
    const basePath = activeSlug ? `/${activeSlug}` : '';
    router.push(`${basePath}/dashboard`);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-zinc-400 animate-pulse text-sm">Connecting to classroom...</p>
      </div>
    );
  }

  if (waitInfo) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-md max-w-md w-full shadow-2xl">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Class Not Started</h2>
          <p className="text-zinc-400 mb-6">{waitInfo.message}</p>
          <div className="bg-blue-900/20 text-blue-400 py-2 px-4 rounded-md text-sm inline-block">
            Opens at {waitInfo.openAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-md font-medium transition-colors">
            Refresh Status
          </button>
          <button onClick={handleDisconnect} className="mt-4 w-full text-zinc-500 hover:text-zinc-300 text-sm py-2">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div 
      className="relative bg-zinc-950 overflow-hidden"
      data-lk-theme="default"
      style={
        isMobilePortrait ? {
          width: "100vh", height: "100vw", transform: "rotate(90deg)",
          transformOrigin: "bottom left", position: "absolute",
          top: "-100vw", left: "0", zIndex: 50,
        } : { width: "100%", height: "100vh" }
      }
    >
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={url}
        connect={true}
        onDisconnected={handleDisconnect}
        className="h-full w-full"
      >
        <StudentClassroomWrapper 
          lessonId={lessonId}
          initialEndTime={effectiveEndTime}
          initialResources={resources}
          hostIdentity={hostIdentity}
        />
        
        {isMobilePortrait && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full z-[100] animate-pulse pointer-events-none">
            <div className="flex items-center gap-2 text-white text-xs font-bold">
              <RotateCcw className="h-3 w-3" />
              <span>Rotate device</span>
            </div>
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
}

interface StudentClassroomProps {
  lessonId: string;
  initialEndTime: Date | null;
  initialResources: Resource[];
  hostIdentity: string;
}

function StudentClassroomWrapper(props: StudentClassroomProps) {
  const participants = useRemoteParticipants();
  const roomState = useConnectionState();
  
  const isHostPresent = useMemo(() => {
    return participants.some((p: RemoteParticipant) => p.identity === props.hostIdentity);
  }, [participants, props.hostIdentity]);

  const isWaitingForHost = roomState === ConnectionState.Connected && !isHostPresent;

  return (
    <div className="relative h-full w-full">
      <div className={isWaitingForHost ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-500"}>
         <VideoConference />
      </div>

      {isWaitingForHost && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
           <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 text-center max-w-md animate-in fade-in zoom-in duration-300">
              <div className="relative mb-6 mx-auto w-fit">
                <Coffee className="h-16 w-16 text-zinc-500" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 animate-pulse">
                   <UserX className="h-4 w-4 text-black" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Waiting for Tutor</h2>
              <p className="text-zinc-400 mb-6">
                The class session is active, but the tutor hasn't joined the room yet. 
                Sit tight, they should be here shortly!
              </p>
              <div className="flex justify-center gap-2">
                 <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
              </div>
           </div>
        </div>
      )}

      <StudentRoomManager 
         {...props} 
         isWaitingForHost={isWaitingForHost} 
      />
    </div>
  );
}

interface StudentManagerProps extends StudentClassroomProps {
    isWaitingForHost: boolean;
}

function StudentRoomManager({ initialEndTime, initialResources, isWaitingForHost }: StudentManagerProps) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  
  const [endTime, setEndTime] = useState<Date | null>(initialEndTime);
  const [timeLeft, setTimeLeft] = useState("");
  const [isMicLocked, setIsMicLocked] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  useEffect(() => {
    if (isWaitingForHost) {
        localParticipant.setMicrophoneEnabled(false);
        localParticipant.setCameraEnabled(false);
    }
  }, [isWaitingForHost, localParticipant]);

  useEffect(() => {
    if (!room) return;

    const handleMetadata = (metadata: string | undefined) => {
      if (metadata) {
        try {
          const data = JSON.parse(metadata);
          setIsMicLocked(data.mic_locked);
          setIsCameraLocked(data.camera_locked);

          if (!isWaitingForHost) {
              if (data.mic_locked) localParticipant.setMicrophoneEnabled(false);
              if (data.camera_locked) localParticipant.setCameraEnabled(false);
          }
        } catch(e) { console.error(e); }
      }
    };

    const handleData = (payload: Uint8Array) => {
      const decoder = new TextDecoder();
      const strData = decoder.decode(payload);
      const data = JSON.parse(strData);
      
      if (data.type === 'TIME_EXTENDED') {
        setEndTime(new Date(data.new_end_time));
        toast.info(`Class time extended by ${data.minutes} minutes`);
      }
    };

    handleMetadata(room.metadata);

    room.on(RoomEvent.RoomMetadataChanged, handleMetadata);
    room.on(RoomEvent.DataReceived, handleData);

    return () => {
      room.off(RoomEvent.RoomMetadataChanged, handleMetadata);
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, localParticipant, isWaitingForHost]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!endTime) return;
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Class Ended");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  
  const raiseHand = async () => {
    const msg = JSON.stringify({ type: 'RAISE_HAND' });
    const encoder = new TextEncoder();
    await localParticipant.publishData(encoder.encode(msg), { reliable: true });
    toast.success("Hand raised! The tutor has been notified.");
  };

  const areControlsVisible = !isResourceModalOpen && !isWaitingForHost;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      
      <div className="absolute top-4 left-4 z-20 pointer-events-auto bg-black/60 backdrop-blur-md rounded-md p-2 text-white flex items-center gap-4 border border-white/10">
        <div className={`flex items-center gap-2 font-mono ${timeLeft === 'Class Ended' ? 'text-red-500' : 'text-green-400'}`}>
          <Clock className="h-4 w-4" />
          <span className="font-bold">{timeLeft}</span>
        </div>
        
        {!isWaitingForHost && (
            <div className="flex gap-2 text-xs">
                {isMicLocked && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-red-500/20">
                        <Lock className="h-3 w-3"/> Mic Locked
                    </span>
                )}
                {isCameraLocked && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-red-500/20">
                        <Lock className="h-3 w-3"/> Cam Locked
                    </span>
                )}
            </div>
        )}
      </div>

      {areControlsVisible && (
        <div className="absolute bottom-24 right-4 z-20 pointer-events-auto">
           <button 
             onClick={raiseHand}
             className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center group"
             title="Raise Hand"
           >
             <Hand className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      )}

      {initialResources.length > 0 && areControlsVisible && (
         <div className="absolute top-20 left-4 z-20 pointer-events-auto">
             <button 
               onClick={() => setIsResourceModalOpen(true)}
               className="bg-zinc-900/90 border border-zinc-700 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 text-sm hover:bg-zinc-800 transition-colors"
             >
                <FileText className="h-4 w-4" /> 
                Class Resources ({initialResources.length})
             </button>
         </div>
      )}

      {areControlsVisible && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
            <button 
                onClick={() => room.disconnect()}
                className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
                <LogOut className="h-4 w-4" />
                Leave Class
            </button>
        </div>
      )}

      <Modal 
        title="Class Resources" 
        isOpen={isResourceModalOpen} 
        onClose={() => setIsResourceModalOpen(false)}
      >
         <div className="space-y-4">
            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {initialResources.map((res) => (
                <li key={res.id} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                <a href={res.file} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-zinc-200 hover:text-blue-400 font-medium truncate w-full">
                    <FileText className="h-4 w-4 shrink-0" />
                    {res.title}
                </a>
                </li>
            ))}
            </ul>
         </div>
      </Modal>

    </div>
  );
}