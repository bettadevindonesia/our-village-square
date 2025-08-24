import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Eye } from "lucide-react";
import jsPDF from "jspdf";

type CertificateType = "business" | "indigency" | "introductory";

interface FormData {
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

const CertificateGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    certificateType: "",
    applicantName: "",
    placeOfBirth: "",
    dateOfBirth: "",
    occupation: "",
    address: "",
    rtRwLetterNumber: "",
    rtRwLetterDate: ""
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateLetterNumber = (type: CertificateType): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const sequentialNumber = Math.floor(Math.random() * 999) + 1;
    
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const romanMonth = romanNumerals[month - 1];
    
    const typePrefix = {
      business: "510",
      indigency: "440", 
      introductory: "474.6"
    };
    
    return `${typePrefix[type]} / ${sequentialNumber.toString().padStart(3, '0')} / ${romanMonth} / ${year}`;
  };

  const generatePDF = () => {
    if (!formData.certificateType) {
      toast({
        title: "Tipe Surat Belum Dipilih",
        description: "Silakan pilih tipe surat terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PEMERINTAH KABUPATEN JEPARA", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("KECAMATAN KEMBANG", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("DESA DERMOLO", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Alamat: Jl.Beringin No.01 Dermolo 59453", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Letter number and date
    const letterNumber = generateLetterNumber(formData.certificateType as CertificateType);
    doc.setFontSize(12);
    doc.text(`Nomor: ${letterNumber}`, margin, yPosition);
    doc.text(`Dermolo, ${new Date().toLocaleDateString('id-ID')}`, pageWidth - margin - 60, yPosition);
    yPosition += 20;

    // Letter title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    let title = "";
    switch (formData.certificateType) {
      case "business":
        title = "SURAT KETERANGAN USAHA";
        break;
      case "indigency":
        title = "SURAT KETERANGAN TIDAK MAMPU";
        break;
      case "introductory":
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
    doc.text(": RIYATI", margin + 50, yPosition);
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
      doc.text(`: ${formData.placeOfBirth}, ${new Date(formData.dateOfBirth).toLocaleDateString('id-ID')}`, margin + 50, yPosition);
      yPosition += 8;
    }
    
    if (formData.occupation) {
      doc.text("Pekerjaan", margin + 10, yPosition);
      doc.text(`: ${formData.occupation}`, margin + 50, yPosition);
      yPosition += 8;
    }
    
    if (formData.address) {
      doc.text("Alamat", margin + 10, yPosition);
      const addressLines = doc.splitTextToSize(`: ${formData.address}`, pageWidth - margin - 60);
      doc.text(addressLines[0], margin + 50, yPosition);
      for (let i = 1; i < addressLines.length; i++) {
        yPosition += 6;
        doc.text(addressLines[i], margin + 50, yPosition);
      }
      yPosition += 8;
    }

    // Type-specific content
    yPosition += 5;
    if (formData.certificateType === "business") {
      doc.text("Adalah benar penduduk Desa Dermolo yang menjalankan usaha:", margin, yPosition);
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
    } else if (formData.certificateType === "indigency") {
      doc.text("Adalah benar penduduk Desa Dermolo yang termasuk dalam kategori", margin, yPosition);
      yPosition += 8;
      doc.text("keluarga tidak mampu secara ekonomi.", margin, yPosition);
      yPosition += 10;
      if (formData.purpose) {
        doc.text("Keperluan", margin + 10, yPosition);
        doc.text(`: ${formData.purpose}`, margin + 50, yPosition);
        yPosition += 8;
      }
    } else if (formData.certificateType === "introductory") {
      doc.text("Adalah benar penduduk Desa Dermolo yang berkelakuan baik", margin, yPosition);
      yPosition += 8;
      doc.text("dan tidak pernah terlibat dalam kegiatan yang melanggar hukum.", margin, yPosition);
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
      doc.text(`Berdasarkan surat pengantar RT/RW No: ${formData.rtRwLetterNumber}`, margin, yPosition);
      yPosition += 8;
      doc.text(`tanggal ${new Date(formData.rtRwLetterDate).toLocaleDateString('id-ID')}`, margin, yPosition);
      yPosition += 15;
    }

    // Closing
    doc.text("Demikian surat keterangan ini dibuat untuk dapat dipergunakan", margin, yPosition);
    yPosition += 8;
    doc.text("sebagaimana mestinya.", margin, yPosition);
    yPosition += 30;

    // Signature
    doc.text("Petinggi Dermolo", pageWidth - margin - 50, yPosition);
    yPosition += 30;
    doc.text("RIYATI", pageWidth - margin - 50, yPosition);

    // Save PDF
    const fileName = `surat_${formData.certificateType}_${new Date().toISOString().split('T')[0]}.pdf`;
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
        variant: "destructive"
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
      rtRwLetterDate: ""
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
            {formData.certificateType === "indigency" ? (
              <Select value={formData.occupation} onValueChange={(value) => handleSelectChange("occupation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petani">Petani</SelectItem>
                  <SelectItem value="pedagang">Pedagang</SelectItem>
                  <SelectItem value="pns">PNS</SelectItem>
                  <SelectItem value="buruh">Buruh</SelectItem>
                  <SelectItem value="nelayan">Nelayan</SelectItem>
                  <SelectItem value="ibu_rumah_tangga">Ibu Rumah Tangga</SelectItem>
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
        {formData.certificateType === "business" && (
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

        {formData.certificateType === "indigency" && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Informasi Tambahan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
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
                <Select value={formData.religion} onValueChange={(value) => handleSelectChange("religion", value)}>
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

        {formData.certificateType === "introductory" && (
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
                <Select value={formData.religion} onValueChange={(value) => handleSelectChange("religion", value)}>
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

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Generator Surat Desa Dermolo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buat berbagai jenis surat keterangan resmi Desa Dermolo dengan mudah.
            Pilih jenis surat dan isi formulir untuk menghasilkan PDF.
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
                    onValueChange={(value) => handleSelectChange("certificateType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Surat Keterangan Usaha</SelectItem>
                      <SelectItem value="indigency">Surat Keterangan Tidak Mampu</SelectItem>
                      <SelectItem value="introductory">Surat Keterangan Pengantar</SelectItem>
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
                    <Button onClick={generatePDF} disabled={!formData.applicantName.trim()}>
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
                  <div className="text-center border-b pb-4">
                    <h2 className="text-lg font-bold">PEMERINTAH KABUPATEN JEPARA</h2>
                    <h3 className="text-lg font-bold">KECAMATAN KEMBANG</h3>
                    <h3 className="text-lg font-bold">DESA DERMOLO</h3>
                    <p className="text-sm">Alamat: Jl.Beringin No.01 Dermolo 59453</p>
                  </div>

                  {/* Letter Number and Date */}
                  <div className="flex justify-between text-sm">
                    <p>Nomor: {generateLetterNumber(formData.certificateType as CertificateType)}</p>
                    <p>Dermolo, {new Date().toLocaleDateString('id-ID')}</p>
                  </div>

                  {/* Title */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold underline">
                      {formData.certificateType === "business" && "SURAT KETERANGAN USAHA"}
                      {formData.certificateType === "indigency" && "SURAT KETERANGAN TIDAK MAMPU"}
                      {formData.certificateType === "introductory" && "SURAT KETERANGAN PENGANTAR"}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <div className="ml-4 space-y-1">
                      <p>Nama : RIYATI</p>
                      <p>Jabatan : Petinggi Dermolo</p>
                    </div>
                    
                    <p>Dengan ini menerangkan bahwa:</p>
                    <div className="ml-4 space-y-1">
                      <p>Nama : {formData.applicantName}</p>
                      {formData.placeOfBirth && formData.dateOfBirth && (
                        <p>Tempat/Tgl Lahir : {formData.placeOfBirth}, {new Date(formData.dateOfBirth).toLocaleDateString('id-ID')}</p>
                      )}
                      {formData.occupation && <p>Pekerjaan : {formData.occupation}</p>}
                      {formData.address && <p>Alamat : {formData.address}</p>}
                    </div>

                    {/* Type-specific content preview */}
                    <div className="mt-4">
                      {formData.certificateType === "business" && (
                        <div>
                          <p>Adalah benar penduduk Desa Dermolo yang menjalankan usaha:</p>
                          <div className="ml-4 space-y-1 mt-2">
                            {formData.businessName && <p>Nama Usaha : {formData.businessName}</p>}
                            {formData.businessType && <p>Jenis Usaha : {formData.businessType}</p>}
                            {formData.businessYears && <p>Lama Usaha : {formData.businessYears} tahun</p>}
                          </div>
                        </div>
                      )}
                      
                      {formData.certificateType === "indigency" && (
                        <div>
                          <p>Adalah benar penduduk Desa Dermolo yang termasuk dalam kategori keluarga tidak mampu secara ekonomi.</p>
                          {formData.purpose && (
                            <div className="ml-4 mt-2">
                              <p>Keperluan : {formData.purpose}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {formData.certificateType === "introductory" && (
                        <div>
                          <p>Adalah benar penduduk Desa Dermolo yang berkelakuan baik dan tidak pernah terlibat dalam kegiatan yang melanggar hukum.</p>
                          {formData.purpose && (
                            <div className="ml-4 mt-2">
                              <p>Keperluan : {formData.purpose}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {formData.rtRwLetterNumber && formData.rtRwLetterDate && (
                      <p>Berdasarkan surat pengantar RT/RW No: {formData.rtRwLetterNumber} tanggal {new Date(formData.rtRwLetterDate).toLocaleDateString('id-ID')}</p>
                    )}

                    <p>Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>

                    {/* Signature */}
                    <div className="text-right mt-8">
                      <p>Petinggi Dermolo</p>
                      <div className="mt-16">
                        <p className="font-bold">RIYATI</p>
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