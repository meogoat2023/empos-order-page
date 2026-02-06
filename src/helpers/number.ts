export const formatNumber = (num: number | string) => {
  return new Intl.NumberFormat('vi-VN').format(Number(num));
};
