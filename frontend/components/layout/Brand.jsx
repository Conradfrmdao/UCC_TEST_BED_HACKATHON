import Link from 'next/link';

export default function Brand({ subtitle = 'Child online safety', className = '' }) {
  return <Link href="/" className={`wordmark ${className}`} aria-label="Chinga home">
    <strong>chinga<span aria-hidden="true">.</span></strong>
    <small>{subtitle}</small>
  </Link>;
}
