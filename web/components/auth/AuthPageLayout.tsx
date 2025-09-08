interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** Layout for authentication pages (login and signup). */
export default function AuthPageLayout({
  title,
  subtitle,
  children,
}: AuthPageLayoutProps) {
  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-stone-600">{subtitle}</p>
        </div>
        <div className="mt-8 space-y-4">{children}</div>
      </div>
    </div>
  );
}
