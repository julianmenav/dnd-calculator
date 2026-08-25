export default function Baseline({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'h-4 w-4'}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 1.5v6M4 4.5l3-3 3 3M2 10h10M2 12.5h10" />
    </svg>
  )
}
