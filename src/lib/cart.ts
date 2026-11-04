import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Line = { slug: string; qty: number };

type CartStore = {
  lines: Line[];
  open: boolean;
  searchOpen: boolean;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

/**
 * Giỏ hàng lưu trên máy khách (localStorage, khoá "sam-vn-gio").
 * Không có tài khoản đăng nhập. Sửa tên khoá nếu muốn giỏ cũ bị bỏ.
 */
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      searchOpen: false,
      add: (slug) => {
        const lines = get().lines;
        const found = lines.find((line) => line.slug === slug);
        set({
          lines: found
            ? lines.map((line) =>
                line.slug === slug ? { ...line, qty: line.qty + 1 } : line,
              )
            : [...lines, { slug, qty: 1 }],
        });
      },
      setQty: (slug, qty) => {
        const lines = get().lines;
        set({
          lines:
            qty <= 0
              ? lines.filter((line) => line.slug !== slug)
              : lines.map((line) => (line.slug === slug ? { ...line, qty } : line)),
        });
      },
      remove: (slug) => set({ lines: get().lines.filter((line) => line.slug !== slug) }),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    {
      name: "sam-vn-gio",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined,
            }
          : localStorage,
      ),
      partialize: (state) => ({ lines: state.lines }),
      skipHydration: true,
    },
  ),
);

export function useCartCount() {
  return useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
}
