"use client";

import BackButton from "@/components/BackButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backButtonText?: string;
  backButtonUrl?: string;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backButtonText,
  backButtonUrl,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {backButtonText && backButtonUrl && (
        <BackButton
          text={backButtonText}
          goTo={backButtonUrl}
          className="mb-4"
        />
      )}
      <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
      {subtitle && <p className="text-zinc-600 mt-2">{subtitle}</p>}
    </div>
  );
}
