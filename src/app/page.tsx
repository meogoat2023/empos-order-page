import MainSidebar from '@/components/layout/MainSidebar';
import OrderCart from '@/components/pos/OrderCart';
import ProductGrid from '@/components/pos/ProductGrid';

export default function Home() {
  return (
    <main className="w-full h-screen p-0 overflow-hidden">
      <div className="h-[64px]"></div>
      <div className="flex gap-0">
        <div className="h-screen">
          <MainSidebar />
        </div>

        <div className="flex-1 min-w-0 h-screen grow relative">
          <ProductGrid />
        </div>

        <div className="w-[548px] max-[1440px]:w-[480px] max-[1280px]:w-[420px] xl:w-[506px] h-screen border-l shadow-sm bg-white">
          <OrderCart />
        </div>
      </div>
    </main>
  );
}
