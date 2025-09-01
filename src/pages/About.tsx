import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, Award } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

const About = () => {
  const [dataOfficial, setDataOfficial] = useState<OfficialData[] | null>(null);
  const [dataPopulation, setDataPopulation] = useState<number>(0);
  const [dataArea, setDataArea] = useState<string>("0 ha");
  const [dataEstablished, setDataEstablished] = useState<string>("Unknown");
  const [dataHeritageSites, setDataHeritageSites] = useState<string>("0");

  const stats: Stats[] = [
    { icon: Users, label: "Populasi", value: String(dataPopulation) },
    { icon: MapPin, label: "Area", value: String(dataArea) },
    { icon: Calendar, label: "Dibentuk", value: String(dataEstablished) },
    { icon: Award, label: "Situs Warisan", value: String(dataHeritageSites) }
  ];

  // Fetch data only once on mount, using cached query
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      // Fetch official data
      const results = await useQuery("SELECT name, position, description FROM officials");
      const dataOfficial = mapDatabaseResult(results);

      // Fetch statistics
      const statsResults = await useQuery("SELECT setting_key, setting_value, description FROM settings WHERE setting_key IN ('total_populasi', 'luas_area', 'tahun_dibentuk', 'total_situs_warisan')");
      const dataStats = mapDatabaseResult(statsResults);

      if (dataOfficial && dataStats && isMounted) {
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
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Memoize the official data for rendering
  const memoizedOfficials = useMemo(() => dataOfficial ?? [], [dataOfficial]);
  const memoizedStats = useMemo(() => stats, [stats]);

  if (!dataOfficial && !dataPopulation && !dataArea && !dataEstablished && !dataHeritageSites) {
    return <div>Loading...</div>;
  }

  return (
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
          {memoizedStats.map((stat) => {
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
            <h2 className="text-3xl font-bold mb-6">Sejarah Desa Dermolo</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Sejarah Desa Dermolo bermula ketika wilayah ini masih menjadi bagian dari Desa Jinggotan, Kecamatan Bangsri. Pada masa itu, kawasan Dermolo dikenal rawan karena maraknya komplotan perampok dan pencuri yang sulit ditumpas. Kondisi tersebut menimbulkan keresahan masyarakat hingga para tokoh memutuskan untuk mengadakan sebuah sayembara: siapa pun yang mampu mengatasi gangguan tersebut akan diberikan tanah sebagai hadiah.
              </p>
              <p>
                Tantangan itu kemudian dijawab oleh tiga tokoh utama, yaitu Mbah Tambar, Mbah Giyah, dan Mbah Ampel. Dengan kebijaksanaan serta keberanian mereka, komplotan perampok berhasil ditumpas, sehingga terciptalah ketenteraman di wilayah Dermolo. Keberhasilan ini menjadi titik awal berdirinya Desa Dermolo sebagai sebuah wilayah mandiri.
              </p>
              <p>
                Sebagai wujud syukur atas kemenangan itu, ketiga tokoh mengadakan selamatan di bawah pohon Demolo dengan membakar sate ikan wader dan minum air tape. Dari peristiwa inilah lahir nama “Dermolo,” yang hingga kini menjadi identitas desa dan simbol kuatnya persatuan, keberanian, serta semangat kebersamaan masyarakat.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Visi dan Misi</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-blue/20 flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-village-blue" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Kepentingan Masyarakat</h3>
                  <p className="text-muted-foreground text-sm">
                    Kami memprioritaskan kesejahteraan dan keterlibatan semua warga, mendorong
                    rasa memiliki dan saling mendukung.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-green/20 flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-village-green" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pengelolaan Lingkungan</h3>
                  <p className="text-muted-foreground text-sm">
                    Kami berkomitmen untuk praktik berkelanjutan yang melindungi lingkungan
                    alam kita untuk generasi mendatang.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-amber/20 flex items-center justify-center mt-1">
                  <Award className="w-4 h-4 text-village-amber" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pelestarian Warisan</h3>
                  <p className="text-muted-foreground text-sm">
                    Kami menghormati sejarah dan tradisi kami sambil mengadopsi perubahan positif
                    dan inovasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Council Members */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Dewan Desa</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memoizedOfficials.map((member) => (
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
  );
};

export default About;