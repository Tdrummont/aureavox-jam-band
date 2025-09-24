import { Link } from "react-router-dom";
import { Music2, Mic2, Headphones, Sparkles } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0e13] to-[#0b0e13]/95 text-white">
      {/* topo */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AureaVox" className="h-8 w-auto" />
          <span className="text-xl font-semibold tracking-wide text-yellow-400">AureaVox</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#sobre" className="hover:text-white">Sobre</a>
          <a href="#recursos" className="hover:text-white">Recursos</a>
          <a href="#comunidade" className="hover:text-white">Comunidade</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15">Entrar</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-500/90 text-black font-semibold">
            Criar conta
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Projeto piloto em expansão
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Colabore, crie e <span className="text-yellow-400">grave</span> sua música com o mundo
            </h1>
            <p className="mt-4 text-white/70">
              O AureaVox conecta músicos, produtores e bandas para compor, ensaiar e organizar shows.
              Tudo em um só lugar: projetos, agenda, setlists e versões.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="px-5 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-500/90 text-black font-semibold">
                Começar agora
              </Link>
              <Link to="/explorar" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15">
                Explorar projetos
              </Link>
            </div>
            <p className="mt-3 text-xs text-white/50">
              Sem cartão de crédito. Convide sua banda em segundos.
            </p>
          </div>

          {/* mock/hero card */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-yellow-500/20 blur-2xl opacity-30" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" className="h-6 w-auto" />
                  <span className="text-sm text-white/80">Session • AureaVox</span>
                </div>
                <span className="text-xs text-white/50">ao vivo</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-black/40 border border-white/10 p-4 flex flex-col items-center">
                  <Mic2 className="h-7 w-7 text-yellow-400" />
                  <span className="text-xs mt-2 text-white/70">Voz</span>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-4 flex flex-col items-center">
                  <Music2 className="h-7 w-7 text-yellow-400" />
                  <span className="text-xs mt-2 text-white/70">Guitarra</span>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-4 flex flex-col items-center">
                  <Headphones className="h-7 w-7 text-yellow-400" />
                  <span className="text-xs mt-2 text-white/70">Mix</span>
                </div>
              </div>
              <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-yellow-500/20 to-transparent border border-white/10 flex items-center justify-center text-white/60 text-xs">
                waveform • faixa 1 • 02:34
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="recursos" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Projetos & versões", desc: "Controle de takes, comentários e histórico de alterações." },
            { title: "Agenda inteligente", desc: "Marque ensaios e shows; convites e confirmações em 1 clique." },
            { title: "Setlists & palco", desc: "Monte setlists, anexe cifras/backs e gere PDF pro show." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-yellow-400">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* rodapé */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-white/50 flex items-center justify-between">
          <span>© {new Date().getFullYear()} AureaVox</span>
          <div className="flex gap-4">
            <a href="#sobre" className="hover:text-white">Sobre</a>
            <a href="#comunidade" className="hover:text-white">Comunidade</a>
            <a href="#contato" className="hover:text-white">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
