import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Calculator,
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
import { btnGhost, btnPrimary, fieldClass } from "@/lib/ui";

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
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-snug text-bark md:text-5xl">{site.hero.title}</h1>
          <p className="mt-3 font-display text-xl text-leaf-deep">{site.tagline}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">{site.hero.lede}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#cong-thuc" className={btnPrimary}>
              Thực dưỡng từ sâm
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href="#nutri" className={btnGhost}>
              <Calculator className="size-4" aria-hidden="true" />
              Tính calo
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
        <dl className="mt-8 divide-y divide-line rounded-card border border-line bg-paper">
          {nutrients.map((row) => (
            <div
              key={row.name}
              className="grid gap-1 px-5 py-4 transition hover:bg-sage/60 sm:grid-cols-[12rem_1fr] sm:gap-6"
            >
              <dt className="flex items-center gap-2 text-sm font-semibold text-bark">
                <Table2 className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                {row.name}
              </dt>
              <dd className="text-sm leading-relaxed text-mist">{row.value}</dd>
            </div>
          ))}
        </dl>
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

      <section id="nutri" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-16 md:px-8">
        <CalorieBox />
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

function CalorieBox() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<"nu" | "nam">("nu");
  const h = Number(height);
  const w = Number(weight);
  const a = Number(age);
  const valid = h > 80 && h < 230 && w > 25 && w < 250 && a > 10 && a < 100;
  const bmrBase = valid ? (sex === "nam" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161) : null;
  const tdee = bmrBase ? Math.round(bmrBase * 1.55) : null;
  const proteinG = tdee ? Math.round(1.8 * w) : null;
  const fatG = tdee ? Math.round((tdee * 0.25) / 9) : null;
  const carbG = tdee && proteinG && fatG ? Math.max(0, Math.round((tdee - proteinG * 4 - fatG * 9) / 4)) : null;

  return (
    <div className="rounded-card border border-line bg-paper p-6 md:p-8">
      <span className="grid size-11 place-items-center rounded-full bg-sage text-leaf">
        <Calculator className="size-5" aria-hidden="true" />
      </span>
      <div className="mt-4">
        <SectionTitle
          kicker="Nutri-Calculator"
          title="Bảng Năng Lượng & Dinh Dưỡng Cần Thiết Mỗi Ngày"
          text="Bạn hãy nhập chiều cao, cân nặng, tuổi và giới tính. Kết quả sẽ cho biết một ngày cơ thể mình sẽ cần nạp bao nhiêu năng lượng và chất dinh dưỡng cần thiết"
        />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <label className="text-sm text-bark">
          Cao (cm)
          <input
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
        </label>
        <label className="text-sm text-bark">
          Nặng (kg)
          <input
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            inputMode="decimal"
            className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
        </label>
        <label className="text-sm text-bark">
          Tuổi
          <input
            value={age}
            onChange={(event) => setAge(event.target.value)}
            inputMode="numeric"
            className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
        </label>
        <label className="text-sm text-bark">
          Giới
          <select
            value={sex}
            onChange={(event) => setSex(event.target.value as "nu" | "nam")}
            className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
          >
            <option value="nu">Nữ</option>
            <option value="nam">Nam</option>
          </select>
        </label>
      </div>
      {tdee && proteinG && fatG && carbG ? (
        <p className="mt-4 text-sm leading-relaxed text-ink">
          Năng lượng cần thiết một ngày: khoảng {tdee} kcal. Trong đó khoảng {proteinG} g đạm, {fatG} g chất béo và{" "}
          {carbG} g tinh bột. Đây chỉ là thông tin tham khảo, không phải chỉ định y khoa.
        </p>
      ) : (
        <p className="mt-4 text-sm text-mist">Nhập chiều cao và cân nặng hợp lệ để xem mức năng lượng đối chiếu.</p>
      )}
    </div>
  );
}