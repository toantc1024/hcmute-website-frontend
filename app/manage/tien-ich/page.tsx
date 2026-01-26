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
} from "lucide-react";

import { useI18n } from "@/lib/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  icon: React.ElementType;
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
    <motion.div variants={itemVariants}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="overflow-hidden h-full transition-all hover:shadow-lg hover:border-primary/50 group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`size-14 rounded-xl ${bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className={`size-7 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
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
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">{t.utilities.title}</h1>
        <p className="text-muted-foreground mt-1">{t.utilities.description}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">{t.utilities.ecosystem}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ecosystemApps.map((app) => (
            <UtilityCard key={app.name} {...app} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">{t.utilities.aiAndTools}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiAndTools.map((app) => (
            <UtilityCard key={app.name} {...app} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
