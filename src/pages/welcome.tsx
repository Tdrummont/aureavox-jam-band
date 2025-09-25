import { Link } from "react-router-dom";
import { Music2, Mic2, Headphones, Sparkles, CalendarDays, Layers, ListMusic, Users2, MessageSquare, Rocket } from "lucide-react";

const DISCORD_URL = "https://discord.gg/seu-convite";
const ROADMAP_URL = "https://github.com/seu-org/aureavox/projects";
const TWITTER_URL = "https://x.com/aureavox";

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

      {/* sobre */}
      <section id="sobre" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Sobre o AureaVox</h2>
            <p className="mt-3 text-white/70">
              O AureaVox é um estúdio colaborativo na web para bandas e criadores.
              Centralize composições, ensaios, gravações e agenda; compartilhe idéias
              com sua equipe e leve tudo pronto para o palco.
            </p>
            <p className="mt-3 text-white/70">
              Nossa missão é reduzir a fricção criativa: menos logística, mais música.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ul className="space-y-2 text-sm text-white/70 list-disc pl-5">
              <li>Projetos com versões e comentários</li>
              <li>Upload e sincronização de trilhas</li>
              <li>Agenda de ensaios e shows com confirmações</li>
              <li>Setlists com anotações e exportação</li>
            </ul>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="recursos" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Projetos & versões", desc: "Controle de takes, comentários e histórico de alterações.", icon: Layers },
            { title: "Agenda inteligente", desc: "Marque ensaios e shows; convites e confirmações em 1 clique.", icon: CalendarDays },
            { title: "Setlists & palco", desc: "Monte setlists, anexe cifras/backs e gere PDF pro show.", icon: ListMusic },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-400">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* comunidade */}
      <section id="comunidade" className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users2 className="h-6 w-6 text-yellow-400" />
            Junte-se à Comunidade
          </h2>
          <p className="mt-3 text-white/70">
            Participe do nosso Discord, troque feedbacks e encontre colaboradores.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-500/90 text-black font-semibold inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Entrar no Discord
            </a>
            <a href={ROADMAP_URL} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 inline-flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Ver Roadmap
            </a>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 inline-flex items-center gap-2">
              <Users2 className="h-4 w-4" /> Seguir no X
            </a>
          </div>
        </div>
      </section>

      {/* rodapé */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="AureaVox" className="h-6 w-auto" />
                <span className="font-semibold text-white">ÁureaVox</span>
              </div>
              <p className="mt-3 text-white/60 max-w-md">
                Estúdio colaborativo para bandas e criadores. Organize ensaios, grave ideias
                e leve tudo pronto para o palco.
              </p>
            </div>
            <div>
              <h4 className="text-white/90 font-medium">Links</h4>
              <ul className="mt-3 space-y-2 text-white/60">
                <li><a href="#sobre" className="hover:text-white">Sobre</a></li>
                <li><a href="#recursos" className="hover:text-white">Recursos</a></li>
                <li><a href="#comunidade" className="hover:text-white">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/90 font-medium">Comunidade</h4>
              <ul className="mt-3 space-y-2 text-white/60">
                <li><a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-white">Discord</a></li>
                <li><a href={ROADMAP_URL} target="_blank" rel="noreferrer" className="hover:text-white">Roadmap</a></li>
                <li><a href={TWITTER_URL} target="_blank" rel="noreferrer" className="hover:text-white">X / Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-white/50">
            <span>© {new Date().getFullYear()} AureaVox. Todos os direitos reservados.</span>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#termos" className="hover:text-white">Termos</a>
              <a href="#privacidade" className="hover:text-white">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
