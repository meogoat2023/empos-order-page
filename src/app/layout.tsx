import StyledComponentsRegistry from '@/lib/AntdRegistry';
import '@/styles/variables.css';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import type { Metadata } from 'next';
import { sfPro } from '@/app/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Phần mềm quản lý bán hàng',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={sfPro.variable}>
        <StyledComponentsRegistry>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                fontFamily: 'var(--font-sf), sans-serif',
              },
            }}
          >
            {children}
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
