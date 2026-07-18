# My First Website - Project Showcase

## Overview
An interactive web project by **Khaled Alanjery** showcasing the integration of HTML, CSS, and JavaScript to create a dynamic visual experience with front-camera capture and wave effects.

---

## Projects

### Al-Adiliyah Mosque — Matrix / Ontology / Intensity Sphere
An interactive, real-data-only visualization of the Al-Adiliyah Mosque (Jami' al-'Adiliyya) in Aleppo, Syria: a procedural 3D model built from a CAD survey, a chronological ontology graph, a non-linear timeline spanning a real NOAA weather-station record and documented conflict events, and an "Intensity Sphere" that blends real conflict, environmental, and structural-damage intensities into a single point cloud. Every figure traces to a cited source — the Rapid Damage Assessment report, the CAD/DXF survey, NOAA GHCN station data, or Wikipedia — with no synthetic or estimated data.

→ [Open the visualization](adiliyah-mosque-matrix.html)

---

## Content Structure

### Header Section
```
Columbia GSAPP
Computational Design Practices
Project Archive
[About Link]
```

### Main Content
- **Project Meta:** 2026
- **Project Title:** My First Website
- **Subtitle:** Khaled Alanjery!
- **Interactive Section:** "Interactive Demo" with a clickable button

---

## Design & Styling

### Visual Features
- **Font Family:** Roboto (weights: 300, 400, 700) from Google Fonts
- **Background:** Dark theme with black backgrounds
- **Button:** Interactive click-based trigger with cursor pointer

### Canvas Overlay
- Full-screen HTML5 canvas (`waveCanvas`)
- Positioned fixed at top-left covering entire viewport (100vw × 100vh)
- Z-index of 9999 ensures it overlays all content
- Black background (#000)

---

## Interactive Features

### Camera Wave Effect
When the "Click Me!" button is activated, the page triggers an immersive visual experience:

**Functionality:**
1. Requests front-facing camera access from the user's device
2. Captures live video stream and displays it as horizontal stripes
3. Blank areas fill with repeating "HELLO WORLD" text pattern
4. Animated wave effect distorts the camera feed with sine-wave modulation

**Technical Details:**
- **Stripe Height:** 6 pixels per horizontal band
- **Wave Frequency:** 0.035 (sine wave pattern across vertical axis)
- **Wave Speed:** 0.0015 (smooth animation progression)
- **Jitter Effect:** ±14 pixels horizontal offset for glitch-like appearance
- **Flicker Opacity:** Random variation between 35% and 100% alpha
- **Mirror Option:** Can flip the camera feed horizontally

### Text Layer
- Pattern: "  HELLO WORLD  " repeated across canvas
- Font: Bold 42px Roboto
- Line Height: 52 pixels with alternating row offsets
- Color: White (#fff) on black background
- Creates a tiled, seamless background pattern

### Animation Loop
- Powered by `requestAnimationFrame` for 60 FPS smooth animation
- Responsive to window resize events
- Real-time updates timestamp for continuous wave modulation

---

## File Breakdown

### index.html
- Semantic HTML5 structure
- Meta charset UTF-8
- Linked Roboto font from Google Fonts
- External stylesheet and JavaScript references
- Accessibility features (lang="en" attribute)

### style.css
- Canvas element positioning and sizing
- Fixed full-viewport coverage
- Button cursor styling for better UX

### script.js
- **~140 lines** of interactive functionality
- Async camera stream initialization
- Real-time canvas rendering
- Wave and flicker animation algorithms
- Responsive canvas resizing
- Error handling for camera access failures

---

## User Experience Flow

1. **Page Load:** Static header with project metadata visible
2. **User Action:** Click "Click Me!" button
3. **Permission:** Browser requests camera access
4. **Transformation:** Full-screen immersive wave effect activates
5. **Display:** Live camera feed mixed with "HELLO WORLD" text pattern, animated with waves and flicker

---

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Background | #000 (Black) | Canvas and dark theme |
| Text | #fff (White) | "HELLO WORLD" pattern, typography |
| Primary Font | Roboto | All text elements |

---

## Technology Stack
- **HTML5** - Semantic structure
- **CSS3** - Layout and styling
- **JavaScript (ES6+)** - Camera API, Canvas 2D, Animation loops
- **WebRTC** - Camera stream capture via MediaDevices API
- **Google Fonts** - Typography

