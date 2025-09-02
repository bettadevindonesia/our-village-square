import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, AlertTriangle, Info, Wrench, Megaphone } from "lucide-react";
import { mockAnnouncements } from "@/data/mockData";

const AnnouncementDetail = () => {
  const { id } = useParams();
  const announcement = mockAnnouncements.find(a => a.id === id);

  if (!announcement) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Pengumuman Tidak Ditemukan</h1>
          <Link to="/pengumuman">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Pengumuman
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Tinggi";
      case "medium": return "Sedang";
      case "low": return "Rendah";
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency": return AlertTriangle;
      case "maintenance": return Wrench;
      case "general": return Info;
      case "event": return Megaphone;
      default: return Info;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "emergency": return "Darurat";
      case "maintenance": return "Pemeliharaan";
      case "general": return "Umum";
      case "event": return "Acara";
      default: return category;
    }
  };

  const CategoryIcon = getCategoryIcon(announcement.category);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/pengumuman">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Pengumuman
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(announcement.priority)}>
                    Prioritas {getPriorityLabel(announcement.priority)}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(announcement.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-4 flex items-center">
                <CategoryIcon className="w-8 h-8 mr-3 text-primary" />
                {announcement.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-lg leading-relaxed">
                  {announcement.content}
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Kategori & Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                    <p className="text-lg">{getCategoryLabel(announcement.category)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tingkat Prioritas</p>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                  </div>
                </div>
              </div>

              {announcement.category === "maintenance" && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Informasi Pemeliharaan</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Pekerjaan akan dilakukan oleh tim teknisi bersertifikat</p>
                    <p>• Warga dimohon untuk mempersiapkan cadangan sebelumnya</p>
                    <p>• Hubungi kantor desa jika ada gangguan di luar jadwal</p>
                  </div>
                </div>
              )}

              {announcement.category === "emergency" && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-600">Kontak Darurat</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Kantor Desa: (0291) 123-456</p>
                    <p>• Kepala Desa: 0812-3456-7890</p>
                    <p>• Polsek Kembang: (0291) 111-222</p>
                    <p>• Puskesmas: (0291) 333-444</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Pengumuman ini dikeluarkan oleh Pemerintah Desa Dermolo. 
                    Untuk informasi lebih lanjut, silakan hubungi kantor desa pada jam kerja 
                    (Senin-Jumat, 08:00-16:00 WIB).
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-4">
                  <Button className="flex-1">
                    Bagikan Pengumuman
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cetak Pengumuman
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

export default AnnouncementDetail;