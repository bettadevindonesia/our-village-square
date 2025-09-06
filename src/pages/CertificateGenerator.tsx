import logoKabJepara from "@/assets/logo-kab-jepara.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFreshQuery } from "@/lib/tursoUtils";
import { mapDatabaseResult } from "@/lib/utils";
import jsPDF from "jspdf";
import { Download, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type CertificateType =
  | "surat_keterangan_usaha"
  | "surat_keterangan_tidak_mampu"
  | "surat_keterangan_pengantar";

interface FormData {
  document_number?: string;
  certificateType: CertificateType | "";
  applicantName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  businessYears?: string;
  rtRwLetterNumber: string;
  rtRwLetterDate: string;
  gender?: string;
  religion?: string;
  purpose?: string;
  nationality?: string;
  familyCardNumber?: string;
  nationalIdNumber?: string;
  validFromDate?: string;
  remarks?: string;
}

interface DocumentSequence {
  id: number;
  certificate_type: string;
  current_number: number;
  prefix_code: string;
}

const CertificateGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    certificateType: "",
    applicantName: "",
    placeOfBirth: "",
    dateOfBirth: "",
    occupation: "Unemployed",
    address: "",
    rtRwLetterNumber: "",
    rtRwLetterDate: "",
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [docNumberSequence, setDocNumberSequence] = useState<
    DocumentSequence[]
  >([]);
  const [currentCouncil, setCurrentCouncil] = useState<string>("");
  const [officialAddress, setOfficialAddress] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const preparedData = async () => {
      try {
        setLoading(true);
        setError(null);

        const docSequence = await useFreshQuery(
          "SELECT * FROM document_sequences"
        );
        const currentCouncil = await useFreshQuery(
          "SELECT name FROM officials WHERE position = 'Petinggi Dermolo'"
        );
        const officialAddress = await useFreshQuery(
          "SELECT setting_key, setting_value FROM settings WHERE setting_key = 'contact_alamat'"
        );

        if (docSequence && currentCouncil && officialAddress && isMounted) {
          const docSequenceMap =
            mapDatabaseResult<DocumentSequence>(docSequence);
          setDocNumberSequence(docSequenceMap);

          const currentCouncilMap = mapDatabaseResult<{ name: string }>(
            currentCouncil
          );
          setCurrentCouncil(currentCouncilMap[0].name);

          const officialAddressMap = mapDatabaseResult<{
            setting_value: string;
          }>(officialAddress);
          setOfficialAddress(
            JSON.parse(officialAddressMap[0].setting_value.toString()).join(
              ", "
            )
          );
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

    preparedData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateLetterNumber = (type: CertificateType): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const sequentialNumber =
      docNumberSequence.find((seq) => seq.certificate_type === type)
        ?.current_number + 1;

    const romanNumerals = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    const romanMonth = romanNumerals[month - 1];

    const typePrefix = Object.fromEntries(
      docNumberSequence.map((seq) => [seq.certificate_type, seq.prefix_code])
    );

    return `${typePrefix[type]} / ${sequentialNumber
      .toString()
      .padStart(3, "0")} / ${romanMonth} / ${year}`;
  };

  const saveCertificateToDatabase = async () => {
    if (!formData.certificateType) {
      toast({
        title: "Error",
        description: "Certificate type is missing.",
        variant: "destructive",
      });
      return;
    }

    const endpoint = import.meta.env.MODE === "production" ? import.meta.env.VITE_API_PROD_BASE_URL : import.meta.env.VITE_API_DEV_BASE_URL;

    try {
      const response = await fetch(`${endpoint}/api/certificates`, {
        // Adjust URL if your apps are separate
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer YOUR_API_TOKEN`,
        },
        body: JSON.stringify({
          certificateType: formData.certificateType,
          applicantName: formData.applicantName,
          placeOfBirth: formData.placeOfBirth,
          dateOfBirth: formData.dateOfBirth,
          occupation: formData.occupation ?? "Unemployed",
          address: formData.address,
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessAddress: formData.businessAddress,
          businessYears: formData.businessYears,
          rtRwLetterNumber: formData.rtRwLetterNumber,
          rtRwLetterDate: formData.rtRwLetterDate,
          gender: formData.gender,
          religion: formData.religion,
          purpose: formData.purpose,
          nationality: formData.nationality,
          familyCardNumber: formData.familyCardNumber,
          nationalIdNumber: formData.nationalIdNumber,
          validFromDate: formData.validFromDate,
          remarks: formData.remarks,
          documentNumber: formData.document_number, // Use the generated number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save certificate");
      }

      const result = await response.json();
      console.log("Certificate saved:", result);
      toast({
        title: "Success",
        description: `Certificate saved successfully with ID: ${result.id}`,
      });
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save certificate to database.",
        variant: "destructive",
      });
    }
  };

  const generatePDF = async () => {
    if (!formData.certificateType) {
      toast({
        title: "Tipe Surat Belum Dipilih",
        description: "Silakan pilih tipe surat terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    // Letter number and date
    const letterNumber = generateLetterNumber(
      formData.certificateType as CertificateType
    );
    formData.document_number = letterNumber;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PEMERINTAH KABUPATEN JEPARA", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;
    doc.text("KECAMATAN KEMBANG", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;
    doc.text("DESA DERMOLO", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.addImage(logoKabJepara, "PNG", 20, 25, 30, 35);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Alamat: ${officialAddress}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Nomor: ${letterNumber}`, margin, yPosition);
    doc.text(
      `Dermolo, ${new Date().toLocaleDateString("id-ID")}`,
      pageWidth - margin - 60,
      yPosition
    );
    yPosition += 20;

    // Letter title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    let title = "";
    switch (formData.certificateType) {
      case "surat_keterangan_usaha":
        title = "SURAT KETERANGAN USAHA";
        break;
      case "surat_keterangan_tidak_mampu":
        title = "SURAT KETERANGAN TIDAK MAMPU";
        break;
      case "surat_keterangan_pengantar":
        title = "SURAT KETERANGAN PENGANTAR";
        break;
    }
    doc.text(title, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Content
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Yang bertanda tangan di bawah ini:", margin, yPosition);
    yPosition += 10;

    doc.text("Nama", margin + 10, yPosition);
    doc.text(`: ${currentCouncil}`, margin + 50, yPosition);
    yPosition += 8;
    doc.text("Jabatan", margin + 10, yPosition);
    doc.text(": Petinggi Dermolo", margin + 50, yPosition);
    yPosition += 15;

    doc.text("Dengan ini menerangkan bahwa:", margin, yPosition);
    yPosition += 10;

    // Applicant details
    doc.text("Nama", margin + 10, yPosition);
    doc.text(`: ${formData.applicantName}`, margin + 50, yPosition);
    yPosition += 8;

    if (formData.placeOfBirth && formData.dateOfBirth) {
      doc.text("Tempat/Tgl Lahir", margin + 10, yPosition);
      doc.text(
        `: ${formData.placeOfBirth}, ${new Date(
          formData.dateOfBirth
        ).toLocaleDateString("id-ID")}`,
        margin + 50,
        yPosition
      );
      yPosition += 8;
    }

    if (formData.occupation) {
      doc.text("Pekerjaan", margin + 10, yPosition);
      doc.text(`: ${formData.occupation}`, margin + 50, yPosition);
      yPosition += 8;
    }

    if (formData.address) {
      doc.text("Alamat", margin + 10, yPosition);
      const addressLines = doc.splitTextToSize(
        `: ${formData.address}`,
        pageWidth - margin - 60
      );
      doc.text(addressLines[0], margin + 50, yPosition);
      for (let i = 1; i < addressLines.length; i++) {
        yPosition += 6;
        doc.text(addressLines[i], margin + 50, yPosition);
      }
      yPosition += 8;
    }

    // Type-specific content
    yPosition += 5;
    if (formData.certificateType === "surat_keterangan_usaha") {
      doc.text(
        "Adalah benar penduduk Desa Dermolo yang menjalankan usaha:",
        margin,
        yPosition
      );
      yPosition += 10;
      if (formData.businessName) {
        doc.text("Nama Usaha", margin + 10, yPosition);
        doc.text(`: ${formData.businessName}`, margin + 50, yPosition);
        yPosition += 8;
      }
      if (formData.businessType) {
        doc.text("Jenis Usaha", margin + 10, yPosition);
        doc.text(`: ${formData.businessType}`, margin + 50, yPosition);
        yPosition += 8;
      }
      if (formData.businessYears) {
        doc.text("Lama Usaha", margin + 10, yPosition);
        doc.text(`: ${formData.businessYears} tahun`, margin + 50, yPosition);
        yPosition += 8;
      }
    } else if (formData.certificateType === "surat_keterangan_tidak_mampu") {
      doc.text(
        "Adalah benar penduduk Desa Dermolo yang termasuk dalam kategori",
        margin,
        yPosition
      );
      yPosition += 8;
      doc.text("keluarga tidak mampu secara ekonomi.", margin, yPosition);
      yPosition += 10;
      if (formData.purpose) {
        doc.text("Keperluan", margin + 10, yPosition);
        doc.text(`: ${formData.purpose}`, margin + 50, yPosition);
        yPosition += 8;
      }
    } else if (formData.certificateType === "surat_keterangan_pengantar") {
      doc.text(
        "Adalah benar penduduk Desa Dermolo yang berkelakuan baik",
        margin,
        yPosition
      );
      yPosition += 8;
      doc.text(
        "dan tidak pernah terlibat dalam kegiatan yang melanggar hukum.",
        margin,
        yPosition
      );
      yPosition += 10;
      if (formData.purpose) {
        doc.text("Keperluan", margin + 10, yPosition);
        doc.text(`: ${formData.purpose}`, margin + 50, yPosition);
        yPosition += 8;
      }
    }

    // RT/RW Letter reference
    yPosition += 10;
    if (formData.rtRwLetterNumber && formData.rtRwLetterDate) {
      doc.text(
        `Berdasarkan surat pengantar RT/RW No: ${formData.rtRwLetterNumber}`,
        margin,
        yPosition
      );
      yPosition += 8;
      doc.text(
        `tanggal ${new Date(formData.rtRwLetterDate).toLocaleDateString(
          "id-ID"
        )}`,
        margin,
        yPosition
      );
      yPosition += 15;
    }

    // Closing
    doc.text(
      "Demikian surat keterangan ini dibuat untuk dapat dipergunakan",
      margin,
      yPosition
    );
    yPosition += 8;
    doc.text("sebagaimana mestinya.", margin, yPosition);
    yPosition += 30;

    // Signature
    doc.text("Petinggi Dermolo", pageWidth - margin - 50, yPosition);
    yPosition += 30;
    doc.text(currentCouncil, pageWidth - margin - 50, yPosition);

    // Save PDF
    await saveCertificateToDatabase();
    const fileName = `surat_${formData.certificateType}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF Berhasil Dibuat!",
      description: `Surat telah disimpan sebagai ${fileName}`,
    });
  };

  const handlePreview = () => {
    if (!formData.applicantName.trim() || !formData.certificateType) {
      toast({
        title: "Data Belum Lengkap",
        description: "Silakan lengkapi data yang diperlukan untuk preview.",
        variant: "destructive",
      });
      return;
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const resetForm = () => {
    setFormData({
      certificateType: "",
      applicantName: "",
      placeOfBirth: "",
      dateOfBirth: "",
      occupation: "",
      address: "",
      rtRwLetterNumber: "",
      rtRwLetterDate: "",
    });
    setIsPreviewMode(false);
  };

  const renderFormFields = () => {
    if (!formData.certificateType) return null;

    return (
      <div className="space-y-6">
        {/* Common fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Nama Pemohon</Label>
            <Input
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleInputChange}
              placeholder="Nama lengkap pemohon"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth">Tempat Lahir</Label>
            <Input
              id="placeOfBirth"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleInputChange}
              placeholder="Tempat lahir"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Pekerjaan</Label>
            {formData.certificateType === "surat_keterangan_tidak_mampu" ? (
              <Select
                value={formData.occupation}
                onValueChange={(value) =>
                  handleSelectChange("occupation", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petani">Petani</SelectItem>
                  <SelectItem value="pedagang">Pedagang</SelectItem>
                  <SelectItem value="pns">PNS</SelectItem>
                  <SelectItem value="buruh">Buruh</SelectItem>
                  <SelectItem value="nelayan">Nelayan</SelectItem>
                  <SelectItem value="ibu_rumah_tangga">
                    Ibu Rumah Tangga
                  </SelectItem>
                  <SelectItem value="swasta">Karyawan Swasta</SelectItem>
                  <SelectItem value="tidak_bekerja">Tidak Bekerja</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Pekerjaan"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Alamat lengkap"
            className="min-h-[100px]"
          />
        </div>

        {/* Type-specific fields */}
        {formData.certificateType === "surat_keterangan_usaha" && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Informasi Usaha</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Usaha</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName || ""}
                  onChange={handleInputChange}
                  placeholder="Nama usaha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Jenis Usaha</Label>
                <Input
                  id="businessType"
                  name="businessType"
                  value={formData.businessType || ""}
                  onChange={handleInputChange}
                  placeholder="Jenis usaha"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Alamat Usaha</Label>
                <Textarea
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress || ""}
                  onChange={handleInputChange}
                  placeholder="Alamat usaha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessYears">Lama Usaha (Tahun)</Label>
                <Input
                  id="businessYears"
                  name="businessYears"
                  type="number"
                  value={formData.businessYears || ""}
                  onChange={handleInputChange}
                  placeholder="Lama usaha dalam tahun"
                />
              </div>
            </div>
          </div>
        )}

        {formData.certificateType === "surat_keterangan_tidak_mampu" && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Informasi Tambahan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Agama</Label>
                <Select
                  value={formData.religion}
                  onValueChange={(value) =>
                    handleSelectChange("religion", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="kristen">Kristen</SelectItem>
                    <SelectItem value="katolik">Katolik</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="buddha">Buddha</SelectItem>
                    <SelectItem value="konghucu">Konghucu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Keperluan</Label>
              <Textarea
                id="purpose"
                name="purpose"
                value={formData.purpose || ""}
                onChange={handleInputChange}
                placeholder="Untuk keperluan apa surat ini dibuat"
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}

        {formData.certificateType === "surat_keterangan_pengantar" && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Informasi Tambahan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nationality">Kewarganegaraan</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleInputChange}
                  placeholder="Indonesia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Agama</Label>
                <Select
                  value={formData.religion}
                  onValueChange={(value) =>
                    handleSelectChange("religion", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="kristen">Kristen</SelectItem>
                    <SelectItem value="katolik">Katolik</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="buddha">Buddha</SelectItem>
                    <SelectItem value="konghucu">Konghucu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="familyCardNumber">No. KK</Label>
                <Input
                  id="familyCardNumber"
                  name="familyCardNumber"
                  value={formData.familyCardNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Nomor Kartu Keluarga"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalIdNumber">NIK</Label>
                <Input
                  id="nationalIdNumber"
                  name="nationalIdNumber"
                  value={formData.nationalIdNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Nomor Induk Kependudukan"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purpose">Keperluan</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose || ""}
                  onChange={handleInputChange}
                  placeholder="Untuk keperluan apa surat ini dibuat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validFromDate">Berlaku Dari</Label>
                <Input
                  id="validFromDate"
                  name="validFromDate"
                  type="date"
                  value={formData.validFromDate || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Keterangan Lain</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleInputChange}
                placeholder="Keterangan tambahan jika ada"
              />
            </div>
          </div>
        )}

        {/* RT/RW Letter Information */}
        <div className="space-y-6 border-t pt-6">
          <h3 className="text-lg font-semibold">Surat Pengantar RT/RW</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rtRwLetterNumber">No. Surat RT/RW</Label>
              <Input
                id="rtRwLetterNumber"
                name="rtRwLetterNumber"
                value={formData.rtRwLetterNumber}
                onChange={handleInputChange}
                placeholder="Nomor surat pengantar RT/RW"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rtRwLetterDate">Tanggal Surat RT/RW</Label>
              <Input
                id="rtRwLetterDate"
                name="rtRwLetterDate"
                type="date"
                value={formData.rtRwLetterDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Generator Surat Desa Dermolo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buat berbagai jenis surat keterangan resmi Desa Dermolo dengan
            mudah. Pilih jenis surat dan isi formulir untuk menghasilkan PDF.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!isPreviewMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Buat Surat Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateType">Jenis Surat</Label>
                  <Select
                    value={formData.certificateType}
                    onValueChange={(value) =>
                      handleSelectChange("certificateType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surat_keterangan_usaha">
                        Surat Keterangan Usaha
                      </SelectItem>
                      <SelectItem value="surat_keterangan_tidak_mampu">
                        Surat Keterangan Tidak Mampu
                      </SelectItem>
                      <SelectItem value="surat_keterangan_pengantar">
                        Surat Keterangan Pengantar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderFormFields()}

                {formData.certificateType && (
                  <div className="flex flex-wrap gap-4 pt-6">
                    <Button onClick={handlePreview} variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Surat
                    </Button>
                    <Button
                      onClick={generatePDF}
                      disabled={!formData.applicantName.trim()}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Unduh PDF
                    </Button>
                    <Button onClick={resetForm} variant="ghost">
                      Reset Form
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-primary" />
                    Preview Surat
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={generatePDF} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Unduh PDF
                    </Button>
                    <Button onClick={handlePreview} variant="outline" size="sm">
                      Edit Surat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto space-y-6 font-serif">
                  {/* Header */}
                  <div className="border-b pb-4 flex w-full">
                    <div className="w-1/4">
                      <img
                        src={logoKabJepara}
                        alt="Logo Kabupaten Jepara"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="text-center w-full">
                      <h2 className="text-lg font-bold">
                        PEMERINTAH KABUPATEN JEPARA
                      </h2>
                      <h3 className="text-lg font-bold">KECAMATAN KEMBANG</h3>
                      <h3 className="text-lg font-bold">DESA DERMOLO</h3>
                      <p className="text-sm">Alamat: {officialAddress}</p>
                    </div>
                  </div>

                  {/* Letter Number and Date */}
                  <div className="flex justify-between text-sm">
                    <p>
                      Nomor:{" "}
                      {generateLetterNumber(
                        formData.certificateType as CertificateType
                      )}
                    </p>
                    <p>Dermolo, {new Date().toLocaleDateString("id-ID")}</p>
                  </div>

                  {/* Title */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold underline">
                      {formData.certificateType === "surat_keterangan_usaha" &&
                        "SURAT KETERANGAN USAHA"}
                      {formData.certificateType ===
                        "surat_keterangan_tidak_mampu" &&
                        "SURAT KETERANGAN TIDAK MAMPU"}
                      {formData.certificateType ===
                        "surat_keterangan_pengantar" &&
                        "SURAT KETERANGAN PENGANTAR"}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <div className="ml-4">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td className="pr-6">Nama</td>
                            <td className="pl-6">: {currentCouncil}</td>
                          </tr>
                          <tr>
                            <td className="pr-6">Jabatan</td>
                            <td className="pl-6">: Petinggi Dermolo</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p>Dengan ini menerangkan bahwa:</p>
                    <div className="ml-4">
                      <table className="table-auto w-full">
                        <tbody>
                          <tr>
                            <td className="pr-2">Nama</td>
                            <td className="pl-2">: {formData.applicantName}</td>
                          </tr>
                          {formData.placeOfBirth && formData.dateOfBirth && (
                            <tr>
                              <td className="pr-2">Tempat/Tgl Lahir</td>
                              <td className="pl-2">
                                :{" "}
                                {`${formData.placeOfBirth}, ${new Date(
                                  formData.dateOfBirth
                                ).toLocaleDateString("id-ID")}`}
                              </td>
                            </tr>
                          )}
                          {formData.occupation && (
                            <tr>
                              <td className="pr-2">Pekerjaan</td>
                              <td className="pl-2">: {formData.occupation}</td>
                            </tr>
                          )}
                          {formData.address && (
                            <tr>
                              <td className="pr-2">Alamat</td>
                              <td className="pl-2">: {formData.address}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Type-specific content preview */}
                    <div className="mt-4">
                      {formData.certificateType ===
                        "surat_keterangan_usaha" && (
                        <div>
                          <p>
                            Adalah benar penduduk Desa Dermolo yang menjalankan
                            usaha:
                          </p>
                          <table className="table-auto w-full mt-2">
                            <tbody>
                              {formData.businessName && (
                                <tr>
                                  <td className="pr-2">Nama Usaha</td>
                                  <td className="pl-2">
                                    : {formData.businessName}
                                  </td>
                                </tr>
                              )}
                              {formData.businessType && (
                                <tr>
                                  <td className="pr-2">Jenis Usaha</td>
                                  <td className="pl-2">
                                    : {formData.businessType}
                                  </td>
                                </tr>
                              )}
                              {formData.businessYears && (
                                <tr>
                                  <td className="pr-2">Lama Usaha</td>
                                  <td className="pl-2">
                                    : {formData.businessYears} tahun
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {formData.certificateType ===
                        "surat_keterangan_tidak_mampu" && (
                        <div>
                          <p>
                            Adalah benar penduduk Desa Dermolo yang termasuk
                            dalam kategori keluarga tidak mampu secara ekonomi.
                          </p>
                          {formData.purpose && (
                            <table className="table-auto w-full mt-2">
                              <tbody>
                                <tr>
                                  <td className="pr-2">Keperluan</td>
                                  <td className="pl-2">: {formData.purpose}</td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}

                      {formData.certificateType ===
                        "surat_keterangan_pengantar" && (
                        <div>
                          <p>
                            Adalah benar penduduk Desa Dermolo yang berkelakuan
                            baik dan tidak pernah terlibat dalam kegiatan yang
                            melanggar hukum.
                          </p>
                          {formData.purpose && (
                            <table className="table-auto w-full mt-2">
                              <tbody>
                                <tr>
                                  <td className="pr-2">Keperluan</td>
                                  <td className="pl-2">: {formData.purpose}</td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>

                    {formData.rtRwLetterNumber && formData.rtRwLetterDate && (
                      <p>
                        Berdasarkan surat pengantar RT/RW No:{" "}
                        {formData.rtRwLetterNumber} tanggal{" "}
                        {new Date(formData.rtRwLetterDate).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    )}

                    <p>
                      Demikian surat keterangan ini dibuat untuk dapat
                      dipergunakan sebagaimana mestinya.
                    </p>

                    {/* Signature */}
                    <div className="text-right mt-8">
                      <p>Petinggi Dermolo</p>
                      <div className="mt-16">
                        <p className="font-bold">{currentCouncil}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
