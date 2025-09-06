import ErrorMessage from "@/components/general/ErrorMessage";

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  errorTitle: string;
  children: React.ReactNode;
}

/** Wraps the login and signup forms. */
export default function AuthForm({
  onSubmit,
  error,
  errorTitle,
  children,
}: AuthFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error && (
        <ErrorMessage
          title={errorTitle}
          message={error}
          showRetryButton={false}
          className="mb-4"
        />
      )}
      {children}
    </form>
  );
}
