import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Bell, Users, Phone, FileText, MapPin } from "lucide-react";
import villageHero from "@/assets/desa-dermolo.png";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";
import { AppSettings } from "./Contact";

const Index = () => {
  const quickLinks = [
    {
      icon: Calendar,
      title: "Acara Mendatang",
      description: "Lihat acara dan kegiatan komunitas",
      href: "/acara",
      color: "text-village-blue",
    },
    {
      icon: Bell,
      title: "Pengumuman",
      description: "Tetap update dengan berita desa",
      href: "/pengumuman",
      color: "text-village-green",
    },
    {
      icon: Users,
      title: "Tentang Desa Kami",
      description: "Pelajari tentang komunitas kami",
      href: "/tentang",
      color: "text-village-amber",
    },
    {
      icon: Phone,
      title: "Hubungi Kami",
      description: "Hubungi kantor desa",
      href: "/kontak",
      color: "text-primary",
    },
  ];

  const [infoMap, setInfoMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both datasets in parallel for better performance
        const contactInfo = await useQuery(
          "SELECT setting_key, setting_value, description FROM settings WHERE setting_key IN ('contact_telepon', 'contact_email', 'contact_alamat', 'contact_jam_kerja', 'contact_darurat')"
        );

        if (contactInfo && isMounted) {
          const contactInfoMap = mapDatabaseResult<AppSettings>(contactInfo);
          const infoMap = {};
          contactInfoMap.forEach((item) => {
            infoMap[item.setting_key] = item.setting_value;
          });
          setInfoMap(infoMap);
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
    fetchData();
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-96 lg:h-[500px] overflow-hidden">
          <img
            src={villageHero}
            alt="Beautiful village landscape with traditional buildings and rolling hills"
            className="w-full h-full object-fit"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 animate-fade-in">
                  Selamat Datang di Desa Dermolo
                </h1>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/acara">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Calendar className="w-5 h-5 mr-2" />
                      Lihat Acara
                    </Button>
                  </Link>
                  <Link to="/surat">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Buat Surat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Layanan Desa</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Akses cepat ke informasi dan layanan desa yang penting. Semua
                yang Anda butuhkan untuk tetap terhubung dengan komunitas kami.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} to={link.href}>
                    <Card className="h-full hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center mb-4">
                          <Icon className={`w-6 h-6 ${link.color}`} />
                        </div>
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Village Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Masyarakat Desa Dermolo
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Masyarakat Desa Dermolo selalu menunjukan antusiasme tinggi
                  dalam setiap kegiatan bersama, mulai dari kerja bakti hingga
                  acara desa. Lingkungan yang bersih dan terjaga rapih menjadi
                  bukti kepedualian warga terhadap kenyamanan dan kelestarian
                  desa.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-village-blue" />
                    <span>Terletak di Kecamtan Kembang, Kabupaten Jepara</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-village-green" />
                    <span>Komunitas warga yang ramah dan terlibat aktif</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-village-amber" />
                    <span>
                      Kalender acara komunitas yang kaya sepanjang tahun
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/tentang">
                    <Button variant="outline" size="lg">
                      Pelajari Lebih Lanjut Tentang Kami
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:text-center">
                <Card className="p-8 bg-gradient-card">
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Kontak Cepat</h3>
                      <p className="text-muted-foreground">
                        Butuh bantuan? Kami siap membantu.
                      </p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Kantor Desa:</span>
                        <span>
                          {(() => {
                            let teleponArr = [];
                            if (typeof infoMap["contact_telepon"] === "string") {
                              try {
                                teleponArr = JSON.parse(infoMap["contact_telepon"]);
                              } catch {
                                teleponArr = [infoMap["contact_telepon"]];
                              }
                            } else if (Array.isArray(infoMap["contact_telepon"])) {
                              teleponArr = infoMap["contact_telepon"];
                            } else if (infoMap["contact_telepon"]) {
                              teleponArr = [infoMap["contact_telepon"]];
                            }
                            return teleponArr.join(" - ");
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Darurat:</span>
                        <span>
                          {Array.isArray(infoMap["contact_darurat"])
                            ? infoMap["contact_darurat"].map((item, index) => (
                                <span key={index}>{item}</span>
                              ))
                            : infoMap["contact_darurat"]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>
                          {(() => {
                            let emailArr = [];
                            if (typeof infoMap["contact_email"] === "string") {
                              try {
                                emailArr = JSON.parse(infoMap["contact_email"]);
                              } catch {
                                emailArr = [infoMap["contact_email"]];
                              }
                            } else if (Array.isArray(infoMap["contact_email"])) {
                              emailArr = infoMap["contact_email"];
                            } else if (infoMap["contact_email"]) {
                              emailArr = [infoMap["contact_email"]];
                            }
                            return emailArr.join(" - ");
                          })()}
                        </span>
                      </div>
                    </div>
                    <Link to="/kontak" className="block">
                      <Button className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi Kami
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Index;
