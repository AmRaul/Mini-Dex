import './globals.css'
import Header from '@/components/Header'  // '@/components' = 'src/components'

export const metadata = {
  title: 'Mini DEX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}