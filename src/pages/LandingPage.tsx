import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: '⚑',
    title: 'Feature Control',
    desc: 'Toggle features on or off in production without touching your code or redeploying.',
  },
  {
    icon: '◎',
    title: 'Targeting Rules',
    desc: 'Roll out to specific user IDs, emails, or entire domains with precision.',
  },
  {
    icon: '⬡',
    title: 'Environment Aware',
    desc: 'Separate flags for production, staging, and any custom environment you define.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F2EC' }}>

      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="font-semibold text-stone-800 tracking-tight">Feature Flag Service</span>
        </div>
        <Button
          variant="outline"
          className="border-stone-300 text-stone-700 hover:bg-stone-100"
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-block text-xs font-medium tracking-widest text-stone-400 uppercase mb-6">
          Open Source · Self-Hostable · REST API
        </span>

        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-tight max-w-2xl mb-6">
          Ship faster.<br />Break nothing.
        </h1>

        <p className="text-lg text-stone-500 max-w-md mb-10 leading-relaxed">
          Control every feature in production without redeploying. Built for developers who move fast and need confidence.
        </p>

        <div className="flex items-center gap-3">
          <Button
            className="bg-stone-800 hover:bg-stone-700 text-white px-6"
            onClick={() => navigate('/register')}
          >
            Get started free
          </Button>
          <Button
            variant="ghost"
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-200 px-6"
            onClick={() => navigate('/login')}
          >
            Sign in →
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-24 w-full max-w-4xl text-left">
          {features.map(f => (
            <Card key={f.title} className="bg-white border border-stone-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-2xl mb-4 text-stone-700">{f.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-stone-400">
        © 2026 Feature Flag Service
      </footer>
    </div>
  );
}
