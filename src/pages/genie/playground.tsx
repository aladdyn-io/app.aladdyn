import { Sparkles } from 'lucide-react';
import { getCurrentGenieId } from '@/lib/utils';

export function GeniePlayground() {
  const genieId = getCurrentGenieId();

  return (
    <div className=" flex flex-col items-center justify-center py-8 px-2">
      <div className="max-w-xl w-full mx-auto mb-8 text-center">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">Genie Playground</h1>
        <p className="text-base text-gray-600 mb-1">Interact with your AI Genie in a beautiful, distraction-free environment.</p>
        <p className="text-sm text-gray-400">Your Genie ID: <span className="font-mono text-emerald-700">{genieId}</span></p>
      </div>
      <div className="w-full flex justify-center">
        <div className="rounded-2xl shadow-xl bg-white/90 border border-emerald-100 p-0 flex items-center justify-center w-full max-w-3xl mx-auto">
          <iframe
            src={`https://widget.aladdyn.io/${genieId}`}
            title="Genie Chatbot Widget"
            className="rounded-2xl w-full"
            style={{
              border: 'none',
              width: '100%',
              minWidth: 280,
              maxWidth: '100%',
              height: '80vh',
              minHeight: 400,
              maxHeight: 900,
              background: 'transparent',
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
            }}
            allow="clipboard-write; microphone;"
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          iframe {
            min-width: 0 !important;
            height: 60vh !important;
            min-height: 320px !important;
            max-height: 600px !important;
          }
        }
      `}</style>
    </div>
  );
}
