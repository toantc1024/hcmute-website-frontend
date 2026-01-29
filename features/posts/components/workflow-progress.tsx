"use client";

import { Check, Clock, X, CircleDot, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PostStatus,
  ReviewLevel,
  ReviewerDecision,
  type PostReviewerView,
} from "@/features/posts";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WorkflowStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending" | "rejected";
  reviewLevel?: ReviewLevel;
  reviewers?: PostReviewerView[];
}

function getWorkflowSteps(
  postStatus: PostStatus,
  reviewers: PostReviewerView[] = [],
): WorkflowStep[] {
  const steps: WorkflowStep[] = [
    {
      id: "draft",
      label: "Nháp",
      status: "pending",
    },
    {
      id: "pending",
      label: "Chờ duyệt",
      status: "pending",
    },
    {
      id: "unit_editor",
      label: "Biên tập viên",
      status: "pending",
      reviewLevel: ReviewLevel.UNIT_EDITOR,
      reviewers: reviewers.filter(
        (r) => r.reviewLevel === ReviewLevel.UNIT_EDITOR,
      ),
    },
    {
      id: "unit_leader",
      label: "Trưởng đơn vị",
      status: "pending",
      reviewLevel: ReviewLevel.UNIT_LEADER,
      reviewers: reviewers.filter(
        (r) => r.reviewLevel === ReviewLevel.UNIT_LEADER,
      ),
    },
    {
      id: "unit_admin",
      label: "Quản trị đơn vị",
      status: "pending",
      reviewLevel: ReviewLevel.UNIT_ADMIN,
      reviewers: reviewers.filter(
        (r) => r.reviewLevel === ReviewLevel.UNIT_ADMIN,
      ),
    },
    {
      id: "school_admin",
      label: "Quản trị trường",
      status: "pending",
      reviewLevel: ReviewLevel.SCHOOL_ADMIN,
      reviewers: reviewers.filter(
        (r) => r.reviewLevel === ReviewLevel.SCHOOL_ADMIN,
      ),
    },
    {
      id: "published",
      label: "Xuất bản",
      status: "pending",
    },
  ];

  switch (postStatus) {
    case PostStatus.DRAFT:
      steps[0].status = "current";
      break;
    case PostStatus.PENDING:
      steps[0].status = "completed";
      steps[1].status = "current";
      break;
    case PostStatus.APPROVED_BY_UNIT_EDITOR:
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "current";
      break;
    case PostStatus.APPROVED_BY_UNIT_LEADER:
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "completed";
      steps[4].status = "current";
      break;
    case PostStatus.APPROVED_BY_UNIT_ADMIN:
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "completed";
      steps[4].status = "completed";
      steps[5].status = "current";
      break;
    case PostStatus.APPROVED_BY_SCHOOL_ADMIN:
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "completed";
      steps[4].status = "completed";
      steps[5].status = "completed";
      steps[6].status = "current";
      break;
    case PostStatus.PUBLISHED:
      steps.forEach((step) => {
        step.status = "completed";
      });
      break;
    case PostStatus.REJECTED:
      steps[0].status = "completed";
      const lastApproved = steps.findIndex((s) => s.status === "pending") - 1;
      if (lastApproved >= 0) {
        steps[lastApproved + 1].status = "rejected";
      } else {
        steps[1].status = "rejected";
      }
      break;
  }

  reviewers.forEach((reviewer) => {
    const stepIndex = steps.findIndex(
      (s) => s.reviewLevel === reviewer.reviewLevel,
    );
    if (stepIndex !== -1) {
      if (reviewer.status === ReviewerDecision.REJECTED) {
        steps[stepIndex].status = "rejected";
      }
    }
  });

  return steps;
}

function StepIcon({ status }: { status: WorkflowStep["status"] }) {
  switch (status) {
    case "completed":
      return (
        <div className="size-8 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="size-4 text-white" />
        </div>
      );
    case "current":
      return (
        <div className="size-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
          <CircleDot className="size-4 text-white" />
        </div>
      );
    case "rejected":
      return (
        <div className="size-8 rounded-full bg-destructive flex items-center justify-center">
          <X className="size-4 text-white" />
        </div>
      );
    default:
      return (
        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
          <Clock className="size-4 text-muted-foreground" />
        </div>
      );
  }
}

