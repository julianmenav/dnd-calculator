export default function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'h-3 w-3'}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.5 5.5 7 9l3.5-3.5" />
    </svg>
  )
}
