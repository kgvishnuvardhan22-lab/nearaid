// One result card. SAMPLE placeholder numbers are never turned into tel: links -
// the call button is disabled until the owner replaces them with verified numbers.
const TYPE_LABEL = { hospital: 'Hospital', blood_bank: 'Blood Bank', pharmacy: 'Pharmacy', ambulance: 'Ambulance' };


export default function FacilityCard({ facility }) {
  const { name, type, address, phone, distance_km, verified } = facility;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <article className="card">
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
                  <a className="btn btn--call" href={`tel:${phone}`}>Call {phone}</a>
        <a className="btn btn--directions" href={directionsUrl} target="_blank" rel="noreferrer">Directions</a>
      </div>
    </article>
  );
}
