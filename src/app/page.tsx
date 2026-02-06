import MainSidebar from '@/components/layout/MainSidebar';
import OrderCart from '@/components/pos/OrderCart';
import ProductGrid from '@/components/pos/ProductGrid';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { OrderProvider } from '@/contexts/OrderContext';

export default function Home() {
  return (
    <CategoryProvider>
      <OrderProvider>
        <main className="container-fluid vh-100 p-0">
          <div className="d-flex g-0">
            <div className="h-100">
              <MainSidebar />
            </div>

            <div
              className="h-100 flex-grow-1"
              style={{ maxWidth: 'calc(100% - var(--sidebar-width) - 548px)' }}
            >
              <ProductGrid />
            </div>

            <div
              className="h-100 border-start shadow-sm bg-white"
              style={{ width: '548px' }}
            >
              <OrderCart />
            </div>
          </div>
        </main>
      </OrderProvider>
    </CategoryProvider>
  );
}
