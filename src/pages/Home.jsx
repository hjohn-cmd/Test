import { Link } from 'react-router-dom';
import { useTrips } from '../store/useTripStore';
import { Plane, Map, CheckSquare, DollarSign, ArrowRight, Calendar, TrendingUp } from 'lucide-react';

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function Home() {
  const { trips } = useTrips();
  const upcomingTrips = trips.filter(t => new Date(t.startDate) >= new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const nextTrip = upcomingTrips[0];

  const stats = {
    total: trips.length,
    upcoming: upcomingTrips.length,
    destinations: [...new Set(trips.map(t => t.destination.split(',')[1]?.trim()).filter(Boolean))].length,
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10">
          <p className="text-blue-200 font-medium mb-2">Velkommen tilbake ✈️</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Din neste eventyr<br />venter på deg
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-md">
            Planlegg reiser, bygg reiselister, spor budsjettet ditt — alt på ett sted.
          </p>
          <Link
            to="/trips/new"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plane size={18} />
            Planlegg ny reise
            <ArrowRight size={16} />
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Totale reiser', value: stats.total, icon: Map, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kommende', value: stats.upcoming, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Destinasjoner', value: stats.destinations, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="card text-center">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Next trip highlight */}
      {nextTrip && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>Neste reise</span>
            <span className="text-sm font-normal bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {getDaysUntil(nextTrip.startDate)} dager igjen
            </span>
          </h2>
          <Link to={`/trips/${nextTrip.id}`} className="block group">
            <div className={`relative overflow-hidden bg-gradient-to-r ${nextTrip.coverColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl mb-3">{nextTrip.coverEmoji}</div>
                  <h3 className="text-2xl font-bold mb-1">{nextTrip.name}</h3>
                  <p className="text-white/80 mb-3">{nextTrip.destination}</p>
                  <p className="text-sm text-white/70">
                    {formatDate(nextTrip.startDate)} — {formatDate(nextTrip.endDate)}
                  </p>
                </div>
                <div className="text-right space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center min-w-[80px]">
                    <div className="text-2xl font-bold">{getDaysUntil(nextTrip.startDate)}</div>
                    <div className="text-xs text-white/80">dager</div>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm justify-end group-hover:text-white transition-colors">
                    <span>Se detaljer</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
              {/* Progress bars */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Pakkeliste', value: nextTrip.packingList.length > 0 ? Math.round(nextTrip.packingList.flatMap(c => c.items).filter(i => i.packed).length / Math.max(nextTrip.packingList.flatMap(c => c.items).length, 1) * 100) : 0, icon: CheckSquare },
                  { label: 'Budsjett', value: nextTrip.budget.total > 0 ? Math.round(nextTrip.budget.spent / nextTrip.budget.total * 100) : 0, icon: DollarSign },
                  { label: 'Reiseplan', value: nextTrip.itinerary.flatMap(d => d.activities).length > 0 ? Math.min(nextTrip.itinerary.flatMap(d => d.activities).length * 10, 100) : 0, icon: Map },
                ].map(item => (
                  <div key={item.label} className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-1 text-xs text-white/70 mb-2">
                      <item.icon size={12} />
                      <span>{item.label}</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <div className="text-xs text-white/80 mt-1">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Funksjoner</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '📍', title: 'Reiseplan', desc: 'Bygg dag-for-dag reiseplan med aktiviteter, tidspunkter og notater.',
              link: trips[0] ? `/trips/${trips[0].id}?tab=itinerary` : '/trips'
            },
            {
              icon: '🎒', title: 'Pakkeliste', desc: 'Hold oversikt over hva du trenger å pakke og sjekk av etter hvert.',
              link: trips[0] ? `/trips/${trips[0].id}?tab=packing` : '/trips'
            },
            {
              icon: '💰', title: 'Budsjett', desc: 'Sett budsjett per kategori og spor utgiftene dine underveis.',
              link: trips[0] ? `/trips/${trips[0].id}?tab=budget` : '/trips'
            },
          ].map(feature => (
            <Link key={feature.title} to={feature.link} className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                <span>Utforsk</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
