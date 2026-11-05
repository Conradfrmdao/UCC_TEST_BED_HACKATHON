import './globals.css';
import ServiceWorker from '../components/ServiceWorker';

export const metadata = {
  title: { default: 'Chinga Safety', template: '%s | Chinga Safety' },
  description: 'A synthetic demonstration of child-focused scam prevention and safety intelligence.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' }
};
export const viewport = { themeColor: '#071f3a', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }) { return <html lang="en"><body>{children}<ServiceWorker/></body></html>; }
