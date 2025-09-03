import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

type AppSettings = {
  setting_key: string;
  setting_value: string;
  description: string;
};

const Contact = () => {
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

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon",
      details: JSON.parse(infoMap["contact_telepon"] || "[]"),
      color: "text-village-blue",
    },
    {
      icon: Mail,
      title: "Email",
      details: JSON.parse(infoMap["contact_email"] || "[]"),
      color: "text-village-green",
    },
    {
      icon: MapPin,
      title: "Alamat",
      details: JSON.parse(infoMap["contact_alamat"] || "[]"),
      color: "text-village-amber",
    },
    {
      icon: Clock,
      title: "Jam Kerja",
      details: JSON.parse(infoMap["contact_jam_kerja"] || "[]"),
      color: "text-primary",
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hubungi kami di pemerintahan desa. Kami di sini untuk membantu
            dengan pertanyaan, kekhawatiran, dan saran Anda.
          </p>
        </div>

        <div className="flex items-center w-1/2 mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Hubungi Kami
              </h2>
              <p className="text-muted-foreground mb-8">
                Kami selalu senang mendengar dari warga kami. Apakah Anda
                memiliki pertanyaan tentang layanan desa, ingin melaporkan
                masalah, atau memiliki saran untuk perbaikan, jangan ragu untuk
                menghubungi kami.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <Card key={info.title}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-card flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${info.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, index) => (
                            <p
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Emergency Contact */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-destructive">
                      Kontak Darurat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Untuk masalah mendesak yang memerlukan perhatian segera
                    </p>
                    <p className="font-semibold text-destructive">
                      {infoMap["contact_darurat"] || "Tidak tersedia"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tersedia 24/7 untuk keadaan darurat saja
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
