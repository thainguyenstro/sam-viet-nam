import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Calculator, ChefHat, Clock, Leaf, ListChecks, Loader2 } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Missing, RecipeCard } from "@/components/site/blocks";
import { groupName, recipeBySlug, recipes, tagLabels } from "@/data/content";
import { recipeNotes } from "@/data/recipe-notes";
import { scaleAmount } from "@/lib/format";

export const Route = createFileRoute("/cong-thuc/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${recipeBySlug(params.slug)?.title ?? "Công thức"} — Sâm Việt Nam` }],
  }),
  component: RecipePage,
});

function RecipePage() {
  const { slug } = Route.useParams();
  const recipe = recipeBySlug(slug);
  const [servings, setServings] = useState(recipe?.servings ?? 2);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<"nu" | "nam">("nu");
  const [showCook, setShowCook] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{ tdee: number; proteinG: number; fatG: number; carbG: number } | null>(null);
  const calcTimer = useRef<number | null>(null);

  useEffect(() => {
    const current = recipeBySlug(slug);
    if (!current) return;
    setServings(current.servings);
    setShowCook(false);
    setResult(null);
    setCalculating(false);
  }, [slug]);

  const factor = recipe ? servings / recipe.servings : 1;
  const scaled = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((item) => ({
      ...item,
      label: item.amount === null ? item.unit : `${scaleAmount(item.amount, factor)} ${item.unit}`,
    }));
  }, [factor, recipe]);

  if (!recipe) return <Missing what="công thức" />;

  const more = recipes.filter((item) => item.group === recipe.group && item.slug !== recipe.slug).slice(0, 3);
  const notes = recipeNotes[recipe.slug];
  const story = notes?.intro || recipe.excerpt;
  const greens = notes?.greens;
  const finish = notes?.finish;
  const h = Number(height);
  const w = Number(weight);
  const a = Number(age);
  const valid = h > 80 && h < 230 && w > 25 && w < 250 && a > 10 && a < 100;
  const bmrBase = valid ? (sex === "nam" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161) : null;
  const tdee = bmrBase ? Math.round(bmrBase * 1.55) : null;
  const proteinG = tdee ? Math.round(1.8 * w) : null;
  const fatG = tdee ? Math.round((tdee * 0.25) / 9) : null;
  const carbG = tdee && proteinG && fatG ? Math.max(0, Math.round((tdee - proteinG * 4 - fatG * 9) / 4)) : null;
  const portionKcal = Math.round(recipe.kcal * factor);

  function clearStats() {
    setResult(null);
  }

  function runCalc() {
    if (!valid || tdee == null || proteinG == null || fatG == null || carbG == null) return;
    setCalculating(true);
    setResult(null);
    if (calcTimer.current) window.clearTimeout(calcTimer.current);
    const snapshot = { tdee, proteinG, fatG, carbG };
    calcTimer.current = window.setTimeout(() => {
      setResult(snapshot);
      setCalculating(false);
    }, 1000);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 md:px-8">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-leaf">
        <Leaf className="size-4" aria-hidden="true" />
        {groupName(recipe.group)}
      </p>
      <h1 className="mt-2 font-display text-3xl leading-snug text-bark sm:text-4xl">{recipe.title}</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-mist">
        <Clock className="size-4 text-leaf" aria-hidden="true" />
        Khoảng {recipe.minutes} phút · ước lượng {recipe.kcal} kcal cho {recipe.servings} phần gốc
      </p>

      <img
        src={recipe.image}
        alt=""
        data-recipe-hero
        className="mt-6 aspect-video w-full rounded-card border border-line object-cover"
      />

      <section className="mt-6 rounded-card border border-line bg-paper p-5 md:p-6">
        <h2 className="font-display text-2xl text-bark">Câu chuyện dinh dưỡng</h2>
        <p className="mt-2 text-base leading-relaxed text-mist">{story}</p>
        {greens ? (
          <div className="mt-4 rounded-2xl bg-cream px-4 py-3">
            <h3 className="text-sm font-semibold text-bark">Rau xanh trong món</h3>
            <p className="mt-1 text-sm leading-relaxed text-mist">{greens}</p>
          </div>
        ) : null}
      </section>

      <section className="mt-4 rounded-card bg-[#d9c7ae] px-5 py-8 text-ink">
        <h2 className="flex items-center justify-center gap-2 text-center font-display text-2xl">
          <ListChecks className="size-5" aria-hidden="true" />
          Nguyên liệu
        </h2>
        <ul className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
          {scaled.map((item) => (
            <li key={item.name} className="flex items-center gap-3 rounded-2xl bg-[#f6efe4] px-3 py-3">
              {item.icon ? (
                <img src={item.icon} alt="" className="size-16 shrink-0 object-contain" />
              ) : null}
              <span className="min-w-0">
                <span className="block text-base font-semibold leading-snug">{item.name}</span>
                <span className="mt-0.5 block text-base text-bark">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-paper/70 px-3 py-1 text-xs font-semibold">
              {tagLabels[tag] ?? tag}
            </span>
          ))}
        </div>
      </section>

      <a
        href="https://s.shopee.vn/3VlyIlkNrM"
        target="_blank"
        rel="noreferrer"
        className="lift mx-auto mt-4 flex h-12 w-full max-w-md items-center justify-center rounded-2xl bg-[#d7b15e] px-6 text-sm font-semibold text-bark shadow-md"
      >
        Mua Sâm Dây Tại Đây
      </a>

      <div className="mt-4">
        <section className="rounded-card border border-line bg-paper px-5 py-8">
          <h2 className="flex items-center justify-center gap-2 text-center font-display text-2xl text-bark">
            <ChefHat className="size-5 text-leaf" aria-hidden="true" />
            Sơ chế
          </h2>
          {showCook ? (
            <ul className="mx-auto mt-4 max-w-xl list-disc space-y-2 pl-5 text-base leading-relaxed text-ink">
              {recipe.prep.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <div className="relative mt-4">
              <ul className="mx-auto max-h-16 max-w-xl list-disc space-y-2 overflow-hidden pl-5 text-base leading-relaxed text-ink blur-md select-none">
                {recipe.prep.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-paper to-transparent" />
              <div className="relative mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowCook(true)}
                  className="rounded-xl bg-[#1ea7ff] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1496ea]"
                >
                  Xem thêm
                </button>
              </div>
            </div>
          )}
        </section>

        {showCook ? (
          <section className="mt-4 rounded-card border border-line bg-[#f6efe4] px-5 py-8">
            <h2 className="flex items-center justify-center gap-2 text-center font-display text-2xl text-bark">
              <ChefHat className="size-5 text-leaf" aria-hidden="true" />
              Cách chế biến
            </h2>
            <ol className="mx-auto mt-4 max-w-xl space-y-3">
              {recipe.steps.map((step, index) => {
                const same = step.body.trim() === step.title.trim() || step.body.trim().startsWith(step.title.trim());
                return (
                  <li key={`${step.title}-${index}`} className="rounded-2xl bg-paper px-4 py-3">
                    <h3 className="text-base font-semibold text-bark">
                      {index + 1}. {same ? step.body : step.title}
                    </h3>
                    {same ? null : <p className="mt-1 text-base leading-relaxed text-mist">{step.body}</p>}
                  </li>
                );
              })}
            </ol>
            {finish ? (
              <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-paper px-4 py-3 text-base leading-relaxed text-ink">
                <span className="font-semibold">Thành phẩm. </span>
                {finish}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>

      <section className="mt-4 rounded-card border border-line bg-paper p-5">
        <h2 className="font-display text-2xl text-bark">Ước lượng calo (năng lượng) dựa trên số khẩu phần ăn</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-bark">Số người</p>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            onClick={() => setServings((value) => Math.max(1, value - 1))}
            aria-label="Giảm khẩu phần"
          >
            −
          </button>
          <span className="min-w-10 text-center font-display text-2xl text-bark">{servings}</span>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line"
            onClick={() => setServings((value) => Math.min(12, value + 1))}
            aria-label="Tăng khẩu phần"
          >
            +
          </button>
          <p className="text-sm text-mist">Ước lượng tổng calo theo số khẩu phần đã nhập: {portionKcal} kcal</p>
        </div>
      </section>

      <section id="nutri" className="mt-4 rounded-card border border-line bg-paper p-5">
        <h2 className="flex items-center gap-2 font-display text-2xl text-bark">
          <Calculator className="size-5 text-leaf" aria-hidden="true" />
          Nutri-Calculator
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Tính lượng calo (năng lượng) mỗi ngày cần thiết dựa trên chiều cao/ cân nặng và giới tính, độ tuổi.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <label className="text-sm text-bark">
            Cao (cm)
            <input
              value={height}
              onChange={(event) => {
                setHeight(event.target.value);
                clearStats();
              }}
              inputMode="decimal"
              className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
            />
          </label>
          <label className="text-sm text-bark">
            Nặng (kg)
            <input
              value={weight}
              onChange={(event) => {
                setWeight(event.target.value);
                clearStats();
              }}
              inputMode="decimal"
              className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
            />
          </label>
          <label className="text-sm text-bark">
            Tuổi
            <input
              value={age}
              onChange={(event) => {
                setAge(event.target.value);
                clearStats();
              }}
              inputMode="numeric"
              className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
            />
          </label>
          <label className="text-sm text-bark">
            Giới
            <select
              value={sex}
              onChange={(event) => {
                setSex(event.target.value as "nu" | "nam");
                clearStats();
              }}
              className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3"
            >
              <option value="nu">Nữ</option>
              <option value="nam">Nam</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={runCalc}
          disabled={!valid || calculating}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#d7b15e] px-6 text-sm font-semibold text-bark shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {calculating ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {calculating ? "Đang tính..." : "Tính toán"}
        </button>
        {calculating ? (
          <p className="mt-3 text-sm text-mist">Đang tính năng lượng trong ngày...</p>
        ) : result ? (
          <div className="mt-4 rounded-2xl border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
            Năng lượng cần thiết một ngày: {result.tdee} kcal. {result.proteinG} g đạm, {result.fatG} g chất béo và{" "}
            {result.carbG} g tinh bột. Dựa trên số khẩu phần món ăn bên trên bạn sẽ nạp {portionKcal} trên tổng{" "}
            {result.tdee} calo cần trong ngày. Đây chỉ là thông tin tham khảo, không phải chỉ định y khoa.
          </div>
        ) : (
          <p className="mt-3 text-sm text-mist">Nhập chiều cao, cân nặng, tuổi và giới tính, rồi bấm Tính toán.</p>
        )}
      </section>

      <aside className="mt-6 rounded-card border border-line bg-[#f6efe4] p-5 text-sm leading-relaxed text-ink">
        <p className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-4 text-leaf" aria-hidden="true" />
          Lưu ý về nhân sâm
        </p>
        <p className="mt-2">
          Các món mặn, cháo, canh và súp dùng 0,5 g sâm Ngọc Linh dạng khô hoặc 1 g dạng tươi cho toàn bộ công thức khoảng
          2 khẩu phần. Trà 300–400 ml dùng tối đa 0,3 g dạng khô hoặc 0,5 g dạng tươi cho một bình. Đây là lượng thử
          nghiệm ẩm thực, không phải liều y khoa. Nếu nhãn sản phẩm quy định lượng thấp hơn, làm theo nhãn. Không dùng sản
          phẩm không rõ nguồn gốc và không tự đổi củ hoặc lát sang bột. Món ghi tùy chọn có thể bỏ sâm.
        </p>
      </aside>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-bark">Cùng nhóm</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {more.map((item) => (
            <RecipeCard key={item.slug} recipe={item} />
          ))}
        </div>
        <Link to="/" hash="cong-thuc" className="mt-6 inline-block text-sm font-semibold text-leaf">
          Tất cả món
        </Link>
      </section>
    </main>
  );
}
