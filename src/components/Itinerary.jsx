import { useState } from 'react';
import { Plus, Trash2, Clock, Utensils, Camera, ShoppingBag, Car, Hotel, Star, X } from 'lucide-react';

const ACTIVITY_TYPES = [
  { value: 'sightseeing', label: 'Sightseeing', icon: Camera, color: 'text-blue-600 bg-blue-50' },
  { value: 'food', label: 'Mat & Drikke', icon: Utensils, color: 'text-orange-600 bg-orange-50' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600 bg-pink-50' },
  { value: 'transport', label: 'Transport', icon: Car, color: 'text-gray-600 bg-gray-100' },
  { value: 'accommodation', label: 'Overnatting', icon: Hotel, color: 'text-indigo-600 bg-indigo-50' },
  { value: 'activity', label: 'Aktivitet', icon: Star, color: 'text-emerald-600 bg-emerald-50' },
];

function getActivityType(type) {
  return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
}

function getDaysBetween(start, end) {
  const days = [];
  const s = new Date(start);
  const e = new Date(end);
  while (s <= e) {
    days.push(s.toISOString().split('T')[0]);
    s.setDate(s.getDate() + 1);
  }
  return days;
}

function formatDay(dateStr, index) {
  const date = new Date(dateStr);
  return {
    short: date.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' }),
    day: `Dag ${index + 1}`
  };
}

function AddActivityModal({ dayId, onAdd, onClose }) {
  const [form, setForm] = useState({ time: '', title: '', type: 'sightseeing', notes: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Tittel er påkrevd'); return; }
    onAdd(dayId, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-gray-900">Legg til aktivitet</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Tittel *</label>
            <input type="text" className="input" placeholder="f.eks. Besøk Eiffeltårnet" value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setError(''); }} autoFocus />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tid</label>
              <input type="time" className="input" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ACTIVITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Notater</label>
            <textarea className="input resize-none" rows={2} placeholder="Tips, adresse, bookinginfo..." value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Avbryt</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Legg til</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Itinerary({ trip, onAddActivity, onRemoveActivity }) {
  const [addingToDay, setAddingToDay] = useState(null);
  const days = getDaysBetween(trip.startDate, trip.endDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Reiseplan</h2>
        <span className="text-sm text-gray-500">
          {days.length} {days.length === 1 ? 'dag' : 'dager'}
        </span>
      </div>

      {days.map((dayStr, idx) => {
        const dayData = trip.itinerary.find(d => d.date === dayStr);
        const activities = dayData?.activities || [];
        const sorted = [...activities].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        const formatted = formatDay(dayStr, idx);

        return (
          <div key={dayStr} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{formatted.day}</span>
                <div className="font-semibold text-gray-900">{formatted.short}</div>
              </div>
              <button
                onClick={() => setAddingToDay(dayStr)}
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={15} />
                Legg til
              </button>
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-400 text-sm">Ingen aktiviteter ennå</p>
                <button onClick={() => setAddingToDay(dayStr)} className="text-blue-500 text-sm mt-1 hover:text-blue-600">
                  + Legg til aktivitet
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {sorted.map(activity => {
                  const typeInfo = getActivityType(activity.type);
                  const Icon = typeInfo.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 group transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {activity.time && (
                            <span className="text-xs font-mono text-gray-500 flex items-center gap-0.5">
                              <Clock size={10} />
                              {activity.time}
                            </span>
                          )}
                          <span className="font-medium text-gray-900 text-sm">{activity.title}</span>
                        </div>
                        {activity.notes && (
                          <p className="text-xs text-gray-500 mt-0.5">{activity.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveActivity(trip.id, dayStr, activity.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {addingToDay && (
        <AddActivityModal
          dayId={addingToDay}
          onAdd={onAddActivity}
          onClose={() => setAddingToDay(null)}
        />
      )}
    </div>
  );
}
