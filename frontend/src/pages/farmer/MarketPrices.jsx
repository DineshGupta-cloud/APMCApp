const MARKET_PRICES = [
  { crop: 'Soybean', market: 'APMC Main Market', min: 4500, max: 5100, modal: 4950, change: '+2.4%' },
  { crop: 'Cotton', market: 'APMC Main Market', min: 6800, max: 7400, modal: 7150, change: '+1.8%' },
  { crop: 'Wheat', market: 'APMC Main Market', min: 2300, max: 2650, modal: 2520, change: '+0.9%' },
  { crop: 'Soybean', market: 'Kalamna Market', min: 4420, max: 5050, modal: 4860, change: '+1.2%' },
]

const money = (value) => `₹${value.toLocaleString('en-IN')}`

export default function MarketPrices() {
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">Farmer Services</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Today's Mandi Prices</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Compare indicative crop prices across available APMC markets.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Markets</p><p className="mt-2 text-2xl font-bold dark:text-white">2</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Crops tracked</p><p className="mt-2 text-2xl font-bold dark:text-white">3</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Last updated</p><p className="mt-2 text-2xl font-bold dark:text-white">Today</p></div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-bold text-slate-900 dark:text-white">Market price list</h2><p className="mt-1 text-sm text-slate-500">Prices are shown per quintal.</p></div>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option>All markets</option><option>APMC Main Market</option><option>Kalamna Market</option></select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60"><tr><th className="px-5 py-3">Crop</th><th className="px-5 py-3">Market</th><th className="px-5 py-3">Min</th><th className="px-5 py-3">Max</th><th className="px-5 py-3">Modal</th><th className="px-5 py-3">Change</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MARKET_PRICES.map((item, index) => <tr key={`${item.crop}-${item.market}-${index}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40"><td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">🌾 {item.crop}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.market}</td><td className="px-5 py-4">{money(item.min)}</td><td className="px-5 py-4">{money(item.max)}</td><td className="px-5 py-4 font-bold">{money(item.modal)}</td><td className="px-5 py-4 font-semibold text-emerald-600">{item.change}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
