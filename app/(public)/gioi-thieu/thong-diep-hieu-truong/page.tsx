import { Metadata } from "next";
import RectorMessageContent from "./content";

export const metadata: Metadata = {
  title: "Thông điệp Hiệu trưởng | HCM-UTE",
  description:
    "Thông điệp từ PGS. TS. Lê Hiếu Giang - Hiệu trưởng Trường Đại học Công nghệ Kỹ thuật TP.HCM (HCM-UTE). Tự hào với lịch sử hơn 60 năm hình thành và phát triển.",
  openGraph: {
    title: "Thông điệp Hiệu trưởng | HCM-UTE",
    description:
      "Lời chào mừng và thông điệp từ PGS. TS. Lê Hiếu Giang - Hiệu trưởng Trường Đại học Công nghệ Kỹ thuật TP.HCM.",
    images: ["/PGS_TS_LGH.png"],
  },
};

// Main page component
export default function RectorMessagePage() {
  return <RectorMessageContent />;
}
