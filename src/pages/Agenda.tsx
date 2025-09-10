import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin, Users, Music2, Mic } from "lucide-react";

const Agenda = () => {
  const events = [
    {
      id: 1,
      title: "Ensaio da Banda Aurea",
      type: "rehearsal",
      date: "2024-01-15",
      time: "19:00",
      duration: "3h",
      location: "Estúdio Central - Sala 2",
      participants: [
        { name: "João", confirmed: true },
        { name: "Maria", confirmed: true },
        { name: "Carlos", confirmed: false },
        { name: "Ana", confirmed: true }
      ],
      setlist: "Rock Classics Vol. 1",
      notes: "Focar na transição entre as músicas 3 e 4"
    },
    {
      id: 2,
      title: "Show no Bar do Rock",
      type: "show",
      date: "2024-01-20",
      time: "21:30",
      duration: "2h",
      location: "Bar do Rock - Palco Principal",
      participants: [
        { name: "João", confirmed: true },
        { name: "Maria", confirmed: true },
        { name: "Carlos", confirmed: true },
        { name: "Ana", confirmed: true }
      ],
      setlist: "Setlist Show Bar do Rock",
      notes: "Chegada às 20:00 para soundcheck"
    },
    {
      id: 3,
      title: "Gravação - Nova Música",
      type: "recording",
      date: "2024-01-25",
      time: "14:00",
      duration: "4h",
      location: "Estúdio Aurora",
      participants: [
        { name: "João", confirmed: true },
        { name: "Maria", confirmed: false }
      ],
      setlist: null,
      notes: "Levar guitarras extras e partituras"
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]);

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
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Organize seus ensaios, shows e gravações</p>
        </div>
        <Button className="bg-gradient-hero hover:shadow-glow transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Todos</Button>
              <Button variant="ghost" size="sm">Ensaios</Button>
              <Button variant="ghost" size="sm">Shows</Button>
              <Button variant="ghost" size="sm">Gravações</Button>
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
                <Button size="sm" variant="secondary" className="flex-1">
                  Editar
                </Button>
                <Button size="sm" variant="outline">
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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