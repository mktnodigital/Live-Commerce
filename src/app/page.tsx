import { Activity, Cloud, Rocket, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200">
              <Cloud className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Next.js <span className="text-blue-600">Cloud-Native</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Arquitetura de alta disponibilidade projetada para Google Cloud Run.
            Zero legado, 100% performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Rocket className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg">Cloud Run</h3>
            <p className="text-sm text-slate-500">Auto-scaling e deploy serverless otimizado.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="font-bold text-lg">Cloud Build</h3>
            <p className="text-sm text-slate-500">CI/CD automatizado com segurança nativa.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Activity className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="font-bold text-lg">Health Check</h3>
            <p className="text-sm text-slate-500">Monitoramento nativo via /api/health.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
