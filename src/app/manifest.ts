import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Marine Analytica',
    short_name: 'Analytica',
    description: 'Autonomous Marine Ecology & Supply Chain Intelligence',
    start_url: '/',
    display: 'standalone',
    background_color: '#050B14',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
