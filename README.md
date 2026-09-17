# Prime Industries — 3D Interactive Website

React + Three.js + Tailwind CSS website for Prime Industries (sheet metal
fabrication, CNC machine spares/tools, laser machine equipment).

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                assembles all sections
  index.css              Tailwind + design tokens/custom CSS
  components/
    Nav.jsx
    Hero.jsx              hero + interactive 3D scene (drag to rotate, scroll to zoom)
    About.jsx
    Services.jsx           tab-driven 3D scene (sheet metal / CNC / laser)
    Products.jsx            catalog cards, each with its own small 3D viewer
    Contact.jsx              validated enquiry form + workshop details
    Footer.jsx
  utils/
    three-helpers.js         shared Three.js setup (renderer, resize, orbit controls, materials)
```

## Notes

- The contact form is client-side only — there's no backend wired up, so
  submitting shows a confirmation message but doesn't send anywhere yet.
  Wire `handleSubmit` in `Contact.jsx` up to your email/API service of choice.
- The address, phone number and email in `Contact.jsx` are placeholders
  (`[City]`, `[phone number]`, etc.) — replace them with the real details.
- All 3D scenes are built with plain `three` (no `@react-three/fiber`), using
  refs + `useEffect` so Three.js manages its own render loop outside React's
  render cycle. Camera controls in the hero are a small custom
  drag-to-rotate / scroll-to-zoom implementation in `three-helpers.js` rather
  than `OrbitControls`, to keep the dependency footprint minimal.
# prime-industries-app
# prime-industries-app
