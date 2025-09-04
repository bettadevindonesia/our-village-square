import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";

interface OfficialData {
  name: string;
  position: string;
  description: string;
}

type Stats = {
  icon: React.ElementType;
  label: string;
  value: string;
};

type StatSettings = {
  setting_key: string;
  setting_value: string;
  description: string;
}

type Vision = {
  icon: React.ElementType;
  title: string;
  content: string;
}

const About = () => {
  const [dataOfficial, setDataOfficial] = useState<OfficialData[]>([]);
  const [dataPopulation, setDataPopulation] = useState<number>(0);
  const [dataArea, setDataArea] = useState<string>("0 ha");
  const [dataEstablished, setDataEstablished] = useState<string>("Unknown");
  const [dataHeritageSites, setDataHeritageSites] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sejarah, setSejarah] = useState<Record<string, string>>({
    title: "...",
    p1: "...",
    p2: "...",
    p3: "..."
  });

  const stats: Stats[] = [
    { icon: Users, label: "Populasi", value: String(dataPopulation) },
    { icon: MapPin, label: "Area", value: String(dataArea) },
    { icon: Calendar, label: "Dibentuk", value: String(dataEstablished) },
    { icon: Award, label: "Situs Warisan", value: String(dataHeritageSites) }
  ];

  const ourVision: Vision[] = [
    {
      icon: Users,
      title: "Kepentingan Masyarakat",
      content: "Kami memprioritaskan kesejahteraan dan keterlibatan semua warga, mendorong rasa memiliki dan saling mendukung."
    },
    {
      icon: MapPin,
      title: "Pengolahan Lingkungan",
      content: "Kami berkomitmen untuk praktik berkelanjutan yang melindungi lingkungan alam kita untuk generasi mendatang."
    },
    {
      icon: Award,
      title: "Pelestarian Warisan",
      content: "Kami menghormati sejarah dan tradisi kami sambil mengadopsi perubahan positif dan inovasi."
    }
  ];

  // Fetch data only once on mount, using cached query
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both datasets in parallel for better performance
        const [officialResults, statsResults, sejarahResults] = await Promise.all([
          useQuery("SELECT name, position, description FROM officials"),
          useQuery("SELECT setting_key, setting_value, description FROM settings WHERE setting_key IN ('total_populasi', 'luas_area', 'tahun_dibentuk', 'total_situs_warisan')"),
          useQuery("SELECT setting_key, setting_value, description FROM settings WHERE setting_key IN ('sejarah_title', 'sejarah_p1', 'sejarah_p2', 'sejarah_p3')")
        ]);

        if (officialResults && statsResults && sejarahResults && isMounted) {
          const dataOfficial = mapDatabaseResult<OfficialData[]>(officialResults);
          const dataStats = mapDatabaseResult<StatSettings>(statsResults);
          const dataSejarah = mapDatabaseResult<Record<string, string>>(sejarahResults);

          setDataOfficial(
            dataOfficial.map((row: any) => ({
              name: String(row.name),
              position: String(row.position),
              description: String(row.description)
            }))
          );

          // Set statistics data
          setDataPopulation(Number(dataStats.find((item: any) => item.setting_key === 'total_populasi')?.setting_value) || 0);
          setDataArea(String(dataStats.find((item: any) => item.setting_key === 'luas_area')?.setting_value) || "0 ha");
          setDataEstablished(String(dataStats.find((item: any) => item.setting_key === 'tahun_dibentuk')?.setting_value) || "Unknown");
          setDataHeritageSites(String(dataStats.find((item: any) => item.setting_key === 'total_situs_warisan')?.setting_value) || "0");

          setSejarah({
            title: String(dataSejarah.find((item: any) => item.setting_key === 'sejarah_title')?.setting_value) || "...",
            p1: String(dataSejarah.find((item: any) => item.setting_key === 'sejarah_p1')?.setting_value) || "...",
            p2: String(dataSejarah.find((item: any) => item.setting_key === 'sejarah_p2')?.setting_value) || "...",
            p3: String(dataSejarah.find((item: any) => item.setting_key === 'sejarah_p3')?.setting_value) || "..."
          });
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
    return () => { isMounted = false; };
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Tentang Desa Dermolo</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Temukan sejarah yang kaya, komunitas yang hidup, dan masa depan yang menjanjikan dari desa tercinta kami.
              Tempat di mana tradisi bertemu dengan kemajuan.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* History Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">{sejarah.title}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {sejarah.p1}
                </p>
                <p>
                  {sejarah.p2}
                </p>
                <p>
                  {sejarah.p3}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Visi dan Misi</h2>
              <div className="space-y-6">
                { ourVision.map((vision) => {
                  const Icon = vision.icon;
                  return (
                    <div className="flex items-start space-x-4" key={vision.title}>
                      <div className="w-8 h-8 rounded-full bg-village-blue/20 flex items-center justify-center mt-1">
                        <Icon className="w-4 h-4 text-village-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{vision.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {vision.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Council Members */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Dewan Desa</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataOfficial.map((member) => (
                <Card key={member.name}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-hero mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-village-blue font-medium">{member.position}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;