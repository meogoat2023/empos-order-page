'use client';

import { useOrderContext } from '@/contexts/OrderContext';
import { formatNumber } from '@/helpers/number';
import { useDragScroll } from '@/hooks/useDragScroll';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import styles from '@/styles/pos/OrderCart.module.css';
import {
  CalendarOutlined,
  CaretDownOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  GiftOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Flex, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const PENDING_TAB = { id: 0, label: 'Đơn chờ', hasItems: false };
const defaultValue = dayjs();

interface TabInfo {
  id: number;
  label: string;
  hasItems: boolean;
  subBillNumber: number;
}

export default function OrderCart() {
  const { orderItems, updateQty, removeItem, setActiveTabId, activeTabId } =
    useOrderContext();

  const [tabs, setTabs] = useState<TabInfo[]>([
    { ...PENDING_TAB, subBillNumber: 0 },
  ]);
  const [activeTab, setActiveTab] = useState(0);

  const { itemRefs, scrollToView } = useScrollIntoView<
    HTMLButtonElement | HTMLAnchorElement
  >();
  const scrollRef = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    setActiveTabId(activeTab);
  }, [activeTab, setActiveTabId]);

  const currentTab = tabs.find((t) => t.id === activeTab);

  if (activeTab === activeTabId && currentTab) {
    if (!currentTab.hasItems && orderItems.length > 0) {
      const maxSubBill = Math.max(...tabs.map((t) => t.subBillNumber), 0);
      const nextSubBillNumber = maxSubBill > 0 ? maxSubBill + 1 : 1;

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab
            ? {
                ...tab,
                label: `Đơn 1.${nextSubBillNumber}`,
                hasItems: true,
                subBillNumber: nextSubBillNumber,
              }
            : tab,
        ),
      );
    }

    if (currentTab.hasItems && orderItems.length === 0) {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab
            ? {
                ...tab,
                label: 'Đơn chờ',
                hasItems: false,
                subBillNumber: 0,
              }
            : tab,
        ),
      );
    }
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const discount = subtotal * 0.1;
  const vat = (subtotal - discount) * 0.08;
  const totalPayment = subtotal - discount + vat;

  const createNewOrder = () => {
    const existingPending = tabs.find((t) => !t.hasItems);
    if (existingPending) {
      setActiveTab(existingPending.id);
      scrollToView(existingPending.id);
      return;
    }
    const newId = tabs.length;
    setTabs((prev) => [
      ...prev,
      { id: newId, label: 'Đơn chờ', hasItems: false, subBillNumber: 0 },
    ]);
    setActiveTab(newId);
  };

  return (
    <div className={styles.container}>
      <Flex vertical gap={8}>
        {/* 1. Order Tabs */}
        <div className={`${styles.tabHeader} d-flex align-items-center`}>
          <div
            ref={scrollRef}
            className={`d-flex align-items-center flex-grow-1 ${styles.tabList}`}
          >
            {tabs.map((tab) => (
              <Button
                ref={(el) => {
                  itemRefs.current[tab.id] = el;
                }}
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''} py-1`}
                iconPlacement="end"
                {...(activeTab === tab.id && {
                  icon: <CloseOutlined style={{ fontSize: 14 }} />,
                })}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToView(tab.id);
                }}
              >
                <span className="text-md-semibold">{tab.label}</span>
              </Button>
            ))}
          </div>
          <div className={`${styles.tabActions}`}>
            <Button icon={<PlusCircleOutlined />} onClick={createNewOrder} />
            <Button icon={<CaretDownOutlined />} />
            <Button
              icon={<ClockCircleOutlined style={{ color: '#119C72' }} />}
            />
          </div>
        </div>

        {/* 2. Toolbar */}
        <div className={`${styles.toolbar} gap-1`}>
          <span className={`${styles.toolbarTableName} text-md-semibold`}>
            Bàn 1
          </span>
          <div className="d-flex align-items-center justify-content-end gap-2 flex-grow-1 h-100">
            <Button
              icon={<UsergroupAddOutlined />}
              className="text-md-regular px-2"
            >
              99
            </Button>
            <DatePicker
              defaultValue={defaultValue}
              showTime
              className={styles.toolbarTableDatepicker}
              format="DD/MM/YYYY HH:mm"
              suffixIcon={<CalendarOutlined />}
              allowClear={false}
              // variant="borderless"
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm khách hàng"
              suffix={<PlusOutlined />}
              style={{ flex: 1, borderRadius: '8px' }}
              className={styles.toolbarTableInput}
            />
          </div>
        </div>
      </Flex>

      {/* 3. Order List */}
      <div
        className={`${styles.orderList} ${!orderItems?.length ? 'justify-content-center align-items-center ' : ''}`}
      >
        {!orderItems?.length ? (
          <span>Xin vui lòng chọn món</span>
        ) : (
          orderItems.map((item) => (
            <OrderItem
              key={item.id}
              id={item.id}
              name={item.name}
              qty={item.qty}
              price={item.price}
              total={item.price * item.qty}
              note={item.note}
              onUpdateQty={updateQty}
              removeItem={removeItem}
            />
          ))
        )}
      </div>

      {/* 4. Footer */}
      <Flex vertical gap={8}>
        <div className={styles.footerText}>
          <div className={styles.icon}>
            <EditOutlined style={{ fontSize: 16 }} />
          </div>
          <span>Nhóm 12 người có chị áo xanh hay order</span>
        </div>

        <div className={`${styles.footerBtnGroup}`}>
          <div className="d-flex gap-2">
            <Button
              shape="circle"
              icon={<ReadOutlined />}
              className={styles.footerBtn}
            />
            <Button
              shape="circle"
              icon={<GiftOutlined />}
              className={styles.footerBtn}
            />
          </div>
          <div className={styles.footerRegularPrice}>
            <Button>
              Bảng giá thường <CaretDownOutlined />
            </Button>
          </div>
        </div>

        <div className={styles.footerPromotion}>
          <span>Khuyến mãi/ Chiết khấu</span>
          <span>{formatNumber(discount)}</span>
        </div>

        <div className={styles.footerVat}>
          <span>VAT</span>
          <span>{formatNumber(vat)}</span>
        </div>

        <div className={styles.footerTotal}>
          <span>Phải thanh toán</span>
          <span>
            {formatNumber(totalPayment)}{' '}
            <CaretDownOutlined style={{ fontSize: 16, color: '#5F5A6A' }} />
          </span>
        </div>

        <Flex gap={8}>
          <Flex gap={8}>
            <Button
              shape="round"
              size="large"
              block
              className={styles.footerBtnAction}
            >
              Báo bếp
            </Button>
            <Button
              shape="round"
              size="large"
              block
              className={styles.footerBtnAction}
            >
              Kiểm món
            </Button>
          </Flex>
          <Button
            shape="round"
            size="large"
            block
            className={styles.footerBtnPayment}
          >
            <ShoppingCartOutlined /> Thanh toán (F4)
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}

function OrderItem({
  id,
  name,
  qty,
  price,
  total,
  toppings,
  note,
  onUpdateQty,
  removeItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <div className={styles.orderItem}>
      <div className={styles.itemMainRow}>
        <div className={`${styles.itemName} line-clamp text-sm-semibold`}>
          {name}
        </div>
        <div className={`${styles.itemActions}`}>
          <Select
            defaultValue="suat"
            variant="borderless"
            suffixIcon={<CaretDownOutlined />}
            className={`${styles.unitSelect} text-md-caption`}
            options={[{ value: 'suat', label: 'Suất' }]}
          />

          <div className={styles.quantityGroup}>
            <Button
              shape="circle"
              size="small"
              icon={
                <MinusOutlined
                  style={{ fontSize: 10, display: 'flex', height: 'auto' }}
                />
              }
              className={`${styles.qtyBtn}`}
              onClick={() => onUpdateQty(id, qty - 1)}
            />
            <span className={styles.qtyValue}>{qty}</span>
            <Button
              shape="circle"
              size="small"
              icon={
                <PlusOutlined
                  style={{ fontSize: 10, display: 'flex', height: 'auto' }}
                />
              }
              className={`${styles.qtyBtnPlus}`}
              onClick={() => onUpdateQty(id, qty + 1)}
            />
          </div>

          <div className={styles.priceGroup}>
            <div className={styles.itemPrice}>{formatNumber(price)}</div>
            <div className={styles.itemTotal}>{formatNumber(total)}</div>
          </div>
          <div className={styles.closeBtn} onClick={() => removeItem(id)}>
            <CloseOutlined style={{ fontSize: 12, color: '#35313c' }} />
          </div>
        </div>
      </div>

      <div className={styles.toppingsNote}>
        {toppings && (
          <div className={styles.subInfo}>
            {toppings.map((item: Record<string, string>) => {
              return (
                <span key={item.name} className={styles.toppingsName}>
                  {item.name}
                </span>
              );
            })}
          </div>
        )}
        {note && (
          <div className={`${styles.subInfo} ${styles.note} line-clamp`}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
