'use client';

import { formatNumber } from '@/helpers/number';
import { useDragScroll } from '@/hooks/useDragScroll';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import { useOrderStore } from '@/stores/useOrderStore';
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
import { useShallow } from 'zustand/react/shallow';

const PENDING_TAB = { id: 0, label: 'Đơn chờ', hasItems: false };
const defaultValue = dayjs();

interface TabInfo {
  id: number;
  label: string;
  hasItems: boolean;
  subBillNumber: number;
}

export default function OrderCart() {
  const { updateQty, removeItem, setActiveTabId, activeTabId } = useOrderStore(
    useShallow((state) => ({
      updateQty: state.updateQty,
      removeItem: state.removeItem,
      setActiveTabId: state.setActiveTabId,
      activeTabId: state.activeTabId,
    })),
  );

  const orderItems = useOrderStore(
    (state) => state.allOrdersMap.get(state.activeTabId) || [],
  );

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
      const existingPending = tabs.find(
        (t) => !t.hasItems && t.id !== activeTab,
      );

      if (existingPending) {
        setTabs((prev) => prev.filter((t) => t.id !== activeTab));
        setActiveTab(existingPending.id);
      } else {
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
    const newId = tabs.length > 0 ? Math.max(...tabs.map((t) => t.id)) + 1 : 0;
    setTabs((prev) => [
      ...prev,
      { id: newId, label: 'Đơn chờ', hasItems: false, subBillNumber: 0 },
    ]);
    setActiveTab(newId);
  };

  return (
    <div className="flex flex-col gap-1 h-full pt-2.5 px-4 pb-4 max-h-dvh overflow-hidden relative xl:p-[6px_8px]">
      <Flex vertical gap={8}>
        {/* 1. Order Tabs */}
        <div className="border-(--color-secondary) gap-4 justify-between flex items-center">
          <div
            ref={scrollRef}
            className="gap-2 overflow-x-auto scrollbar-width-none touch-pan-x cursor-grab flex items-center grow"
          >
            {tabs.map((tab) => (
              <Button
                ref={(el) => {
                  itemRefs.current[tab.id] = el;
                }}
                key={tab.id}
                className={`
                  min-h-[36px] max-h-[36px] border-(--neutral-inverse-tertiary) rounded-[8px] cursor-pointer pointer-events-auto w-[110px] py-1
                  ${activeTab === tab.id ? 'bg-(--color-primary)! text-(--text-brand-inverse)! border-none!' : ''}
                `}
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
          <div className="flex items-center self-stretch gap-2 max-w-[124px]">
            <Button icon={<PlusCircleOutlined />} onClick={createNewOrder} />
            <Button icon={<CaretDownOutlined />} />
            <Button icon={<ClockCircleOutlined />} />
          </div>
        </div>

        {/* 2. Toolbar */}
        <div className="flex items-center flex-wrap h-[32px] gap-1">
          <span className="text-(--text-brand-primary) text-md-semibold">
            Bàn 1
          </span>
          <div className="flex items-center justify-end gap-2 grow h-full">
            <div className="flex items-center gap-1 h-full px-1 rounded-lg border">
              <UsergroupAddOutlined />
              99
            </div>
            <DatePicker
              defaultValue={defaultValue}
              showTime
              className="max-w-[155px]"
              format="DD/MM/YYYY HH:mm"
              suffixIcon={<CalendarOutlined />}
              allowClear={false}
            />
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm khách hàng"
              suffix={<PlusOutlined />}
              style={{ flex: 1, borderRadius: '8px' }}
              className="max-w-[203px] [&>.ant-input-suffix]:ml-0!"
            />
          </div>
        </div>
      </Flex>

      {/* 3. Order List */}
      <div
        className={`flex flex-col overflow-y-auto scrollbar-width-none border-b border-[#d2cddb80] px-[8px] mx-[-8px] flex-1 ${!orderItems?.length ? 'justify-center items-center ' : ''}`}
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
        <div className="flex items-center gap-2 text-[13px] leading-[18px]">
          <div className="flex items-center justify-center w-[20px] h-[20px] text-[#5f5a6a]">
            <EditOutlined style={{ fontSize: 16 }} />
          </div>
          <span>Nhóm 12 người có chị áo xanh hay order</span>
        </div>

        <div className="flex justify-between items-center h-[52px] xl:h-[40px]">
          <div className="flex gap-2">
            <Button
              shape="circle"
              icon={<ReadOutlined />}
              className="border-0! bg-[#cdeaff]! text-[#005695]!"
            />
            <Button
              shape="circle"
              icon={<GiftOutlined />}
              className="border-0! bg-[#cdeaff]! text-[#005695]!"
            />
          </div>
          <div className="[&>button]:bg-[#2f99e7]! [&>button]:w-[165px] [&>button]:text-white! [&>button]:text-[15px] [&>button]:leading-[20px] [&>button]:font-semibold">
            <Button className="flex items-center justify-between">
              Bảng giá thường <CaretDownOutlined />
            </Button>
          </div>
        </div>

        <div className="flex justify-between font-medium text-[#8c8697]">
          <span>Khuyến mãi/ Chiết khấu</span>
          <span className="text-[13px] leading-[18px] font-medium text-[#5f5a6a]">
            {formatNumber(discount)}
          </span>
        </div>

        <div className="flex justify-between font-medium text-[#8c8697]">
          <span>VAT</span>
          <span className="text-[13px] leading-[18px] font-medium text-[#5f5a6a]">
            {formatNumber(vat)}
          </span>
        </div>

        <div className="flex justify-between text-[15px] leading-[20px] font-semibold">
          <span className="text-[#5f5a6a]">Phải thanh toán</span>
          <span className="text-[#dd980a] cursor-pointer">
            {formatNumber(totalPayment)}{' '}
            <CaretDownOutlined style={{ fontSize: 16, color: '#5F5A6A' }} />
          </span>
        </div>

        <Flex gap={8} className="h-[52px] xl:h-[40px]">
          <Flex
            gap={8}
            className="[&>button]:bg-[#1376be]! [&>button]:text-[#f3f3f4]! [&>button]:text-[15px]! [&>button]:font-semibold! [&>button]:leading-[24px]! [&>button]:h-full h-full"
          >
            <Button shape="round" size="large" block>
              Báo bếp
            </Button>
            <Button shape="round" size="large" block>
              Kiểm món
            </Button>
          </Flex>
          <Button
            shape="round"
            size="large"
            block
            className="bg-[#119c72]! text-[#cffff0]! text-[15px]! font-semibold! leading-[24px]! h-full"
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
    <div className="flex flex-col gap-1 border-b border-(--color-border) py-2 last:border-b-0 last:mb-0">
      <div className="flex items-start gap-2">
        <div className="line-clamp text-sm-semibold min-w-[176px] max-w-[176px] xl:min-w-[150px] xl:max-w-[150px]">
          {name}
        </div>
        <div className="flex items-center justify-end flex-1 gap-2 h-[24px]">
          <Select
            defaultValue="suat"
            variant="borderless"
            suffixIcon={<CaretDownOutlined />}
            className="max-w-[46px] p-0! text-(--neutral-secondary)! text-md-caption"
            options={[{ value: 'suat', label: 'Suất' }]}
          />

          <div className="flex items-center">
            <Button
              shape="circle"
              size="small"
              icon={
                <MinusOutlined
                  style={{ fontSize: 10, display: 'flex', height: 'auto' }}
                />
              }
              className="bg-white border border-[#2f99e7]! text-[#35313c]"
              onClick={() => onUpdateQty(id, qty - 1)}
            />
            <span className="flex items-center justify-center text-[15px] leading-[20px] text-[#35313c] w-[28px] px-[2px]">
              {qty}
            </span>
            <Button
              shape="circle"
              size="small"
              icon={
                <PlusOutlined
                  style={{ fontSize: 10, display: 'flex', height: 'auto' }}
                />
              }
              className="border-none! bg-[#2f99e7]! text-white!"
              onClick={() => onUpdateQty(id, qty + 1)}
            />
          </div>

          <div className="flex items-center gap-1">
            <div className="w-[70px] text-[12px] leading-[16px] font-medium text-[#5f5a6a] text-center">
              {formatNumber(price)}
            </div>
            <div className="w-[70px] text-[12px] leading-[18px] font-medium text-[#119c72] text-center">
              {formatNumber(total)}
            </div>
          </div>
          <div
            className="flex items-center justify-center w-[20px] cursor-pointer"
            onClick={() => removeItem(id)}
          >
            <CloseOutlined style={{ fontSize: 12, color: '#35313c' }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {toppings && (
          <div className="flex items-center gap-4 text-[12px] leading-[16px] text-[#35313c]">
            {toppings.map((item: Record<string, string>) => {
              return (
                <span
                  key={item.name}
                  className="text-[12px] leading-[16px] text-[#35313c]"
                >
                  {item.name}
                </span>
              );
            })}
          </div>
        )}
        {note && (
          <div className="flex items-center gap-4 text-[12px] leading-[16px] text-[#35313c] line-clamp">
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
