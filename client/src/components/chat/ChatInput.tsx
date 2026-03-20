import { Camera, File as FileIcon, Mic, Paperclip, Send, Lightbulb, BrainCircuit, Dices } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type UploadedFile = {
  file: File;
  url: string;
  type: 'image' | 'document';
  name: string;
};

export default function ChatInput({ onSendMessage }: { onSendMessage: (msg: string, file?: File | null, fileUrl?: string) => void }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [glowing, setGlowing] = useState(true);

  // 3-second welcome glow on first load
  useEffect(() => {
    const timer = setTimeout(() => setGlowing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || selectedFile) {
      onSendMessage(text, selectedFile?.file, selectedFile?.url);
      setText("");
      setSelectedFile(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      setSelectedFile({
        file,
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : 'document',
        name: file.name
      });
    }
  };

  const clearFile = () => {
    if (selectedFile) URL.revokeObjectURL(selectedFile.url);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.start();
  };

  return (
    <div className="w-full relative px-4 pb-4">
      {/* Quick Actions (Hint, Concept) */}
      <div className="flex flex-wrap justify-center gap-2 mb-2.5 px-2">
        <button 
          type="button"
          onClick={() => onSendMessage("Can I get a hint?")} 
          className="px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#262626] shadow-sm text-xs font-bold text-yellow-500 hover:bg-[#1a1a1a] hover:border-yellow-500/30 transition-all flex items-center gap-1.5"
        >
          <Lightbulb size={14}/> Need a Hint?
        </button>
        <button 
          type="button"
          onClick={() => onSendMessage("Teach me a new concept")} 
          className="px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#262626] shadow-sm text-xs font-bold text-purple-400 hover:bg-[#1a1a1a] hover:border-purple-500/30 transition-all flex items-center gap-1.5"
        >
          <BrainCircuit size={14}/> Learn a Concept
        </button>
        <button 
          type="button"
          onClick={() => onSendMessage("Give me a random aptitude question")} 
          className="px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#262626] shadow-sm text-xs font-bold text-emerald-400 hover:bg-[#1a1a1a] hover:border-emerald-500/30 transition-all flex items-center gap-1.5"
        >
          <Dices size={14}/> Random Question
        </button>
      </div>

      {/* Upload Preview Preview */}
      {selectedFile && (
        <div className="absolute -top-16 left-4 bg-[#121212] p-2 rounded-xl shadow-lg border border-[#262626] flex items-center gap-3 animate-in slide-in-from-bottom-2 z-10">
          <button 
            type="button"
            onClick={clearFile}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#262626] text-white rounded-full flex items-center justify-center hover:bg-neutral-600 shadow-sm border border-[#333333]"
          >
            ×
          </button>
          {selectedFile.type === 'image' ? (
            <img src={selectedFile.url} alt="Upload preview" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-[#333333]" />
          ) : (
            <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center border border-pink-500/20">
              <FileIcon size={24} />
            </div>
          )}
          <div className="text-xs font-medium max-w-[120px] truncate text-neutral-300 pr-2">
            {selectedFile.name}
          </div>
        </div>
      )}

      <div className={`relative p-2 sm:p-3 bg-black rounded-[2rem] border transition-all duration-700 ${
        glowing
          ? "border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.25),0_0_30px_rgba(168,85,247,0.3)] animate-pulse"
          : "border-[#262626]"
      }`}>
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex gap-0.5 pb-1">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-neutral-400 hover:text-white hover:bg-[#262626] rounded-full transition-all" title="Upload Image or Document">
              <Paperclip size={20} />
            </button>
            <button type="button" onClick={() => cameraInputRef.current?.click()} className="p-2.5 text-neutral-400 hover:text-white hover:bg-[#262626] rounded-full transition-all hidden sm:block" title="Take a Photo">
              <Camera size={20} />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
            />
            <input 
              type="file" 
              ref={cameraInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
              capture="environment"
            />
          </div>

          <div className="flex-1 bg-[#121212] border border-[#262626] rounded-3xl overflow-hidden focus-within:ring-1 focus-within:ring-pink-500/50 transition-all duration-300">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask an aptitude question, attach an image..."
              className="w-full bg-transparent p-3.5 max-h-32 min-h-[50px] resize-none outline-none text-white placeholder:text-neutral-500 font-medium text-sm sm:text-base selection:bg-pink-500/30"
              rows={1}
            />
          </div>

          <div className="flex gap-1 pb-1 pr-1">
            {text.trim() || selectedFile ? (
              <button type="submit" className="flex items-center justify-center p-3.5 px-5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold rounded-full shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 leading-none group">
                Solve <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleVoiceInput}
                className={`p-3.5 rounded-full transition-all flex items-center justify-center shadow-sm ${
                  isListening 
                    ? 'bg-pink-500/20 text-pink-500 border border-pink-500/50 animate-pulse relative' 
                    : 'bg-[#262626] text-neutral-400 hover:bg-[#333333] hover:text-white border border-transparent'
                }`}
                title="Use Voice Input"
              >
                {isListening && <span className="absolute inset-0 rounded-full animate-ping bg-pink-500/30"></span>}
                <Mic size={18} className={isListening ? "relative z-10" : ""} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
