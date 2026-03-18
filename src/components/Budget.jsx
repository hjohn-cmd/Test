import { useState } from 'react';
import { Plus, TrendingUp, AlertCircle, X } from 'lucide-react';

const CATEGORY_ICONS = ['✈️', '🏨', '🍜', '🎭', '🚇', '🛍', '💊', '📸', '🎟', '⚡'];

function BudgetBar({ spent, allocated, color }) {
  const pct = allocated > 0 ? Math.min(spent / allocated * 100, 100) : 0;
  const over = allocated > 0 && spent > allocated;
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Budget({ trip, onAddCategory, onAddExpense }) {
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', icon: '✈️', allocated: '' });
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');

  const { budget } = trip;
  const totalAllocated = budget.categories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = budget.categories.reduce((s, c) => s + c.spent, 0);
  const remaining = budget.total - totalSpent;
  const progress = budget.total > 0 ? Math.min(totalSpent / budget.total * 100, 100) : 0;
  const isOverBudget = totalSpent > budget.total && budget.total > 0;

  const handleAddCat = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    onAddCategory(trip.id, { name: catForm.name, icon: catForm.icon, allocated: Number(catForm.allocated) || 0 });
    setCatForm({ name: '', icon: '✈️', allocated: '' });
    setShowAddCat(false);
  };

  const handleAddExpense = (e, catId) => {
    e.preventDefault();
    if (!expenseAmount) return;
    onAddExpense(trip.id, catId, expenseAmount);
    setExpenseAmount('');
    setExpenseNote('');
    setShowAddExpense(null);
  };

  return (
    <div className="space-y-4">
      {/* Overview card */}
      <div className={`card ${isOverBudget ? 'border-red-200' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Budsjett</h2>
            <p className="text-sm text-gray-500">Total ramme: {budget.total.toLocaleString('nb-NO')} {budget.currency}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : remaining < budget.total * 0.2 ? 'text-orange-500' : 'text-emerald-600'}`}>
              {remaining.toLocaleString('nb-NO')}
            </div>
            <div className="text-xs text-gray-500">{budget.currency} igjen</div>
          </div>
        </div>

        <BudgetBar spent={totalSpent} allocated={budget.total} color="bg-blue-500" />

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Brukt: <strong className="text-gray-700">{totalSpent.toLocaleString('nb-NO')} {budget.currency}</strong></span>
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : ''}`}>{Math.round(progress)}%</span>
        </div>

        {isOverBudget && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
            <AlertCircle size={15} />
            <span>Du har overskredet budsjettet med {(totalSpent - budget.total).toLocaleString('nb-NO')} {budget.currency}</span>
          </div>
        )}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Totalt budsjett', val: budget.total, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Brukt', val: totalSpent, color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: 'Igjen', val: remaining, color: isOverBudget ? 'text-red-700' : 'text-emerald-700', bg: isOverBudget ? 'bg-red-50' : 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.val.toLocaleString('nb-NO')}</div>
            <div className="text-xs text-gray-500 mt-0.5">{budget.currency} — {s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {budget.categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm">Kategorier</h3>
          {budget.categories.map(cat => {
            const pct = cat.allocated > 0 ? Math.round(cat.spent / cat.allocated * 100) : 0;
            const isOver = cat.spent > cat.allocated && cat.allocated > 0;
            return (
              <div key={cat.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                      {cat.allocated > 0 && (
                        <div className="text-xs text-gray-500">
                          {cat.spent.toLocaleString('nb-NO')} / {cat.allocated.toLocaleString('nb-NO')} {budget.currency}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOver && <AlertCircle size={14} className="text-red-500" />}
                    <span className={`text-sm font-semibold ${isOver ? 'text-red-600' : 'text-gray-700'}`}>
                      {pct}%
                    </span>
                    <button
                      onClick={() => setShowAddExpense(showAddExpense === cat.id ? null : cat.id)}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      + Utgift
                    </button>
                  </div>
                </div>
                <BudgetBar spent={cat.spent} allocated={cat.allocated} color="bg-blue-400" />

                {showAddExpense === cat.id && (
                  <form onSubmit={e => handleAddExpense(e, cat.id)} className="mt-3 flex gap-2">
                    <input
                      type="number"
                      className="input flex-1 text-sm"
                      placeholder={`Beløp (${budget.currency})`}
                      value={expenseAmount}
                      onChange={e => setExpenseAmount(e.target.value)}
                      min="0"
                      autoFocus
                    />
                    <button type="submit" className="btn-primary py-1.5 px-3 text-sm">
                      <Plus size={14} />
                    </button>
                    <button type="button" onClick={() => setShowAddExpense(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                      <X size={14} />
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add category */}
      {showAddCat ? (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Ny budsjett-kategori</h3>
          <form onSubmit={handleAddCat} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Navn</label>
                <input type="text" className="input" placeholder="f.eks. Transport" value={catForm.name}
                  onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="label">Bevilget ({budget.currency})</label>
                <input type="number" className="input" placeholder="0" value={catForm.allocated} min="0"
                  onChange={e => setCatForm(f => ({ ...f, allocated: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Ikon</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => setCatForm(f => ({ ...f, icon }))}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      catForm.icon === icon ? 'ring-2 ring-blue-500 bg-blue-50 scale-110' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>{icon}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddCat(false)} className="btn-secondary flex-1 justify-center text-sm">Avbryt</button>
              <button type="submit" className="btn-primary flex-1 justify-center text-sm">Legg til kategori</button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => setShowAddCat(true)}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={16} />
          Legg til budsjett-kategori
        </button>
      )}

      {budget.categories.length === 0 && !showAddCat && (
        <div className="text-center py-4 text-sm text-gray-500">
          <TrendingUp size={32} className="mx-auto mb-2 text-gray-300" />
          <p>Legg til kategorier for å spore utgiftene dine</p>
        </div>
      )}
    </div>
  );
}
