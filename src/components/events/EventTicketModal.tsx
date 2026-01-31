"use client";

import React from "react";
import { X, Ticket, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface EventTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  eventTitle: string;
  isDownloading?: boolean;
}

const Loader2 = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export const EventTicketModal: React.FC<EventTicketModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  eventTitle,
  isDownloading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95%] sm:max-w-[480px] p-0 gap-0 border-border/80 rounded-md bg-background overflow-hidden [&>button]:hidden transition-all duration-300 top-[5%] md:top-[10%] translate-y-0 shadow-none"
      >
        <DialogHeader className="px-4 md:px-6 py-4 border-b bg-muted/50 flex flex-row items-center justify-between shrink-0 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#2694C6]/10 flex items-center justify-center shrink-0 border border-[#2694C6]/20">
              <Ticket className="h-4 w-4 text-[#2694C6]" />
            </div>
            <DialogTitle className="text-base md:text-lg font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-xs">
              Event Ticket
            </DialogTitle>
          </div>
          <DialogClose className="rounded-md p-2 hover:bg-muted transition -mr-2">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </DialogClose>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h4 className="font-black uppercase text-xs tracking-widest text-muted-foreground">Entry Pass For</h4>
              <p className="font-black text-lg text-foreground uppercase tracking-tight leading-tight">
                {eventTitle}
              </p>
            </div>

            <div className="bg-muted/30 border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center gap-4">
               <Ticket size={48} className="text-muted-foreground/30" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                 Your official PDF ticket includes <br/> a unique secure QR code
               </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-md p-3 flex gap-3 items-start">
              <Info className="h-4 w-4 text-[#2694C6] shrink-0 mt-0.5" />
              <p className="text-[10px] md:text-[11px] text-blue-700 font-bold uppercase tracking-wider leading-normal">
                Please have your QR code ready at the entrance for a smooth check-in.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-4 border-t bg-muted/20 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0 mt-auto">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="h-11 md:h-10 w-full sm:w-auto px-6 rounded-md font-bold text-[11px] md:text-xs uppercase tracking-widest border-border shadow-none bg-background"
          >
            Close
          </Button>
          <Button 
            onClick={onDownload} 
            disabled={isDownloading}
            className="h-11 md:h-10 w-full sm:w-auto px-6 rounded-md font-bold text-[11px] md:text-xs uppercase tracking-widest shadow-none bg-[#2694C6] hover:bg-[#1e7ca8] text-white"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download size={14} />
                <span>Download PDF Ticket</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};