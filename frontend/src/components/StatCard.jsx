function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <article className="metric-card rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/60 p-4 shadow-lg shadow-black/10 transition-colors hover:border-slate-700 sm:p-5">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-slate-400">

            {title}

          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">

            {value}

          </p>

        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-xl ${color}`}
        >

          <Icon className="text-white" size={23} aria-hidden="true" />

        </div>

      </div>

    </article>
  );
}

export default StatCard;
