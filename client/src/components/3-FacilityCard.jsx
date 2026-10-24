// One result card. SAMPLE placeholder numbers are never turned into tel: links -
// the call button is disabled until the owner replaces them with verified numbers.
const TYPE_LABEL = { hospital: 'Hospital', blood_bank: 'Blood Bank', pharmacy: 'Pharmacy', ambulance: 'Ambulance' };

const TYPE_ICON = {
  hospital: <path d="M12 5v14M5 12h14" />,
  blood_bank: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  pharmacy: <><rect x="4" y="9" width="16" height="6" rx="3" transform="rotate(-35 12 12)" /><path d="M9.5 8.5l5 7" /></>,
  ambulance: <><path d="M3 16V7h11v9M14 10h4l3 3v3h-7" /><circle cx="7" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" /></>,
};

function isPlaceholderPhone(phone) {
  return !phone || phone.includes('00000');
}

export default function FacilityCard({ facility }) {
  const { name, type, address, phone, distance_km, verified } = facility;
  const samplePhone = isPlaceholderPhone(phone);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <article className={`card card--${type}`}>
      <div className={`card__icon icon--${type}`} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{TYPE_ICON[type] || TYPE_ICON.hospital}</svg>
      </div>
      <div className="card__body">
      <div className="card__top">
        <h3 className="card__name">{name}</h3>
        {name.startsWith('SAMPLE') && <span className="tag tag--sample">sample data</span>}
      </div>
      <p className="card__meta">
        <span className={`tag tag--${type}`}>{TYPE_LABEL[type] || type}</span>
        {verified && <span className="tag tag--verified">✓ Verified</span>}
        {typeof distance_km === 'number' && <span className="card__distance">{distance_km.toFixed(1)} km away</span>}
      </p>
      <p className="card__address">{address}</p>
      <div className="card__actions">
        {samplePhone ? (
          <button className="btn btn--call" disabled title="Sample placeholder - the owner will replace it with a verified number">
            Call (sample number)
          </button>
        ) : (
          <a className="btn btn--call" href={`tel:${phone}`}>Call {phone}</a>
        )}
        <a className="btn btn--directions" href={directionsUrl} target="_blank" rel="noreferrer">Directions</a>
      </div>
      </div>
    </article>
  );
}
