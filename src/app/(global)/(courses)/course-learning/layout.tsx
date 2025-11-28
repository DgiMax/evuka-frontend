import MainNav from '@/components/layouts/MainNav';
import Footer from '@/components/layouts/Footer';

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <main className="flex-grow">
        {children} 
      </main>
    </div>
  );
}