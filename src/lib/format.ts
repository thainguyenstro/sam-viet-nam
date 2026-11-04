/** Giá hiển thị kiểu Việt Nam: 149.000₫ — dùng mọi nơi, đừng format tay. */
export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}₫`;
}

export function scaleAmount(amount: number, factor: number) {
  const value = amount * factor;
  if (value >= 10) return String(Math.round(value));
  const rounded = Math.round(value * 10) / 10;
  return String(rounded);
}
