import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { type Recipe, groupName } from "@/data/content";

export function SectionTitle({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-leaf">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl leading-snug text-bark md:text-4xl">{title}</h2>
      {text ? <p className="mt-3 text-base leading-relaxed text-mist">{text}</p> : null}
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group lift overflow-hidden rounded-card border border-line bg-paper">
      <Link to="/cong-thuc/$slug" params={{ slug: recipe.slug }} className="block">
        <img
          src={recipe.image}
          alt=""
          className="zoom-img aspect-4/3 w-full object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-leaf">
            <Clock className="size-3.5" aria-hidden="true" />
            {groupName(recipe.group)} · {recipe.minutes} phút
          </p>
          <h3 className="mt-1 font-display text-xl leading-snug text-bark">{recipe.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">{recipe.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}

export function Missing({ what }: { what: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-20">
      <h1 className="font-display text-4xl text-bark">Không thấy {what}</h1>
      <Link to="/" hash="cong-thuc" className="mt-6 inline-block text-sm font-semibold text-leaf">
        Về thực dưỡng
      </Link>
    </main>
  );
}
