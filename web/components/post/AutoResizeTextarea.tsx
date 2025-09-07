import { useEffect, useRef } from "react";

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;
}

/** Auto-resizing textarea component. It grows in height as the user types. */
export default function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  style,
  rows = 1,
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (ref.current) {
      autoResize(ref.current);
    }
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        autoResize(ref.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border-none outline-none resize-none bg-transparent overflow-hidden ${className}`}
      style={style}
      rows={rows}
    />
  );
}
