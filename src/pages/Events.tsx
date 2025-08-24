import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/data/mockData";
import { Calendar, Clock, MapPin, Users, Award, Palette, Trophy } from "lucide-react";
import { format, parseISO } from "date-fns";

const Events = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "government": return Users;
      case "culture": return Palette;
      case "sports": return Trophy;
      case "community": return Award;
      default: return Calendar;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "government": return "bg-village-blue/10 text-village-blue border-village-blue/20";
      case "culture": return "bg-village-amber/10 text-village-amber border-village-amber/20";
      case "sports": return "bg-village-green/10 text-village-green border-village-green/20";
      case "community": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Sort events by date
  const sortedEvents = [...mockEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Village Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay connected with our vibrant community through upcoming events, meetings, and celebrations.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {sortedEvents.map((event) => {
            const CategoryIcon = getCategoryIcon(event.category);
            const eventDate = parseISO(event.date);
            
            return (
              <Card key={event.id} className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={getCategoryColor(event.category)}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(eventDate, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">
              Check back soon for new community events and activities.
            </p>
          </div>
        )}

        {/* Categories Info */}
        <div className="mt-16 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Event Categories</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-6 h-6 text-village-blue" />
              <span className="text-sm font-medium">Government</span>
              <span className="text-xs text-muted-foreground">Official meetings & proceedings</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Palette className="w-6 h-6 text-village-amber" />
              <span className="text-sm font-medium">Culture</span>
              <span className="text-xs text-muted-foreground">Festivals & cultural activities</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Trophy className="w-6 h-6 text-village-green" />
              <span className="text-sm font-medium">Sports</span>
              <span className="text-xs text-muted-foreground">Athletic events & competitions</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Community</span>
              <span className="text-xs text-muted-foreground">Volunteer & social activities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;