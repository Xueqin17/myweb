import ThemeWrapper from '@/app/Components/ThemeWrapper/ThemeWrapper';
import ThemeToggle  from '@/app/Components/ThemeToggle/ThemeToggle';
// import type { Metadata } from 'next';
import StudentBar from '@/app/Components/StudentBar/StudentBar';
import HeaderNav from '@/app/Components/HeaderNav';
import FooterCopyright from '@/app/Components/FooterCopyright/FooterCopyright';

export default function AssignmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeWrapper>
      <StudentBar />

      <header>
        <HeaderNav />
      </header>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '10px 20px'
      }}>
        <ThemeToggle />
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px 24px' }}>
        {children}
      </main>

      <FooterCopyright />
    </ThemeWrapper>
  );
}