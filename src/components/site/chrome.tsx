import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Menu, Phone, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster } from "sonner";
import { nav, policies, recipes, site } from "@/data/content";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { btnBark, btnPrimary, fieldClass } from "@/lib/ui";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    useCart.getState().setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
      >
        Bỏ qua điều hướng
      </a>
      <SiteHeader />
      <div id="noi-dung">{children}</div>
      <SiteFooter />
      <ShopBanner />
      <ContactFloat />
      <SearchDialog />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-paper)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-line)",
          },
        }}
      />
    </>
  );
}

function ShopBanner() {
  const [open, setOpen] = useState(true);
  const spots = [
    { href: "https://s.shopee.vn/3VlyIlkNrM", label: "Mua hàng tại đây", top: "55%", height: "9%" },
    { href: "https://vt.tiktok.com/ZS9PY2Vne7Nm4-SJToN/", label: "Đặt mua ngay", top: "64.5%", height: "9%" },
    { href: "https://www.facebook.com/profile.php?id=61594977697670", label: "Liên hệ tư vấn", top: "76%", height: "12%" },
  ];

  return (
    <div className="fixed top-1/2 right-0 z-40 -translate-y-1/2">
      <div
        className={cn(
          "flex items-center transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-2.75rem)]",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Ẩn bảng mua hàng" : "Mở bảng mua hàng"}
          className="mr-1 grid size-11 shrink-0 place-items-center rounded-full bg-soil text-paper shadow-md"
        >
          {open ? <ChevronRight className="size-5" aria-hidden="true" /> : <ChevronLeft className="size-5" aria-hidden="true" />}
        </button>
        <div className="relative mr-2 aspect-[360/500] w-[min(68vw,230px,calc(62vh*0.72))] overflow-hidden rounded-2xl border border-[#c4a56a]/50 shadow-xl">
          <img src="/media/bang-mua-hang.png" alt="Sâm dây Ngọc Linh — mua hàng" className="absolute inset-0 h-full w-full object-fill" />
          {spots.map((spot) => (
            <a
              key={spot.label}
              href={spot.href}
              target="_blank"
              rel="noreferrer"
              aria-label={spot.label}
              style={{ top: spot.top, height: spot.height }}
              className="absolute right-[8%] left-[8%] z-10 rounded-full transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactFloat() {
  return (
    <div className="fixed right-3 bottom-4 z-50 flex flex-col gap-2">
      <a
        href="tel:+84972717779"
        aria-label="Gọi 0972 717 779"
        className="lift grid size-12 place-items-center rounded-full bg-[#22c55e] text-white shadow-lg"
      >
        <Phone className="size-5" aria-hidden="true" />
      </a>
      <a
        href="https://zalo.me/0972717779"
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn Zalo 0972 717 779"
        className="lift grid size-12 place-items-center rounded-full bg-[#0068ff] text-[11px] font-bold text-white shadow-lg"
      >
        Zalo
      </a>
    </div>
  );
}

function Logo({ onDark = true }: { onDark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={site.logo}
        alt=""
        className={cn(
          "h-12 w-auto object-contain",
          onDark && "drop-shadow-[0_0_12px_rgba(232,210,150,0.35)]",
        )}
      />
      <span className={cn("font-display text-xl leading-none", onDark ? "text-[#f6ecd4]" : "text-bark")}>
        {site.name}
      </span>
    </Link>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const setSearchOpen = useCart((state) => state.setSearchOpen);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#3a2a22] bg-[#1c140f]/95 text-[#f6ecd4] shadow-[0_8px_24px_rgba(28,20,15,0.18)] backdrop-blur",
        scrolled && "bg-[#1c140f]",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center gap-3 px-5 md:px-8">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-[#f6ecd4] md:hidden"
          aria-label="Mở menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Chính">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className:
                  "rounded-full bg-[#c4a56a]/20 px-3 py-2 text-sm font-semibold text-[#f0d48a] transition",
              }}
              inactiveProps={{
                className:
                  "rounded-full px-3 py-2 text-sm text-[#e7d7bc] transition hover:bg-white/10 hover:text-white",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-[#f0d48a] transition hover:bg-white/10"
            aria-label="Tìm công thức"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" />
          </button>
        </div>
      </div>

      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-soil/40" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-cream p-5">
            <div className="flex items-center justify-between">
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <Logo onDark={false} />
              <Dialog.Close className="grid size-11 place-items-center" aria-label="Đóng menu">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <nav className="mt-6 flex flex-col" aria-label="Di động">
              {nav.map((item) => (
                <Link key={item.to} to={item.to} className="border-b border-line py-3 text-lg text-bark">
                  {item.label}
                </Link>
              ))}
            </nav>
            <a href={site.phoneHref} className={cn(btnPrimary, "mt-6")}>
              <Phone className="size-4" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}

function SearchDialog() {
  const open = useCart((state) => state.searchOpen);
  const setSearchOpen = useCart((state) => state.setSearchOpen);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const q = query.trim().toLowerCase();
  const recipeHits = useMemo(
    () =>
      q
        ? recipes.filter((item) => `${item.title} ${item.excerpt}`.toLowerCase().includes(q)).slice(0, 8)
        : recipes.slice(0, 5),
    [q],
  );

  return (
    <Dialog.Root open={open} onOpenChange={setSearchOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-soil/40" />
        <Dialog.Content className="fixed top-20 right-4 left-4 z-50 mx-auto max-w-xl rounded-card border border-line bg-paper p-4 shadow-lg">
          <Dialog.Title className="sr-only">Tìm kiếm</Dialog.Title>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm món thực dưỡng"
            className={fieldClass}
            aria-label="Từ khoá"
          />
          <div className="mt-4 max-h-[60vh] space-y-1 overflow-auto">
            {recipeHits.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="block w-full rounded-2xl px-2 py-2 text-left text-sm text-bark hover:bg-sage"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                  void navigate({ to: "/cong-thuc/$slug", params: { slug: item.slug } });
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SiteFooter() {
  const [policy, setPolicy] = useState<(typeof policies)[number] | null>(null);
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!email.includes("@") || phone.length < 8) {
      setError("Cần email hợp lệ và số điện thoại.");
      setSent("");
      return;
    }
    setError("");
    const subject = encodeURIComponent("Liên hệ từ website Sâm Việt Nam");
    const body = encodeURIComponent(`Email: ${email}\nSố điện thoại: ${phone}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent("Đã mở thư soạn sẵn. Bấm gửi trong email để bên mình nhận được số của bạn.");
  }

  return (
    <footer className="mt-16 bg-soil text-paper">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-14 md:grid-cols-2 md:px-8">
        <div>
          <img src={site.logo} alt="" className="h-16 w-auto object-contain" />
          <p className="mt-3 font-display text-2xl">{site.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-sand">{site.tagline}</p>
          <form className="mt-6 grid gap-3" onSubmit={submit}>
            <label className="text-sm text-sand">
              Email
              <input name="email" type="email" autoComplete="email" className={cn(fieldClass, "mt-1")} />
            </label>
            <label className="text-sm text-sand">
              Số điện thoại
              <input name="phone" inputMode="tel" autoComplete="tel" className={cn(fieldClass, "mt-1")} />
            </label>
            {error ? <p className="text-sm text-[#f0d48a]">{error}</p> : null}
            {sent ? <p className="text-sm text-paper">{sent}</p> : null}
            <button type="submit" className={cn(btnBark, "w-fit")}>
              Gửi liên hệ
            </button>
          </form>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sage">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-sand">
            <li>{site.address}</li>
            <li>
              <a href={site.phoneHref} className="text-paper">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.website} className="text-paper">
                vuasamvietnam.com
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-paper">
                Email: {site.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="grid size-11 place-items-center rounded-full border border-[#c4a56a]/50 text-[#f0d48a] transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Mail className="size-5" aria-hidden="true" />
            </a>
            <a
              href={site.facebook}
              aria-label="Facebook"
              className="grid size-11 place-items-center rounded-full border border-[#c4a56a]/50 text-[#f0d48a] transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <FacebookMark />
            </a>
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            {policies.map((item) => (
              <button
                key={item.id}
                type="button"
                className="text-sm text-sand underline-offset-2 hover:underline"
                onClick={() => setPolicy(item)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-card border border-[#c4a56a]/40 bg-[#2a1e16] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#f0d48a]">Chứng nhận OCOP</p>
            <p className="mt-2 text-sm leading-relaxed text-sand">
              Sản phẩm đi theo quy trình kiểm nghiệm và chuẩn OCOP do chương trình mỗi xã một sản phẩm công nhận. Vùng
              trồng dưới tán rừng già, trên 1.800 m tại Kon Tum. Mỗi lô được kiểm tra trước khi đóng gói.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-bark px-5 py-4 text-center text-xs text-sand">
        © 2026 {site.name}. Thực dưỡng tham khảo, không thay thế tư vấn y khoa.
      </div>

      <Dialog.Root open={policy !== null} onOpenChange={(next) => !next && setPolicy(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-soil/50" />
          <Dialog.Content className="fixed top-1/2 right-4 left-4 z-50 mx-auto max-w-lg -translate-y-1/2 rounded-card bg-paper p-6 text-ink">
            <Dialog.Title className="font-display text-2xl text-bark">{policy?.title}</Dialog.Title>
            <p className="mt-3 text-sm leading-relaxed text-mist">{policy?.body}</p>
            <Dialog.Close className="mt-6 inline-flex h-11 items-center rounded-full bg-bark px-5 text-sm font-semibold text-paper">
              Đóng
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </footer>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.3-2.7h-2.6z" />
    </svg>
  );
}
