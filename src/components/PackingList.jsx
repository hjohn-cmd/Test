import { useState } from 'react';
import { Plus, Trash2, Check, Package, X } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Klær', 'Elektronikk', 'Dokumenter', 'Toalettsaker', 'Medisiner', 'Annet'];

export default function PackingList({ trip, onToggle, onAddItem, onAddCategory, onRemoveItem }) {
  const [newCat, setNewCat] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  const totalItems = trip.packingList.flatMap(c => c.items).length;
  const packedItems = trip.packingList.flatMap(c => c.items).filter(i => i.packed).length;
  const progress = totalItems > 0 ? Math.round(packedItems / totalItems * 100) : 0;

  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = newCat.trim();
    if (!name) return;
    onAddCategory(trip.id, name);
    setNewCat('');
    setShowCatInput(false);
  };

  const handleAddItem = (e, catId) => {
    e.preventDefault();
    const name = newItemName.trim();
    if (!name) return;
    onAddItem(trip.id, catId, name);
    setNewItemName('');
    setAddingToCategory(null);
  };

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pakkeliste</h2>
            <p className="text-sm text-gray-500">{packedItems} av {totalItems} gjenstander pakket</p>
          </div>
          <div className="text-3xl font-bold text-blue-600">{progress}%</div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && totalItems > 0 && (
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <Check size={14} />
            Alt er pakket! Klar for avreise! 🎉
          </p>
        )}
      </div>

      {/* Quick add from default categories */}
      {trip.packingList.length === 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">Kom i gang med standardkategorier:</h3>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onAddCategory(trip.id, cat)}
                className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {trip.packingList.map(category => {
        const catPacked = category.items.filter(i => i.packed).length;
        const catTotal = category.items.length;
        return (
          <div key={category.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">{category.category}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {catPacked}/{catTotal}
                </span>
              </div>
              <button
                onClick={() => setAddingToCategory(addingToCategory === category.id ? null : category.id)}
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-sm transition-colors"
              >
                <Plus size={14} />
                <span className="text-xs">Legg til</span>
              </button>
            </div>

            {addingToCategory === category.id && (
              <form onSubmit={(e) => handleAddItem(e, category.id)} className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="input text-sm flex-1"
                  placeholder="Ny gjenstand..."
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-primary py-1.5 px-3 text-sm">
                  <Plus size={14} />
                </button>
                <button type="button" onClick={() => { setAddingToCategory(null); setNewItemName(''); }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={14} />
                </button>
              </form>
            )}

            <div className="space-y-1">
              {category.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-gray-50 group transition-colors"
                >
                  <button
                    onClick={() => onToggle(trip.id, category.id, item.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      item.packed
                        ? 'bg-emerald-500 border-emerald-500 scale-95'
                        : 'border-gray-300 hover:border-emerald-400'
                    }`}
                  >
                    {item.packed && <Check size={11} className="text-white" strokeWidth={3} />}
                  </button>
                  <span className={`text-sm flex-1 transition-all ${item.packed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => onRemoveItem(trip.id, category.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {category.items.length === 0 && (
                <p className="text-xs text-gray-400 py-2 text-center">Tom kategori</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Add category */}
      {showCatInput ? (
        <form onSubmit={handleAddCategory} className="card">
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Kategorinavn..."
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary">Legg til</button>
            <button type="button" onClick={() => { setShowCatInput(false); setNewCat(''); }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              <X size={16} />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowCatInput(true)}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Legg til kategori
        </button>
      )}
    </div>
  );
}
