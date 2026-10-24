const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'blood_bank', label: 'Blood Bank' },
  { key: 'pharmacy', label: 'Pharmacy' },
  { key: 'ambulance', label: 'Ambulance' },
];

export default function CategoryChips({ value, onChange }) {
  return (
    <div className="chips" role="tablist" aria-label="Facility category">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          role="tab"
          aria-selected={value === c.key}
          className={`chip ${value === c.key ? 'chip--active' : ''}`}
          onClick={() => onChange(c.key)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
