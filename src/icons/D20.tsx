export default function D20({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'h-6 w-6'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2 3 7v10l9 5 9-5V7z" />
      <path d="M3 7l9 5 9-5" />
      <path d="M12 12v10" />
      <path d="M12 2 7 12l5 10 5-10z" />
      <path d="M7 12h10" />
    </svg>
  )
}
