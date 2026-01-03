import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseSentenceTrackerProps {
  onCookieEarned: (count: number) => void;
  onKindNote: (note: string) => void;
  mood?: string | null;
}

// Count valid sentences (ends with . ! ? and has at least 4 words)
const countValidSentences = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Split by sentence-ending punctuation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  // Count sentences with at least 4 words
  return sentences.filter(sentence => {
    const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length >= 4;
  }).length;
};

export const useSentenceTracker = ({ onCookieEarned, onKindNote, mood }: UseSentenceTrackerProps) => {
  const [lastSentenceCount, setLastSentenceCount] = useState(0);
  const isGeneratingNote = useRef(false);
  const noteQueue = useRef<number[]>([]);

  const generateKindNote = useCallback(async (text: string, sentenceCount: number) => {
    if (isGeneratingNote.current) {
      noteQueue.current.push(sentenceCount);
      return;
    }

    isGeneratingNote.current = true;

    try {
      const { data, error } = await supabase.functions.invoke('generate-kind-note', {
        body: { journalText: text, sentenceCount, mood }
      });

      if (error) {
        console.error('Error generating kind note:', error);
        // Use fallback notes
        const fallbackNotes = [
          `${sentenceCount} sentences! You're building something beautiful 🌱`,
          `Look at you go! ${sentenceCount} thoughtful sentences 💚`,
          `Every word counts. You've written ${sentenceCount} full thoughts! ✨`,
          `${sentenceCount} sentences of pure reflection. Keep flowing 🌊`,
        ];
        onKindNote(fallbackNotes[sentenceCount % fallbackNotes.length]);
      } else if (data?.note) {
        onKindNote(data.note);
      }
    } catch (err) {
      console.error('Failed to generate kind note:', err);
    } finally {
      isGeneratingNote.current = false;
      
      // Process queued notes
      if (noteQueue.current.length > 0) {
        const nextCount = noteQueue.current.pop();
        noteQueue.current = [];
        if (nextCount) {
          generateKindNote(text, nextCount);
        }
      }
    }
  }, [mood, onKindNote]);

  const trackText = useCallback((text: string) => {
    const currentCount = countValidSentences(text);
    
    if (currentCount > lastSentenceCount) {
      const newCookies = currentCount - lastSentenceCount;
      setLastSentenceCount(currentCount);
      onCookieEarned(newCookies);
      
      // Generate kind note for milestones (every sentence)
      generateKindNote(text, currentCount);
    }
    
    return currentCount;
  }, [lastSentenceCount, onCookieEarned, generateKindNote]);

  const reset = useCallback(() => {
    setLastSentenceCount(0);
  }, []);

  return { trackText, sentenceCount: lastSentenceCount, reset };
};
