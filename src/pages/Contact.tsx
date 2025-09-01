import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon",
      details: ["(555) 123-4567", "Sesuai jam kerja"],
      color: "text-village-blue"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["office@village.gov", "info@village.gov"],
      color: "text-village-green"
    },
    {
      icon: MapPin,
      title: "Alamat",
      details: ["Jl. Beringin Raya No. 1 RT 03/RW 01", "Dermolo, Kec. Kembang, Kab. Jepara, 59453"],
      color: "text-village-amber"
    },
    {
      icon: Clock,
      title: "Jam Kerja",
      details: ["Senin - Kamis: 8:00 WIB - 16:00 WIB", "Jumat: 8:00 WIB - 11:00 WIB", "Sabtu: 8:00 WIB - 16:00 WIB"],
      color: "text-primary"
    }
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hubungi kami di pemerintahan desa. Kami di sini untuk membantu dengan pertanyaan, 
            kekhawatiran, dan saran Anda.
          </p>
        </div>

        <div className="flex items-center w-1/2 mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Hubungi Kami</h2>
              <p className="text-muted-foreground mb-8">
                Kami selalu senang mendengar dari warga kami. Apakah Anda memiliki pertanyaan tentang
                layanan desa, ingin melaporkan masalah, atau memiliki saran untuk perbaikan,
                jangan ragu untuk menghubungi kami.
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
                            <p key={index} className="text-sm text-muted-foreground">
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
                    <h3 className="font-semibold mb-2 text-destructive">Kontak Darurat</h3>
                    <p className="text-sm text-muted-foreground">
                      Untuk masalah mendesak yang memerlukan perhatian segera
                    </p>
                    <p className="font-semibold text-destructive">
                      (555) 911-0000
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