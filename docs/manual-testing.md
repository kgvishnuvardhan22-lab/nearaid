# NearAid manual test checklist

Run these after `npm run seed`, with both servers up (`npm run dev` in server/
and client/). Check each box in order.

## Public site
- [ ] Home page loads on a phone-width browser: big "Find help near me" button,
      5 category chips, white-and-blue theme.
- [ ] Tap "Find help near me" and ALLOW location: result cards appear, ordered
      by distance, each with name, type, address, distance, "sample data" tag,
      and a verified badge.
- [ ] SAMPLE listings show a disabled "Call (sample number)" button - confirm
      it is NOT a tel: link. Directions opens Google Maps.
- [ ] Deny/block location permission: a clear message appears and the manual
      latitude/longitude form shows. Enter 13.0827 / 80.2707 -> results load.
- [ ] Open http://localhost:5173/?lat=13.05&lng=80.24 -> results load without
      any clicks (deep link).
- [ ] Tap each category chip: only that type is listed (e.g. Blood Bank shows
      only blood banks).
- [ ] Choose a far-away location (e.g. lat 10.0, lng 78.0): the empty state
      message appears.
- [ ] Stop the API server and tap "Find help near me" again: an error message
      appears and the last results stay visible from the offline cache.
- [ ] Open "Suggest a facility", submit a complete form -> success message
      "it will appear after admin review". (Requires the database running.)
- [ ] Submit the form with a 1-letter name -> validation error, nothing saved.

## Admin panel
- [ ] /admin/login with the seeded admin email/password -> lands on /admin.
- [ ] Wrong password -> "Invalid email or password" (same message for a wrong
      email - no hint which one failed).
- [ ] Open /api/admin/pending in a new tab without a token -> 401.
- [ ] Pending tab shows the suggestion submitted above.
- [ ] Approve it -> it disappears from Pending and appears in Verified.
- [ ] Back on the public site, search near its location -> it appears with a
      verified badge.
- [ ] Edit it (change the name) -> name updates everywhere.
- [ ] Reject it from Pending (or Remove from Verified) -> it no longer appears
      in public search.

## API spot checks
- [ ] curl "http://localhost:5000/api/health" -> {"status":"ok","mode":"postgis"}
- [ ] curl "http://localhost:5000/api/facilities/nearby?lat=999&lng=80" -> 400
- [ ] 11 rapid wrong-password logins -> the 11th is rate-limited (429).
