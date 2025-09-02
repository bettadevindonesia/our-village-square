import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  Key,
  useEffect,
  useState
} from "react";
import { Link, useParams } from "react-router-dom";
import { EventProps } from "./Events";

const EventDetail = () => {
  const { slug } = useParams();

  const [event, setEvent] = useState<EventProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventData = await useQuery<EventProps>(
          `SELECT * FROM events WHERE slug = '${slug}'`
        );

        if (eventData && isMounted) {
          const eventDataMap = mapDatabaseResult<EventProps>(eventData);
          setEvent(eventDataMap[0] || null);
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
    fetchEvent();
    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  if (!event) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Acara Tidak Ditemukan</h1>
          <Link to="/acara">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Acara
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "government":
        return "Pemerintahan";
      case "culture":
        return "Budaya";
      case "community":
        return "Komunitas";
      case "sports":
        return "Olahraga";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "government":
        return "bg-blue-100 text-blue-800";
      case "culture":
        return "bg-purple-100 text-purple-800";
      case "community":
        return "bg-green-100 text-green-800";
      case "sports":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/acara">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Acara
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge className={getCategoryColor(event.category)}>
                  {getCategoryLabel(event.category)}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold mb-4">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>
                    {new Date(event.event_date.toString()).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.event_time} WIB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Deskripsi Acara
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Informasi Tambahan
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {JSON.parse(event.additional_info.toString() || "[]")
                    .length === 0 ? (
                    <p>Tidak ada informasi tambahan.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {JSON.parse(event.additional_info.toString() || "[]").map(
                        (info: string, index: Key) => (
                          <li key={index}>{info}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-4">
                  <Button className="flex-1">Daftar Hadir</Button>
                  <Button variant="outline" className="flex-1">
                    Bagikan Acara
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
