import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ChevronLeft,
  ChevronRight,
  Flame,
  HeartPulse,
  LayoutGrid,
  Leaf,
  Mountain,
  ShieldCheck,
  Soup,
  Sparkles,
  Table2,
} from "lucide-react";
import { RecipeCard, SectionTitle } from "@/components/site/blocks";
import { groups, nutrients, pillars, recipes, site, tagLabels, type GroupId } from "@/data/content";
import { cn } from "@/lib/cn";
import { btnPrimary, fieldClass } from "@/lib/ui";

const pillarIcons = [Leaf, Mountain, ShieldCheck];
const groupIcons = [Flame, Brain, HeartPulse, Sparkles, Soup];

const needFilters: { id: "all" | GroupId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "Tất cả", icon: LayoutGrid },
  { id: "nang-luong", label: "Năng lượng", icon: Flame },
  { id: "nao-bo", label: "Tập trung", icon: Brain },
  { id: "tim-mach", label: "Tim mạch", icon: HeartPulse },
  { id: "phuc-hoi", label: "Phục hồi", icon: Sparkles },
  { id: "tieu-hoa", label: "Dễ tiêu hóa", icon: Soup },
];

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const tableRef = useRef<HTMLDListElement>(null);
  const [side, setSide] = useState(0);
  const [query, setQuery] = useState("");
  const [need, setNeed] = useState<"all" | GroupId>("all");
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const okN = need === "all" || recipe.group === need;
      const okT = tag === "all" || recipe.tags.includes(tag);
      const okQ = !q || `${recipe.title} ${recipe.excerpt}`.toLowerCase().includes(q);
      return okN && okT && okQ;
    });
  }, [need, query, tag]);

  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = list.slice((current - 1) * pageSize, current * pageSize);

  useEffect(() => {
    const node = tableRef.current;
    if (!node) return;
    const measure = () => setSide(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function openGroup(id: GroupId) {
    setNeed(id);
    setTag("all");
    setPage(1);
    document.getElementById("cong-thuc")?.scrollIntoView({ behavior: "smooth" });
  }

  function goPage(next: number) {
    setPage(next);
    document.getElementById("cong-thuc")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-10 md:px-8 md:py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-leaf">
            <Leaf className="size-4" aria-hidden="true" />
            {site.hero.eyebrow}
          </p>
          <h1 className="mt-3 max-w-xl font-display text-3xl leading-snug text-bark sm:text-4xl md:text-5xl">{site.hero.title}</h1>
          <p className="mt-3 font-display text-xl text-leaf-deep">{site.tagline}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
            {site.hero.lede}{" "}
            <a
              href="https://vkist.gov.vn/vi/ctype-service_news/sam-viet-nam--panax-vietnamensis-ha-grushv--cay-thuoc-quy-cua-viet-nam-103.htm"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-leaf underline decoration-leaf/50 underline-offset-2 hover:text-leaf-deep"
            >
              Xem thêm tại đây
            </a>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#cong-thuc" className={btnPrimary}>
              Thực dưỡng từ sâm
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <img
          src={site.hero.image}
          alt={site.hero.imageAlt}
          fetchPriority="high"
          className="aspect-4/3 w-full rounded-card object-cover shadow-[0_20px_40px_rgba(36,24,16,0.16)]"
        />
      </section>

      <section id="gioi-thieu" className="border-y border-line bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 md:grid-cols-3 md:px-8">
          {pillars.map((item, index) => {
            const Icon = pillarIcons[index] ?? Leaf;
            return (
              <article key={item.title} className="lift rounded-card p-2">
                <span className="icon-pop grid size-11 place-items-center rounded-full bg-sage text-leaf">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-3 font-display text-xl text-bark">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="phan-tich" className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8">
        <SectionTitle
          kicker="Bảng phân tích"
          title="Dinh dưỡng được nói bằng loài, saponin và vùng trồng."
        />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <dl ref={tableRef} className="min-w-0 divide-y divide-line rounded-card border border-line bg-paper">
            {nutrients.map((row) => (
              <div
                key={row.name}
                className="grid gap-1 px-4 py-2.5 transition hover:bg-sage/60 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
              >
                <dt className="flex items-center gap-2 text-[13px] font-semibold text-bark">
                  <Table2 className="size-3.5 shrink-0 text-leaf" aria-hidden="true" />
                  {row.name}
                </dt>
                <dd className="text-[13px] leading-relaxed text-mist">{row.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href="/axit-amin.html"
            className="amino-side group relative flex flex-col justify-between overflow-hidden rounded-card bg-[#3d2b1c] p-4 text-[#f7edd8] shadow-md sm:p-5"
            style={{ ["--side" as string]: side ? `${side}px` : undefined }}
          >
            <span className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-[#e2c27a]/25 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-12 -left-8 size-32 rounded-full bg-[#6d8a4e]/25 blur-2xl" />
            <span className="relative text-[10px] font-semibold tracking-[0.16em] text-[#e2c27a]">SÂM VIỆT NAM</span>
            <span className="relative mt-2 font-display text-lg leading-tight sm:text-xl">
              KHÁM PHÁ CÔNG DỤNG 17 AXIT AMIN
            </span>
            <span className="relative mt-2 text-xs leading-relaxed text-[#f7edd8]/85 sm:text-sm">
              Hàm lượng dinh dưỡng cao kết hợp chế độ dinh dưỡng với Sâm mang lại hiệu quả đặc biệt cho cơ thể của bạn
            </span>
            <span className="relative mt-3 inline-flex items-center justify-center rounded-2xl bg-[#e2c27a] px-3 py-2.5 text-center text-xs font-bold tracking-wide text-bark shadow-lg transition group-hover:-translate-y-1 group-hover:shadow-xl sm:text-sm">
              KHÁM PHÁ NGAY
            </span>
          </a>
        </div>
      </section>

      <section id="thuc-duong" className="bg-sage">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8">
          <SectionTitle kicker="Khám phá dinh dưỡng từ sâm" title="Năm nhóm thực dưỡng." />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {groups.map((group, index) => {
              const Icon = groupIcons[index] ?? Leaf;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => openGroup(group.id)}
                  className="lift rounded-card border border-line bg-paper p-5 text-left hover:border-leaf"
                >
                  <span className="icon-pop grid size-11 place-items-center rounded-full bg-sage text-leaf">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-display text-2xl text-bark">{group.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{group.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cong-thuc" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 md:px-8">
        <SectionTitle kicker="Công thức" title="Nấu với sâm, theo nhóm nhu cầu." />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm món"
          aria-label="Tìm món"
          className={cn(fieldClass, "mt-6")}
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-leaf">Nhu cầu</p>
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {needFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setNeed(item.id);
                setPage(1);
              }}
              className={
                need === item.id
                  ? "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-bark px-4 text-sm font-semibold text-paper transition hover:-translate-y-0.5"
                  : "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-bark transition hover:-translate-y-0.5 hover:border-leaf"
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-leaf">Thành phần</p>
        <div className="mt-2 flex gap-2 overflow-x-auto">
          <FilterChip on={tag === "all"} onClick={() => { setTag("all"); setPage(1); }} label="Tất cả" />
          {Object.entries(tagLabels).map(([id, label]) => (
            <FilterChip key={id} on={tag === id} onClick={() => { setTag(id); setPage(1); }} label={label} />
          ))}
        </div>
        <p className="mt-6 text-sm text-mist">
          {list.length} món · {groups.length} nhóm
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
        {pageCount > 1 ? (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang công thức">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => goPage(current - 1)}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-bark disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Trước
            </button>
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1;
              const on = number === current;
              return (
                <button
                  key={number}
                  type="button"
                  onClick={() => goPage(number)}
                  aria-current={on ? "page" : undefined}
                  className={
                    on
                      ? "grid size-11 place-items-center rounded-full bg-bark text-sm font-semibold text-paper"
                      : "grid size-11 place-items-center rounded-full border border-line bg-paper text-sm font-semibold text-bark"
                  }
                >
                  {number}
                </button>
              );
            })}
            <button
              type="button"
              disabled={current === pageCount}
              onClick={() => goPage(current + 1)}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-bark disabled:opacity-40"
            >
              Sau
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}

function FilterChip({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        on
          ? "inline-flex h-11 shrink-0 items-center rounded-full bg-bark px-4 text-sm font-semibold text-paper"
          : "inline-flex h-11 shrink-0 items-center rounded-full border border-line bg-paper px-4 text-sm font-semibold text-bark"
      }
    >
      {label}
    </button>
  );
}