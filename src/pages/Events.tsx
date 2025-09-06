import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/data/mockData";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Palette,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { format, parseISO, set } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";

export interface EventProps {
  id: number;
  slug: string;
  title: string;
  description: string;
  additional_info: string[];
  event_date: Date;
  event_time: string;
  location: string;
  category: string;
  contact_info?: string;
  is_published?: boolean;
  created_by?: string;
}

const Events = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "government":
        return Users;
      case "culture":
        return Palette;
      case "sports":
        return Trophy;
      case "community":
        return Award;
      default:
        return Calendar;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "government":
        return "Pemerintahan";
      case "culture":
        return "Budaya";
      case "sports":
        return "Olahraga";
      case "community":
        return "Komunitas";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "government":
        return "bg-village-blue/10 text-village-blue border-village-blue/20";
      case "culture":
        return "bg-village-amber/10 text-village-amber border-village-amber/20";
      case "sports":
        return "bg-village-green/10 text-village-green border-village-green/20";
      case "community":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventData = await useQuery("SELECT * FROM events ORDER BY event_date ASC", [], 1);

        if (eventData && isMounted) {
          const eventDataMap = mapDatabaseResult<EventProps>(eventData);
          setEvents(eventDataMap);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load data. Please try again later.");
          console.error("Error fetching data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-village-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-village-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Acara Desa</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tetap terhubung dengan komunitas kami yang dinamis melalui acara
              mendatang, rapat, dan perayaan.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid lg:grid-cols-2 gap-8 container">
            {events.map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              const eventDate = parseISO(event.event_date.toString());

              return (
                <Card
                  key={event.id}
                  className="hover:shadow-medium transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={getCategoryColor(event.category)}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {getCategoryLabel(event.category)}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(eventDate, "d MMM yyyy", { locale: id })}
                        </div>
                      </div>
                    </div>

                    <CardTitle className="text-xl mb-2">
                      {event.title}
                    </CardTitle>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.event_time} WIB
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {event.description}
                    </p>
                    <Link to={`/acara/${event.slug}`}>
                      <Button variant="outline" className="w-full">
                        Lihat Detail
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Tidak ada acara mendatang
              </h3>
              <p className="text-muted-foreground">
                Periksa kembali segera untuk acara dan kegiatan komunitas baru.
              </p>
            </div>
          )}

          {/* Categories Info */}
          <div className="mt-16 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Kategori Acara
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Users className="w-6 h-6 text-village-blue" />
                <span className="text-sm font-medium">Pemerintahan</span>
                <span className="text-xs text-muted-foreground">
                  Rapat resmi & urusan pemerintahan
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Palette className="w-6 h-6 text-village-amber" />
                <span className="text-sm font-medium">Budaya</span>
                <span className="text-xs text-muted-foreground">
                  Festival & kegiatan budaya
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Trophy className="w-6 h-6 text-village-green" />
                <span className="text-sm font-medium">Olahraga</span>
                <span className="text-xs text-muted-foreground">
                  Acara olahraga & kompetisi
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Komunitas</span>
                <span className="text-xs text-muted-foreground">
                  Kegiatan sosial & volunteer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Events;
