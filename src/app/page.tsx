import MainSidebar from '@/components/layout/MainSidebar';
import OrderCart from '@/components/pos/OrderCart';
import ProductGrid from '@/components/pos/ProductGrid';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { OrderProvider } from '@/contexts/OrderContext';
import styles from '@/styles/page.module.css';

export default function Home() {
  return (
    <CategoryProvider>
      <OrderProvider>
        <main className="container-fluid vh-100 p-0 overflow-hidden">
          <div className="d-flex g-0">
            <div className="vh-100">
              <MainSidebar />
            </div>

            <div
              className={`${styles.productArea} vh-100 flex-grow-1 position-relative`}
            >
              <ProductGrid />
            </div>

            <div
              className={`${styles.cartArea} vh-100 border-start shadow-sm bg-white`}
            >
              <OrderCart />
            </div>
          </div>
        </main>
      </OrderProvider>
    </CategoryProvider>
  );
}
