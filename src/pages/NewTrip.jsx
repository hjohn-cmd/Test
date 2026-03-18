import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTrips } from '../store/useTripStore';
import { ArrowLeft, Plane } from 'lucide-react';

const EMOJIS = ['✈️', '🗼', '🗾', '🏝', '🏔', '🌴', '🏙', '🗺', '🌊', '⛩', '🎡', '🏕', '🚂', '🚢', '🎭', '🌸'];
const COLORS = [
  { label: 'Blå', value: 'from-blue-400 to-indigo-600' },
  { label: 'Rosa', value: 'from-pink-400 to-rose-600' },
  { label: 'Grønn', value: 'from-emerald-400 to-teal-600' },
  { label: 'Lilla', value: 'from-violet-400 to-purple-600' },
  { label: 'Oransje', value: 'from-orange-400 to-amber-600' },
  { label: 'Rød', value: 'from-red-400 to-rose-600' },
  { label: 'Turkis', value: 'from-cyan-400 to-blue-600' },
  { label: 'Gull', value: 'from-yellow-400 to-orange-500' },
];

export default function NewTrip() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: '',
    coverEmoji: '✈️',
    coverColor: 'from-blue-400 to-indigo-600',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Navn er påkrevd';
    if (!form.destination.trim()) e.destination = 'Destinasjon er påkrevd';
    if (!form.startDate) e.startDate = 'Startdato er påkrevd';
    if (!form.endDate) e.endDate = 'Sluttdato er påkrevd';
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = 'Sluttdato må være etter startdato';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const id = addTrip(form);
    navigate(`/trips/${id}`);
  };

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/trips" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
        <ArrowLeft size={16} />
        Tilbake til reiser
      </Link>

      <div className="card">
        {/* Preview banner */}
        <div className={`-mx-6 -mt-6 mb-6 h-28 bg-gradient-to-r ${form.coverColor} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}>
          <div className="text-5xl">{form.coverEmoji}</div>
          <div className="absolute bottom-3 left-6 text-white/80 text-sm font-medium">
            {form.name || 'Ny reise'} {form.destination ? `— ${form.destination}` : ''}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plane size={22} className="text-blue-600" />
          Planlegg ny reise
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="label">Reisenavn *</label>
            <input
              type="text"
              className={`input ${errors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              placeholder="f.eks. Tokyo Adventure"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Destination */}
          <div>
            <label className="label">Destinasjon *</label>
            <input
              type="text"
              className={`input ${errors.destination ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              placeholder="f.eks. Tokyo, Japan"
              value={form.destination}
              onChange={e => set('destination', e.target.value)}
            />
            {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Avreisedato *</label>
              <input
                type="date"
                className={`input ${errors.startDate ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="label">Hjemkomstdato *</label>
              <input
                type="date"
                className={`input ${errors.endDate ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                value={form.endDate}
                min={form.startDate}
                onChange={e => set('endDate', e.target.value)}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="label">Totalbudsjett (NOK)</label>
            <input
              type="number"
              className="input"
              placeholder="f.eks. 20000"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              min="0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Beskrivelse</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Hva gleder du deg mest til?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Emoji picker */}
          <div>
            <label className="label">Ikon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => set('coverEmoji', emoji)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    form.coverEmoji === emoji
                      ? 'ring-2 ring-blue-500 bg-blue-50 scale-110'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="label">Kortfarge</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => set('coverColor', color.value)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${color.value} transition-all ${
                    form.coverColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/trips" className="btn-secondary flex-1 justify-center">
              Avbryt
            </Link>
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Plane size={16} />
              Opprett reise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
