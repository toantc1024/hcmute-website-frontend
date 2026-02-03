"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = {
  about: [
    { label: "Giới thiệu", href: "/gioi-thieu" },
    { label: "Lịch sử phát triển", href: "/lich-su" },
    { label: "Sứ mệnh & Tầm nhìn", href: "/su-menh" },
    { label: "Ban lãnh đạo", href: "/ban-lanh-dao" },
    { label: "Cơ cấu tổ chức", href: "/co-cau-to-chuc" },
  ],
  education: [
    { label: "Chương trình đào tạo", href: "/dao-tao" },
    { label: "Tuyển sinh", href: "/tuyen-sinh" },
    { label: "Đào tạo sau đại học", href: "/sau-dai-hoc" },
    { label: "Đào tạo quốc tế", href: "/quoc-te" },
    { label: "Nghiên cứu khoa học", href: "/nghien-cuu" },
  ],
  students: [
    { label: "Cổng thông tin sinh viên", href: "/sinh-vien" },
    { label: "Thư viện", href: "/thu-vien" },
    { label: "Ký túc xá", href: "/ky-tuc-xa" },
    { label: "Học bổng", href: "/hoc-bong" },
    { label: "Việc làm", href: "/viec-lam" },
  ],
  contact: [
    { label: "Liên hệ", href: "/lien-he" },
    { label: "Bản đồ", href: "/ban-do" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/hcmute",
    label: "Facebook",
    color: "hover:text-blue-500",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/hcmute",
    label: "Youtube",
    color: "hover:text-red-500",
  },
  {
    icon: Globe,
    href: "https://hcmute.edu.vn",
    label: "Website",
    color: "hover:text-green-500",
  },
];

const AGENT_BACKGROUND = "/assets/agent-cta-background.webp";
const FLOWER_WHITE = "/assets/FLOWER_UTE_WHITE.png";

export default function Footer() {
  return (
    <footer className="relative bg-blue-600 text-white overflow-hidden">
      {/* Background art like university-leadership */}
      <div className="absolute inset-0">
        <Image
          src={AGENT_BACKGROUND}
          alt=""
          fill
          className="object-cover opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-blue-600/70" />

      {/* Decorative flower in top-right corner - overflows outside but clipped */}
      <motion.div
        className="absolute -top-50 -right-72 rotate-0 w-144 h-144 opacity-45 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 0.45, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Image src={FLOWER_WHITE} alt="" fill className="object-contain" />
      </motion.div>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

      <div className="relative">
        <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo/rectangle-logo.png"
                  alt="HCM-UTE Logo"
                  width={180}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>

              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Trường Đại học Công nghệ Kỹ Thuật TP. Hồ Chí Minh - Trường trọng
                điểm quốc gia về kỹ thuật và công nghệ, tiên phong trong đào tạo
                nguồn nhân lực chất lượng cao.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-blue-100">
                  <MapPin className="w-4 h-4 mt-1 text-white shrink-0" />
                  <span>
                    01 Võ Văn Ngân, Phường Thủ Đức, TP. Hồ Chí
                    Minh
                  </span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <span>(028) 38 968 641</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <span>bmc@hcmute.edu.vn</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className="p-2 rounded-full bg-white/10 border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:bg-white/20"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    Giới thiệu
                  </h3>
                  <ul className="space-y-2">
                    {footerLinks.about.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-blue-100 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    Đào tạo
                  </h3>
                  <ul className="space-y-2">
                    {footerLinks.education.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-blue-100 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    Sinh viên
                  </h3>
                  <ul className="space-y-2">
                    {footerLinks.students.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-blue-100 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    Liên hệ
                  </h3>
                  <ul className="space-y-2">
                    {footerLinks.contact.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-blue-100 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20">
          <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-40 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-blue-100 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Trường Đại học Công nghệ Kỹ Thuật
                TP. Hồ Chí Minh. All rights reserved.
              </p>
              <p className="text-blue-200 text-xs">
                Thực hiện bởi Phòng Quản trị Thương hiệu & Truyền thông
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
