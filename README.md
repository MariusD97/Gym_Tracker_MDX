# Gym Tracker

Aplicație personală de evidență a antrenamentelor — React + Vite, dark mode, stil iOS, PWA (Add to Home Screen).

## Rulare locală
```
npm install
npm run dev
```

## Build de producție
```
npm run build
```
Fișierele generate apar în `dist/`.

## Deploy
Cel mai simplu: importă acest repo direct în Vercel (New Project → Import Git Repository). Vercel detectează automat Vite și face build/deploy la fiecare push pe branch-ul principal.

## Stocare date
Toate datele (antrenamente, exerciții, planuri, greutate corporală) se salvează în `localStorage`, local pe dispozitiv — nu există server/bază de date.

## Structură
- `src/App.jsx` — toată logica și UI-ul aplicației (single-file, pe secțiuni comentate)
- `public/` — iconițe și manifest PWA