function ReviewerInfo({ reviewer }: { reviewer: PostReviewerView }) {
  const getDecisionBadge = () => {
    switch (reviewer.status) {
      case ReviewerDecision.APPROVED:
        return (
          <Badge variant="default" className="bg-green-500 text-xs">
            Đã duyệt
          </Badge>
        );
      case ReviewerDecision.REJECTED:
        return (
          <Badge variant="destructive" className="text-xs">
            Từ chối
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Chờ duyệt
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-6">
        <AvatarImage src={reviewer.avatarUrl} />
        <AvatarFallback className="text-xs">
          {reviewer.fullName?.slice(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm truncate max-w-[120px]">
        {reviewer.fullName}
      </span>
      {getDecisionBadge()}
    </div>
  );
}

interface WorkflowProgressProps {
  status: PostStatus;
  reviewers?: PostReviewerView[];
  className?: string;
  compact?: boolean;
}

function getLineStyles(
  currentStepStatus: WorkflowStep["status"],
  nextStepStatus: WorkflowStep["status"],
): { bgColor: string; animate: boolean } {
  if (currentStepStatus === "completed" && nextStepStatus === "completed") {
    return { bgColor: "bg-green-500", animate: false };
  }
  if (currentStepStatus === "completed" && nextStepStatus === "current") {
    return { bgColor: "bg-primary", animate: true };
  }
  if (currentStepStatus === "current") {
    return { bgColor: "bg-primary", animate: true };
  }
  if (currentStepStatus === "rejected") {
    return { bgColor: "bg-destructive", animate: false };
  }
  return { bgColor: "bg-muted", animate: false };
}

function ConnectorLine({
  currentStatus,
  nextStatus,
}: {
  currentStatus: WorkflowStep["status"];
  nextStatus: WorkflowStep["status"];
}) {
  const { bgColor, animate } = getLineStyles(currentStatus, nextStatus);

  return (
    <div className="flex-1 flex items-center mx-1">
      {animate ? (
        // Running dashed line animation for active step - thicker and primary colored
        <div className="relative w-full h-1.5 overflow-hidden rounded-full bg-primary/30">
          <div
            className="absolute inset-0 rounded-full animate-dash-flow"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 10px, transparent 10px, transparent 18px)",
              backgroundSize: "18px 100%",
            }}
          />
        </div>
      ) : (
        <div className={cn("h-1.5 w-full rounded-full", bgColor)} />
      )}
    </div>
  );
}

export function WorkflowProgress({
  status,
  reviewers = [],
  className,
  compact = false,
}: WorkflowProgressProps) {
  const steps = getWorkflowSteps(status, reviewers);

  if (compact) {
    const completedSteps = steps.filter((s) => s.status === "completed").length;
    const totalSteps = steps.length;
    const progress = (completedSteps / totalSteps) * 100;
    const currentStep =
      steps.find((s) => s.status === "current") ||
      steps.find((s) => s.status === "rejected");

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tiến trình</span>
          <span className="font-medium">
            {completedSteps}/{totalSteps}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              status === PostStatus.REJECTED ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        {currentStep && (
          <p className="text-xs text-muted-foreground">
            {currentStep.status === "rejected"
              ? "Bị từ chối tại: "
              : "Đang ở: "}
            <span className="font-medium">{currentStep.label}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Tiến trình phê duyệt</h3>
          <Badge
            variant={status === PostStatus.REJECTED ? "destructive" : "outline"}
          >
            {status === PostStatus.PUBLISHED
              ? "Hoàn thành"
              : status === PostStatus.REJECTED
                ? "Bị từ chối"
                : "Đang xử lý"}
          </Badge>
        </div>

        <div className="flex items-start">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start flex-1 last:flex-initial"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2">
                    <StepIcon status={step.status} />
                    <span
                      className={cn(
                        "text-xs text-center max-w-[70px] leading-tight",
                        step.status === "current" && "font-medium text-primary",
                        step.status === "completed" && "text-green-600",
                        step.status === "rejected" && "text-destructive",
                        step.status === "pending" && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </TooltipTrigger>
                {step.reviewers && step.reviewers.length > 0 && (
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Người đánh giá:</p>
                      {step.reviewers.map((reviewer) => (
                        <ReviewerInfo
                          key={reviewer.userId}
                          reviewer={reviewer}
                        />
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>

              {index < steps.length - 1 && (
                <div className="flex-1 pt-4 px-1">
                  <ConnectorLine
                    currentStatus={step.status}
                    nextStatus={steps[index + 1].status}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

interface WorkflowProgressVerticalProps {
  status: PostStatus;
  reviewers?: PostReviewerView[];
  className?: string;
}

export function WorkflowProgressVertical({
  status,
  reviewers = [],
  className,
}: WorkflowProgressVerticalProps) {
  const steps = getWorkflowSteps(status, reviewers);

  return (
    <div className={cn("space-y-1", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <StepIcon status={step.status} />
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 flex-1 min-h-[24px]",
                  step.status === "completed" ? "bg-green-500" : "bg-muted",
                )}
              />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p
              className={cn(
                "font-medium text-sm",
                step.status === "current" && "text-primary",
                step.status === "completed" && "text-green-600",
                step.status === "rejected" && "text-destructive",
                step.status === "pending" && "text-muted-foreground",
              )}
            >
              {step.label}
            </p>
            {step.reviewers && step.reviewers.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {step.reviewers.map((reviewer) => (
                  <ReviewerInfo key={reviewer.userId} reviewer={reviewer} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
