import '@Lib/css/globals.css';
import StyledComponentsRegistry from '@Lib/styled/registry';

export const metadata = {
  title: 'Eidyn',
  description: 'Analyze chess openings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}