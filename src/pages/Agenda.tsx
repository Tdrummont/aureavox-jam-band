import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addEvent, getEvents, updateEvent, deleteEvent as removeEvent, BandEvent, EventType } from "@/services/eventsService";
import { Calendar, Plus, Clock, MapPin, Users, Music2, Mic } from "lucide-react";

const Agenda = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<BandEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BandEvent | null>(null);
  const [filter, setFilter] = useState<"all" | EventType>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [form, setForm] = useState({
    title: "",
    type: "rehearsal" as EventType,
    date: "",
    time: "",
    duration: "",
    location: "",
    setlist: "",
    notes: "",
  });

  useEffect(() => {
    (async () => {
      const list = await getEvents({ type: filter, from, to, page, per_page: perPage });
      setEvents(list);
    })();
  }, [filter, from, to, page, perPage]);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  const parseLocalDate = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const todayLocalYMD = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const upcomingEvents = useMemo(
    () => filteredEvents.filter(event => parseLocalDate(event.date) >= parseLocalDate(todayLocalYMD())),
    [filteredEvents]
  );
  const todayEvents = useMemo(
    () => filteredEvents.filter(event => event.date === todayLocalYMD()),
    [filteredEvents]
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rehearsal':
        return <Mic className="w-5 h-5" />;
      case 'show':
        return <Music2 className="w-5 h-5" />;
      case 'recording':
        return <Clock className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'rehearsal':
        return 'default';
      case 'show':
        return 'secondary';
      case 'recording':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'rehearsal':
        return 'Ensaio';
      case 'show':
        return 'Show';
      case 'recording':
        return 'Gravação';
      default:
        return 'Evento';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = parseLocalDate(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: "", type: "rehearsal", date: "", time: "", duration: "", location: "", setlist: "", notes: "" });
  };

  const handleOpenNew = () => {
    resetForm();
    setOpen(true);
  };

  const handleEditClick = (event: BandEvent) => {
    setEditing(event);
    setForm({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      duration: event.duration ?? "",
      location: event.location ?? "",
      setlist: event.setlist ?? "",
      notes: event.notes ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date || !form.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, data e hora.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editing) {
        await updateEvent(editing.id, {
          title: form.title.trim(),
          type: form.type,
          date: form.date,
          time: form.time,
          duration: form.duration || null,
          location: form.location || null,
          setlist: form.setlist || null,
          notes: form.notes || null,
        });
      } else {
        await addEvent({
          title: form.title.trim(),
          type: form.type,
          date: form.date,
          time: form.time,
          duration: form.duration || null,
          location: form.location || null,
          setlist: form.setlist || null,
          notes: form.notes || null,
        });
      }
      const list = await getEvents({ type: filter, from, to, page, per_page: perPage });
      setEvents(list);
      setOpen(false);
      const created = !editing;
      resetForm();
      toast({ title: created ? "Evento criado" : "Evento atualizado", description: created ? "Seu evento foi adicionado à agenda." : "As alterações foram salvas." });
    } catch (err) {
      toast({ title: editing ? "Erro ao atualizar evento" : "Erro ao criar evento", description: err instanceof Error ? err.message : "Tente novamente.", variant: "destructive" });
    }
  };

  const handleDelete = async (event: BandEvent) => {
    if (!confirm(`Remover o evento "${event.title}"?`)) return;
    try {
      await removeEvent(event.id);
      const list = await getEvents({ type: filter, from, to, page, per_page: perPage });
      setEvents(list);
      toast({ title: "Evento removido", description: "O evento foi excluído da agenda." });
    } catch (err) {
      toast({ title: "Erro ao remover", description: err instanceof Error ? err.message : "Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Organize seus ensaios, shows e gravações</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all" onClick={handleOpenNew}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Ensaio da banda" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v: EventType) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rehearsal">Ensaio</SelectItem>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="recording">Gravação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input id="time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Input id="duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Ex: 2h" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: Estúdio Central" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="setlist">Setlist</Label>
                <Input id="setlist" value={form.setlist} onChange={e => setForm({ ...form, setlist: e.target.value })} placeholder="Opcional" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Detalhes importantes" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Atualizar" : "Salvar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="bg-gradient-hero border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.map((event) => (
              <div key={event.id} className="bg-black/20 rounded-lg p-4 text-primary-foreground">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge variant="secondary" className="text-primary-foreground bg-primary-foreground/20">
                    {event.time}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.participants.filter(p => p.confirmed).length}/{event.participants.length}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Calendar View Toggle */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Lista</Button>
              <Button variant="ghost" size="sm">Calendário</Button>
              <Button variant="ghost" size="sm">Semana</Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant={filter === "all" ? "outline" : "ghost"} size="sm" onClick={() => { setFilter("all"); setPage(1); }}>Todos</Button>
              <Button variant={filter === "rehearsal" ? "outline" : "ghost"} size="sm" onClick={() => { setFilter("rehearsal"); setPage(1); }}>Ensaios</Button>
              <Button variant={filter === "show" ? "outline" : "ghost"} size="sm" onClick={() => { setFilter("show"); setPage(1); }}>Shows</Button>
              <Button variant={filter === "recording" ? "outline" : "ghost"} size="sm" onClick={() => { setFilter("recording"); setPage(1); }}>Gravações</Button>
              <div className="flex items-center gap-2 ml-2">
                <Input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} className="h-8 w-[140px]" />
                <span className="text-xs text-muted-foreground">até</span>
                <Input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} className="h-8 w-[140px]" />
                <Input type="number" min={5} max={50} value={perPage} onChange={e => { setPerPage(Math.max(5, Math.min(50, Number(e.target.value) || 10))); setPage(1); }} className="h-8 w-[80px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Próximos Eventos</h2>
        
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="group cursor-pointer transition-all duration-300 hover:shadow-musical bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getEventColor(event.type)}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">{event.time}</div>
                  <div className="text-sm text-muted-foreground">{event.duration}</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  {event.setlist && (
                    <div className="flex items-center gap-2 text-sm">
                      <Music2 className="w-4 h-4 text-muted-foreground" />
                      <span>{event.setlist}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {event.participants.filter(p => p.confirmed).length} de {event.participants.length} confirmados
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.participants.map((participant, index) => (
                      <Badge 
                        key={index}
                        variant={participant.confirmed ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {participant.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {event.notes && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Observações:</strong> {event.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleEditClick(event)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(event)}>
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</Button>
          <div className="text-xs text-muted-foreground">Página {page}</div>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)}>Próxima</Button>
        </div>
      </div>

      {/* Empty State */}
      {upcomingEvents.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento agendado</h3>
            <p className="text-muted-foreground mb-6">
              Organize seus ensaios e apresentações
            </p>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Agendar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Agenda;