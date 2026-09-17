const PRODUCE = [
  { crop: 'Cotton', lot: '#APMC10234', quantity: '500 kg', status: 'Awaiting Bid', value: '₹7,120/q', tone: 'amber' },
  { crop: 'Soybean', lot: '#APMC10229', quantity: '800 kg', status: 'Sold', value: '₹1,18,400', tone: 'emerald' },
  { crop: 'Wheat', lot: '#APMC10218', quantity: '600 kg', status: 'Payment Pending', value: '₹32,400', tone: 'sky' },
]

export default function MyProduce() {
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-medium text-emerald-600">Farmer Services</p><h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">My Produce</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track produce submitted to the APMC and monitor each lot.</p></div>
        <button type="button" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">+ Add Produce</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Total lots</p><p className="mt-2 text-2xl font-bold dark:text-white">12</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Awaiting bids</p><p className="mt-2 text-2xl font-bold dark:text-white">4</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"><p className="text-sm text-slate-500">Sold this month</p><p className="mt-2 text-2xl font-bold dark:text-white">8</p></div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-bold text-slate-900 dark:text-white">Recent lots</h2><input placeholder="Search lot or crop..." className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
        <div className="mt-5 space-y-3">{PRODUCE.map((item) => <div key={item.lot} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><div><div className="flex items-center gap-2"><span className="font-semibold text-slate-900 dark:text-white">🌾 {item.crop}</span><span className="text-xs text-slate-400">{item.lot}</span></div><p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p></div><div className="flex items-center gap-5"><div><p className="text-xs text-slate-400">Value / Bid</p><p className="font-bold text-slate-900 dark:text-white">{item.value}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : item.tone === 'amber' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'}`}>{item.status}</span><button type="button" className="text-sm font-semibold text-emerald-600">Details</button></div></div>)}</div>
      </div>
    </section>
  )
}
