"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Bot,
  Video,
  Mail,
  FileText,
  UserCircle,
  ExternalLink,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import type { ElementType } from "react";

import { useI18n } from "@/lib/i18n";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface UtilityCardProps {
  name: string;
  description: string;
  icon: ElementType;
  href: string;
  iconColor?: string;
  bgColor?: string;
}

function UtilityCard({
  name,
  description,
  icon: Icon,
  href,
  iconColor = "text-primary",
  bgColor = "bg-primary/10",
}: UtilityCardProps) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group cursor-pointer bg-white/60 backdrop-blur-sm border-muted/50 hover:bg-white/80">
          <CardContent className="p-6 h-full">
            <div className="flex items-start gap-4 h-full">
              <div
                className={`size-14 rounded-xl ${bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}
              >
                <Icon className={`size-7 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground/80 bg-white/50"
                  >
                    <ExternalLink className="size-3 mr-1" />
                    External
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

export default function UtilitiesPage() {
  const { t } = useI18n();

  const ecosystemApps = [
    {
      name: t.utilities.apps.eLearning.name,
      description: t.utilities.apps.eLearning.description,
      icon: GraduationCap,
      href: "https://lms.hcmute.edu.vn",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: t.utilities.apps.eOffice.name,
      description: t.utilities.apps.eOffice.description,
      icon: Briefcase,
      href: "https://eoffice.hcmute.edu.vn",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  const aiAndTools = [
    {
      name: t.utilities.apps.aiAssistant.name,
      description: t.utilities.apps.aiAssistant.description,
      icon: Bot,
      href: "https://ai.hcmute.edu.vn",
      iconColor: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      name: t.utilities.apps.liveHub.name,
      description: t.utilities.apps.liveHub.description,
      icon: Video,
      href: "https://live.hcmute.edu.vn",
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      name: t.utilities.apps.uteEmail.name,
      description: t.utilities.apps.uteEmail.description,
      icon: Mail,
      href: "https://mail.hcmute.edu.vn",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: t.utilities.apps.uteForm.name,
      description: t.utilities.apps.uteForm.description,
      icon: FileText,
      href: "https://form.hcmute.edu.vn",
      iconColor: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      name: t.utilities.apps.uteAvatar.name,
      description: t.utilities.apps.uteAvatar.description,
      icon: UserCircle,
      href: "https://avatar.hcmute.edu.vn",
      iconColor: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      name: "Short Link",
      description: "Tạo và quản lý link rút gọn với domain link.hcmute.edu.vn",
      icon: LinkIcon,
      href: "https://link.hcmute.edu.vn",
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div variants={itemVariants} className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100/50 rounded-lg backdrop-blur-sm shadow-sm ring-1 ring-blue-100">
                <Sparkles className="size-6 text-blue-600" />
            </div>
             <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {t.utilities.title}
             </h1>
        </div>
         <p className="text-muted-foreground mt-1 max-w-2xl">{t.utilities.description}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="size-5 text-blue-500" />
            {t.utilities.ecosystem}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ecosystemApps.map((app) => (
            <UtilityCard key={app.name} {...app} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bot className="size-5 text-violet-500" />
            {t.utilities.aiAndTools}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiAndTools.map((app) => (
            <UtilityCard key={app.name} {...app} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
