'use client';

import { useOrderContext } from '@/contexts/OrderContext';
import { formatNumber } from '@/helpers/number';
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
import { Button, DatePicker, Flex, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

// Initial pending order tab
const PENDING_TAB = { id: 0, label: 'Đơn chờ', hasItems: false };
const defaultValue = dayjs();

export default function OrderCart() {
  const { orderItems, updateQty, removeItem } = useOrderContext();
  const [tabs, setTabs] = useState([PENDING_TAB]);
  const [activeTab, setActiveTab] = useState(0);
  const [orderCounter, setOrderCounter] = useState(1);
  const { itemRefs, scrollToView } = useScrollIntoView<
    HTMLButtonElement | HTMLAnchorElement
  >();

  const displayedTabs = useMemo(() => {
    return tabs.map((tab) => {
      if (tab.id === activeTab) {
        if (tab.hasItems && orderItems.length === 0) {
          return { ...tab, label: 'Đơn chờ', hasItems: false };
        }
        if (!tab.hasItems && orderItems.length > 0) {
          return { ...tab, label: `Đơn 1.${orderCounter}`, hasItems: true };
        }
      }
      return tab;
    });
  }, [tabs, activeTab, orderItems.length, orderCounter]);

  const currentDisplayedTab = displayedTabs.find((t) => t.id === activeTab);
  const currentTab = tabs.find((t) => t.id === activeTab);
  if (
    currentDisplayedTab &&
    currentTab &&
    currentDisplayedTab.hasItems !== currentTab.hasItems
  ) {
    queueMicrotask(() => {
      setTabs(displayedTabs);
    });
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
      { id: newId, label: 'Đơn chờ', hasItems: false },
    ]);
    setActiveTab(newId);
    setOrderCounter((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      {/* 1. Order Tabs */}
      <div className={`${styles.tabHeader} d-flex align-items-center`}>
        <div
          className={`d-flex align-items-center flex-grow-1 ${styles.tabList}`}
        >
          {displayedTabs.map((tab) => (
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
        <div className={`${styles.tabActions} d-flex align-items-center`}>
          <Space className="gap-2">
            <Button icon={<PlusCircleOutlined />} onClick={createNewOrder} />
            <Button icon={<CaretDownOutlined />} />
            <Button
              icon={<ClockCircleOutlined style={{ color: '#119C72' }} />}
            />
          </Space>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div
        className={`${styles.toolbar} d-flex align-items-center flex-wrap gap-1`}
      >
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

      {/* 3. Order List */}
      <div className={styles.orderList}>
        {orderItems.map((item) => (
          <OrderItem
            key={item.id}
            id={item.id}
            name={item.name}
            qty={item.qty}
            price={item.price}
            total={item.price * item.qty}
            onUpdateQty={updateQty}
            removeItem={removeItem}
          />
        ))}
      </div>

      {/* 4. Footer */}
      <div className={styles.footer}>
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
          <div>
            <Button
              className="d-flex align-items-center gap-1"
              style={{
                backgroundColor: '#2F99E7',
                color: '#fff',
                width: '165px',
              }}
            >
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
              className={styles.footerBtnPayment}
            >
              Báo bếp
            </Button>
            <Button
              shape="round"
              size="large"
              block
              className={styles.footerBtnPayment}
            >
              Kiểm món
            </Button>
          </Flex>
          <Button
            shape="round"
            size="large"
            block
            style={{ backgroundColor: '#119C72', color: '#CFFFF0' }}
          >
            <ShoppingCartOutlined /> Thanh toán (F4)
          </Button>
        </Flex>
      </div>
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
