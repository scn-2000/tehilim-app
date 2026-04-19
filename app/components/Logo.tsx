export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="104" height="104" rx="16" fill="#5c3d1e"/>
      <text
        x="52"
        y="76"
        textAnchor="middle"
        fontFamily="'Frank Ruhl Libre', 'Times New Roman', serif"
        fontSize="72"
        fontWeight="400"
        fill="#c9a96e"
      >ת</text>
    </svg>
  );
}