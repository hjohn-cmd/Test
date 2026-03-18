import { Link } from 'react-router-dom';
import { useTrips } from '../store/useTripStore';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24));
  if (d < 0) return null;
  if (d === 0) return 'I dag!';
  return `${d} dager`;
}

function TripCard({ trip, onDelete }) {
  const daysUntil = getDaysUntil(trip.startDate);
  const packingTotal = trip.packingList.flatMap(c => c.items).length;
  const packingDone = trip.packingList.flatMap(c => c.items).filter(i => i.packed).length;

  return (
    <div className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden">
      {/* Color accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${trip.coverColor}`} />

      <div className="flex items-start gap-4 pt-2">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${trip.coverColor} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
          {trip.coverEmoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{trip.name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                <MapPin size={13} />
                <span>{trip.destination}</span>
              </div>
            </div>
            {daysUntil && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {daysUntil}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <Calendar size={13} />
            <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
          </div>

          {trip.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-1">{trip.description}</p>
          )}

          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-3">
            <div className="text-xs text-gray-400">
              <span className="font-medium text-gray-600">{trip.itinerary.flatMap(d => d.activities).length}</span> aktiviteter
            </div>
            {packingTotal > 0 && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-600">{packingDone}/{packingTotal}</span> pakket
              </div>
            )}
            {trip.budget.total > 0 && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-600">{trip.budget.spent.toLocaleString('nb-NO')}</span>/{trip.budget.total.toLocaleString('nb-NO')} {trip.budget.currency}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/trips/${trip.id}`}
          className="flex-1 text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Åpne reise →
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); if (confirm('Slette denne reisen?')) onDelete(trip.id); }}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function TripsList() {
  const { trips, deleteTrip } = useTrips();

  const upcoming = trips.filter(t => new Date(t.endDate) >= new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const past = trips.filter(t => new Date(t.endDate) < new Date()).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mine Reiser</h1>
          <p className="text-gray-500 mt-1">{trips.length} reiser planlagt</p>
        </div>
        <Link to="/trips/new" className="btn-primary">
          <Plus size={18} />
          Ny reise
        </Link>
      </div>

      {trips.length === 0 && (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ingen reiser ennå</h2>
          <p className="text-gray-500 mb-6">Kom i gang ved å planlegge din første reise!</p>
          <Link to="/trips/new" className="btn-primary inline-flex">
            <Plus size={18} />
            Planlegg din første reise
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
            Kommende reiser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            Tidligere reiser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {past.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
