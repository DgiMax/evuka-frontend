import MainNav from '@/components/layouts/MainNav';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      <main className="flex-grow">
        {children} 
      </main>

    </div>
  );
}