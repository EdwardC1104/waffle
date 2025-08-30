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
    viewBox="0 0 20 20"
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
