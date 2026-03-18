import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../store/useTripStore';
import Itinerary from '../components/Itinerary';
import PackingList from '../components/PackingList';
import Budget from '../components/Budget';
import { ArrowLeft, Calendar, MapPin, Map, CheckSquare, DollarSign, Edit3 } from 'lucide-react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysUntil(dateStr) {
  const d = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return d;
}

export default function TripDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    trips,
    addActivity, removeActivity,
    togglePackingItem, addPackingItem, addPackingCategory, removePackingItem,
    addBudgetCategory, addExpense
  } = useTrips();

  const trip = trips.find(t => t.id === id);
  const activeTab = searchParams.get('tab') || 'itinerary';

  if (!trip) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Reise ikke funnet</h2>
        <Link to="/trips" className="text-blue-600 hover:underline">Tilbake til reiser</Link>
      </div>
    );
  }

  const daysUntil = getDaysUntil(trip.startDate);
  const packingTotal = trip.packingList.flatMap(c => c.items).length;
  const packingDone = trip.packingList.flatMap(c => c.items).filter(i => i.packed).length;

  const tabs = [
    { id: 'itinerary', label: 'Reiseplan', icon: Map, count: trip.itinerary.flatMap(d => d.activities).length },
    { id: 'packing', label: 'Pakkeliste', icon: CheckSquare, count: packingTotal > 0 ? `${packingDone}/${packingTotal}` : null },
    { id: 'budget', label: 'Budsjett', icon: DollarSign, count: trip.budget.categories.length > 0 ? `${trip.budget.spent.toLocaleString('nb-NO')} ${trip.budget.currency}` : null },
  ];

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link to="/trips" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <ArrowLeft size={16} />
        Mine reiser
      </Link>

      {/* Hero banner */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${trip.coverColor} rounded-3xl p-6 md:p-8 text-white shadow-lg`}>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl mb-3">{trip.coverEmoji}</div>
              <h1 className="text-3xl font-bold mb-1">{trip.name}</h1>
              <div className="flex items-center gap-1.5 text-white/80 mb-2">
                <MapPin size={14} />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <Calendar size={13} />
                <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
              </div>
              {trip.description && (
                <p className="text-white/70 text-sm mt-3 max-w-md">{trip.description}</p>
              )}
            </div>

            {daysUntil > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[90px] hidden sm:block">
                <div className="text-3xl font-bold">{daysUntil}</div>
                <div className="text-xs text-white/80">dager til avreise</div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 right-16 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'itinerary' && (
          <Itinerary
            trip={trip}
            onAddActivity={addActivity}
            onRemoveActivity={removeActivity}
          />
        )}
        {activeTab === 'packing' && (
          <PackingList
            trip={trip}
            onToggle={togglePackingItem}
            onAddItem={addPackingItem}
            onAddCategory={addPackingCategory}
            onRemoveItem={removePackingItem}
          />
        )}
        {activeTab === 'budget' && (
          <Budget
            trip={trip}
            onAddCategory={addBudgetCategory}
            onAddExpense={addExpense}
          />
        )}
      </div>
    </div>
  );
}
