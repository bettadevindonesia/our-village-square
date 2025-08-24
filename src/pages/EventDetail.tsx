import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { mockEvents } from "@/data/mockData";

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Acara Tidak Ditemukan</h1>
          <Link to="/events">
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
      case "government": return "Pemerintahan";
      case "culture": return "Budaya";
      case "community": return "Komunitas";
      case "sports": return "Olahraga";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "government": return "bg-blue-100 text-blue-800";
      case "culture": return "bg-purple-100 text-purple-800";
      case "community": return "bg-green-100 text-green-800";
      case "sports": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/events">
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
              <CardTitle className="text-3xl font-bold mb-4">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time} WIB</span>
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
                <h3 className="text-xl font-semibold mb-4">Informasi Tambahan</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Acara ini terbuka untuk umum</p>
                  <p>• Diharapkan hadir tepat waktu</p>
                  <p>• Untuk informasi lebih lanjut, hubungi kantor desa</p>
                  {event.category === "government" && (
                    <p>• Warga diharapkan membawa KTP untuk verifikasi</p>
                  )}
                  {event.category === "culture" && (
                    <p>• Dianjurkan menggunakan pakaian tradisional</p>
                  )}
                  {event.category === "sports" && (
                    <p>• Bawalah botol minum dan handuk</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-4">
                  <Button className="flex-1">
                    Daftar Hadir
                  </Button>
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