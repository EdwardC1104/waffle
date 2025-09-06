interface IconProps {
  size?: number;
  className?: string;
}

export const HeartIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M17.5 6.25C17.5 3.75 15.5 1.75 13 1.75C11.5 1.75 10.25 2.5 9.5 3.5C8.75 2.5 7.5 1.75 6 1.75C3.5 1.75 1.5 3.75 1.5 6.25C1.5 12.5 9.5 18.25 9.5 18.25S17.5 12.5 17.5 6.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReplyIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C8.5 17.5 7.1 17 6 16.1L2.5 17.5L3.9 14C3 12.9 2.5 11.5 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BookmarkIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M15 2.5H5C4.16667 2.5 3.5 3.16667 3.5 4V17.5L10 13.75L16.5 17.5V4C16.5 3.16667 15.8333 2.5 15 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M10 12.5V2.5M10 2.5L6.25 6.25M10 2.5L13.75 6.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 12.5V15C3.75 16.3807 4.86929 17.5 6.25 17.5H13.75C15.1307 17.5 16.25 16.3807 16.25 15V12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = ({ size = 17, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.5}
      d="m11.71 12.227 3.604 3.596M13.728 7.54A6.364 6.364 0 1 1 1 7.541a6.364 6.364 0 0 1 12.728 0Z"
    />
  </svg>
);

export const MoreIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <circle cx="10" cy="4" r="2" fill="currentColor" />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
    <circle cx="10" cy="16" r="2" fill="currentColor" />
  </svg>
);

export const EditIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const LogoutIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const CheckIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const ImageIcon = ({ size = 16, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const SavedPostsIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M15 2.5H5C4.16667 2.5 3.5 3.16667 3.5 4V17.5L10 13.75L16.5 17.5V4C16.5 3.16667 15.8333 2.5 15 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.5H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7.5 10H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PlusIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      stroke="currentColor"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

export const AlertTriangleIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);
