import {
  BookOpen,
  Building2,
  GraduationCap,
  Globe,
  Users,
  FileText,
  Briefcase,
  School,
  Phone,
  Search,
  Library,
  FlaskConical,
  Handshake,
  Heart,
  UserCircle,
  Home,
  Award,
  LayoutGrid,
  Landmark,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type MenuItemType = "link" | "dropdown" | "mega" | "deeplink";
export type LayoutType = "group" | "column";
export type NavPosition = "left" | "right";

export type MenuItem = {
  id: string;
  label: string;
  href?: string;
  description?: string;
  icon?: LucideIcon;
  children?: MenuItem[];
  type?: MenuItemType;
  layout?: LayoutType;
  columns?: number;
  featured?: boolean;
  isExternal?: boolean;
  position?: NavPosition;
};

export const menuData: MenuItem[] = [
  {
    id: "gioi-thieu",
    label: "Giới thiệu",
    type: "mega",
    layout: "group",
    position: "left",
    children: [
      {
        id: "tong-quan",
        label: "Tổng quan",
        children: [
          {
            id: "thong-diep-hieu-truong",
            label: "Thông điệp của Hiệu trưởng",
            href: "/gioi-thieu/thong-diep-hieu-truong",
            icon: UserCircle,
          },
          {
            id: "lich-su",
            label: "Lịch sử hình thành và phát triển",
            href: "/gioi-thieu/lich-su",
            icon: BookOpen,
          },
          {
            id: "tam-nhin",
            label: "Tầm nhìn - Sứ mạng",
            href: "/gioi-thieu/tam-nhin-su-mang",
            icon: Award,
          },
          {
            id: "thanh-tich",
            label: "Thành tích của Nhà trường",
            href: "/gioi-thieu/thanh-tich",
            icon: Award,
          },
        ],
      },
      {
        id: "quan-tri",
        label: "Quản trị",
        children: [
          {
            id: "dang-bo",
            label: "Đảng bộ",
            href: "https://dangbo.hcmute.edu.vn/",
            icon: Landmark,
            isExternal: true,
          },
          {
            id: "hoi-dong-truong",
            label: "Hội đồng Trường",
            href: "/gioi-thieu/hoi-dong-truong",
            icon: Users,
          },
          {
            id: "ban-giam-hieu",
            label: "Ban Giám hiệu",
            href: "/gioi-thieu/ban-giam-hieu",
            icon: UserCircle,
          },
        ],
      },
      {
        id: "thuong-hieu",
        label: "Thương hiệu",
        children: [
          {
            id: "phong-truyen-thong-so",
            label: "Phòng Truyền thống số",
            href: "https://phongtruyenthongso.hcmute.edu.vn/",
            icon: Home,
            isExternal: true,
          },
          {
            id: "bo-nhan-dien",
            label: "Bộ nhận diện thương hiệu",
            href: "/gioi-thieu/bo-nhan-dien-thuong-hieu",
            icon: LayoutGrid,
          },
          {
            id: "hcmute-360",
            label: "HCMUTE 360 Virtual Tour",
            href: "https://360.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
        ],
      },
      {
        id: "co-cau-to-chuc",
        label: "Cơ cấu tổ chức",
        children: [
          {
            id: "so-do-to-chuc",
            label: "Sơ đồ tổ chức",
            href: "/gioi-thieu/so-do-to-chuc",
            icon: LayoutGrid,
          },
          {
            id: "lanh-dao-don-vi",
            label: "Lãnh đạo đơn vị",
            href: "/gioi-thieu/lanh-dao-don-vi",
            icon: Users,
          },
          {
            id: "lanh-dao-khoa",
            label: "Lãnh đạo Khoa",
            href: "/gioi-thieu/lanh-dao-khoa",
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    id: "don-vi",
    label: "Đơn vị",
    type: "mega",
    layout: "column",
    columns: 3,
    position: "left",
    children: [
      {
        id: "khoa-vien",
        label: "Khoa / Viện",
        children: [
          {
            id: "khoa-dien",
            label: "Khoa Điện - Điện tử",
            href: "https://feee.hcmute.edu.vn/",
            icon: FlaskConical,
            isExternal: true,
          },
          {
            id: "khoa-ckctm",
            label: "Khoa Cơ khí Chế tạo máy",
            href: "https://fme.hcmute.edu.vn/",
            icon: Building2,
            isExternal: true,
          },
          {
            id: "khoa-kinh-te",
            label: "Khoa Kinh tế",
            href: "https://fe.hcmute.edu.vn/",
            icon: Briefcase,
            isExternal: true,
          },
          {
            id: "khoa-ckdl",
            label: "Khoa Cơ khí Động lực",
            href: "https://fae.hcmute.edu.vn/",
            icon: Building2,
            isExternal: true,
          },
          {
            id: "khoa-cntt",
            label: "Khoa Công nghệ Thông tin",
            href: "https://fit.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "khoa-xay-dung",
            label: "Khoa Xây dựng",
            href: "https://fce.hcmute.edu.vn/",
            icon: Building2,
            isExternal: true,
          },
        ],
      },
      {
        id: "phong-ban",
        label: "Phòng / Ban",
        children: [
          {
            id: "phong-dao-tao",
            label: "Phòng Đào tạo",
            href: "https://aao.hcmute.edu.vn/",
            icon: GraduationCap,
            isExternal: true,
          },
          {
            id: "phong-khcn",
            label: "Phòng Khoa học Công nghệ",
            href: "https://stiao.hcmute.edu.vn/",
            icon: FlaskConical,
            isExternal: true,
          },
          {
            id: "phong-tchc",
            label: "Phòng Tổ chức Hành chính",
            href: "https://hrmo.hcmute.edu.vn/",
            icon: FileText,
            isExternal: true,
          },
          {
            id: "phong-khtc",
            label: "Phòng Kế hoạch Tài chính",
            href: "https://fpo.hcmute.edu.vn/",
            icon: Briefcase,
            isExternal: true,
          },
          {
            id: "phong-tuyensinh",
            label: "Phòng Tuyển sinh và CTSV",
            href: "https://sao.hcmute.edu.vn/",
            icon: Users,
            isExternal: true,
          },
          {
            id: "thu-vien",
            label: "Thư viện",
            href: "https://lib.hcmute.edu.vn/",
            icon: Library,
            isExternal: true,
          },
        ],
      },
      {
        id: "trung-tam",
        label: "Trung tâm",
        children: [
          {
            id: "tt-dayhocsso",
            label: "Trung tâm Dạy học số",
            href: "https://dlc.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "tt-sangtao",
            label: "Trung tâm Sáng tạo & Khởi nghiệp",
            href: "https://cisat.hcmute.edu.vn/",
            icon: FlaskConical,
            isExternal: true,
          },
          {
            id: "tt-maytinh",
            label: "Trung tâm Thông tin – Máy tính",
            href: "https://iic.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "tt-tinhoc",
            label: "Trung tâm Tin học",
            href: "https://trungtamtinhoc.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "tt-ngoaingu",
            label: "Trung tâm Ngoại ngữ",
            href: "https://ttnn.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
        ],
      },
    ],
  },
  {
    id: "tuyen-sinh",
    label: "Tuyển sinh",
    type: "dropdown",
    position: "left",
    children: [
      {
        id: "ts-dai-hoc",
        label: "Đại học",
        href: "https://tuyensinh.hcmute.edu.vn/",
        icon: GraduationCap,
        description: "Thông tin tuyển sinh đại học chính quy",
        isExternal: true,
      },
      {
        id: "ts-sau-dai-hoc",
        label: "Sau Đại học",
        href: "https://sdh.hcmute.edu.vn/",
        icon: Award,
        description: "Tuyển sinh Thạc sĩ, Tiến sĩ",
        isExternal: true,
      },
      {
        id: "ts-vlvh",
        label: "Hệ Vừa làm Vừa học",
        href: "https://nmo.hcmute.edu.vn/",
        icon: BookOpen,
        description: "Đào tạo liên thông, văn bằng 2",
        isExternal: true,
      },
      {
        id: "ts-tu-xa",
        label: "Hệ Đào tạo Từ xa",
        href: "https://daotaotuxa.hcmute.edu.vn/",
        icon: Globe,
        description: "Học trực tuyến linh hoạt",
        isExternal: true,
      },
      {
        id: "ts-quoc-te",
        label: "Hợp tác Đào tạo Quốc tế",
        href: "https://fie.hcmute.edu.vn/",
        icon: Globe,
        description: "Chương trình liên kết quốc tế",
        isExternal: true,
      },
    ],
  },
  {
    id: "dao-tao",
    label: "Đào tạo",
    type: "mega",
    layout: "group",
    position: "right",
    children: [
      {
        id: "he-dao-tao",
        label: "Hệ đào tạo",
        children: [
          {
            id: "dt-dai-hoc",
            label: "Đại học",
            href: "https://aao.hcmute.edu.vn/",
            icon: GraduationCap,
            isExternal: true,
          },
          {
            id: "dt-sau-dai-hoc",
            label: "Sau Đại học",
            href: "https://sdh.hcmute.edu.vn/",
            icon: Award,
            isExternal: true,
          },
          {
            id: "dt-vlvh",
            label: "Hệ Vừa làm Vừa học",
            href: "https://nmo.hcmute.edu.vn/",
            icon: BookOpen,
            isExternal: true,
          },
          {
            id: "dt-tu-xa",
            label: "Hệ Đào tạo Từ xa",
            href: "https://daotaotuxa.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
        ],
      },
      {
        id: "chuong-trinh",
        label: "Chương trình",
        children: [
          {
            id: "ctdt",
            label: "Chương trình đào tạo",
            href: "/dao-tao/chuong-trinh-dao-tao",
            icon: FileText,
          },
          {
            id: "ctdt-clc",
            label: "Chương trình Chất lượng cao",
            href: "https://fhq.hcmute.edu.vn/",
            icon: Award,
            isExternal: true,
          },
          {
            id: "triet-ly-gd",
            label: "Triết lý giáo dục",
            href: "/dao-tao/triet-ly-giao-duc",
            icon: BookOpen,
          },
        ],
      },
      {
        id: "kiem-dinh",
        label: "Kiểm định chất lượng",
        children: [
          {
            id: "kiem-dinh-cl",
            label: "Kiểm định chất lượng",
            href: "https://uteqa.hcmute.edu.vn/",
            icon: Award,
            isExternal: true,
          },
          {
            id: "aun-qa",
            label: "Các ngành đạt chuẩn AUN-QA",
            href: "/dao-tao/aun-qa",
            icon: Award,
          },
        ],
      },
    ],
  },
  {
    id: "nghien-cuu",
    label: "Nghiên cứu",
    type: "dropdown",
    position: "right",
    children: [
      {
        id: "hoat-dong-khcn",
        label: "Hoạt động Khoa học Công nghệ",
        href: "https://stiao.hcmute.edu.vn/",
        icon: FlaskConical,
        description: "Thông tin hoạt động NCKH",
        isExternal: true,
      },
      {
        id: "tap-chi",
        label: "Tạp chí Khoa học Giáo dục Kỹ thuật",
        href: "https://jte.edu.vn/index.php/jte",
        icon: BookOpen,
        description: "Tạp chí khoa học của Trường",
        isExternal: true,
      },
      {
        id: "du-an-qt",
        label: "Dự án Quốc tế",
        href: "/nghien-cuu/du-an-quoc-te",
        icon: Globe,
        description: "Các dự án hợp tác quốc tế",
      },
      {
        id: "hd-gs-cs",
        label: "Hội đồng Giáo sư Cơ sở",
        href: "https://hdgscs.hcmute.edu.vn/",
        icon: Users,
        description: "Thông tin Hội đồng GS cơ sở",
        isExternal: true,
      },
    ],
  },
  {
    id: "doi-ngoai",
    label: "Đối ngoại",
    type: "dropdown",
    position: "right",
    children: [
      {
        id: "qh-doanh-nghiep",
        label: "Quan hệ Doanh nghiệp",
        href: "https://pr.hcmute.edu.vn/",
        icon: Handshake,
        description: "Hợp tác với doanh nghiệp",
        isExternal: true,
      },
      {
        id: "qh-quoc-te",
        label: "Quan hệ Quốc tế",
        href: "https://oia.hcmute.edu.vn/",
        icon: Globe,
        description: "Hợp tác quốc tế",
        isExternal: true,
      },
      {
        id: "phuc-vu-cong-dong",
        label: "Phục vụ Cộng đồng",
        href: "https://volunteer.hcmute.edu.vn/",
        icon: Heart,
        description: "Hoạt động tình nguyện",
        isExternal: true,
      },
    ],
  },
  {
    id: "nguoi-hoc",
    label: "Người học",
    type: "mega",
    layout: "group",
    position: "right",
    children: [
      {
        id: "he-thong-hoc-tap",
        label: "Hệ thống học tập",
        children: [
          {
            id: "lms",
            label: "Dạy học số (LMS)",
            href: "https://lms.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "utex-lms",
            label: "UTEx LMS",
            href: "https://utexlms.hcmute.edu.vn/",
            icon: Globe,
            isExternal: true,
          },
          {
            id: "thong-tin-hoc-vu",
            label: "Thông tin học vụ",
            href: "https://online.hcmute.edu.vn/",
            icon: FileText,
            isExternal: true,
          },
          {
            id: "dang-ky-mon-hoc",
            label: "Đăng ký môn học",
            href: "https://dkmh.hcmute.edu.vn/",
            icon: ScrollText,
            isExternal: true,
          },
        ],
      },
      {
        id: "ho-tro-sv",
        label: "Hỗ trợ sinh viên",
        children: [
          {
            id: "tu-van-sv",
            label: "Tư vấn hỗ trợ sinh viên",
            href: "https://tuvansinhvien.hcmute.edu.vn/",
            icon: Users,
            isExternal: true,
          },
          {
            id: "so-tay-sv",
            label: "Sổ tay sinh viên",
            href: "https://handbook.hcmute.edu.vn/",
            icon: BookOpen,
            isExternal: true,
          },
          {
            id: "hoc-bong-qt",
            label: "Học bổng Quốc tế",
            href: "/nguoi-hoc/hoc-bong-quoc-te",
            icon: Award,
          },
        ],
      },
      {
        id: "cong-dong",
        label: "Cộng đồng",
        children: [
          {
            id: "cuu-sv",
            label: "Cựu sinh viên",
            href: "https://alumni.hcmute.edu.vn/",
            icon: Users,
            isExternal: true,
          },
          {
            id: "doan-hoi",
            label: "Đoàn Thanh niên - Hội Sinh viên",
            href: "https://tuoitre.hcmute.edu.vn/",
            icon: Users,
            isExternal: true,
          },
        ],
      },
    ],
  }
];
