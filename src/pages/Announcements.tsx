import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAnnouncements } from "@/data/mockData";
import { Bell, AlertTriangle, Info, Calendar, Wrench, AlertCircle, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "react-router-dom";

const Announcements = () => {
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Tinggi";
      case "medium": return "Sedang";
      case "low": return "Rendah";
      default: return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return AlertTriangle;
      case "medium": return Info;
      case "low": return Bell;
      default: return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-village-amber/10 text-village-amber border-village-amber/20";
      case "low": return "bg-village-blue/10 text-village-blue border-village-blue/20";
      default: return "bg-muted text-muted-foreground";
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency": return AlertCircle;
      case "maintenance": return Wrench;
      case "event": return Calendar;
      case "general": return Info;
      default: return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency": return "bg-destructive/10 text-destructive border-destructive/20";
      case "maintenance": return "bg-village-amber/10 text-village-amber border-village-amber/20";
      case "event": return "bg-village-green/10 text-village-green border-village-green/20";
      case "general": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...mockAnnouncements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pengumuman Desa</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tetap terinformasi dengan berita terbaru, pembaruan, dan informasi penting dari administrasi desa Anda.
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {sortedAnnouncements.map((announcement) => {
            const PriorityIcon = getPriorityIcon(announcement.priority);
            const CategoryIcon = getCategoryIcon(announcement.category);
            const announcementDate = parseISO(announcement.date);
            
            return (
              <Card 
                key={announcement.id} 
                className={`hover:shadow-medium transition-all duration-300 ${
                  announcement.priority === 'high' ? 'border-l-4 border-l-destructive' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        Prioritas {getPriorityLabel(announcement.priority)}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(announcement.category)}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {getCategoryLabel(announcement.category)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(announcementDate, "d MMM yyyy", { locale: id })}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {announcement.content}
                  </p>
                  <Link to={`/pengumuman/${announcement.id}`}>
                    <Button variant="outline" className="w-full">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada pengumuman</h3>
            <p className="text-muted-foreground">
              Periksa kembali nanti untuk pembaruan dan pengumuman desa.
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-16 space-y-8">
          {/* Priority Levels */}
          <div className="p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Tingkat Prioritas</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <span className="text-sm font-medium">Prioritas Tinggi</span>
                <span className="text-xs text-muted-foreground">Urusan mendesak yang memerlukan perhatian segera</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Info className="w-6 h-6 text-village-amber" />
                <span className="text-sm font-medium">Prioritas Sedang</span>
                <span className="text-xs text-muted-foreground">Pembaruan dan perubahan penting</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Bell className="w-6 h-6 text-village-blue" />
                <span className="text-sm font-medium">Prioritas Rendah</span>
                <span className="text-xs text-muted-foreground">Informasi umum dan pembaruan</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Kategori Pengumuman</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <span className="text-sm font-medium">Darurat</span>
                <span className="text-xs text-muted-foreground">Informasi keselamatan & darurat</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Wrench className="w-6 h-6 text-village-amber" />
                <span className="text-sm font-medium">Pemeliharaan</span>
                <span className="text-xs text-muted-foreground">Pembaruan infrastruktur & layanan</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Calendar className="w-6 h-6 text-village-green" />
                <span className="text-sm font-medium">Acara</span>
                <span className="text-xs text-muted-foreground">Pengumuman terkait acara</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Info className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Umum</span>
                <span className="text-xs text-muted-foreground">Informasi umum desa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;