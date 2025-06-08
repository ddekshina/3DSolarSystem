# 3DSolarSystem

## Introduction

This project implements a web-based 3D solar system visualization or simulation. It allows users to explore a 3D model of the solar system, with interactive features like theme toggling, animation controls, camera controls and planet information.

## Features

*   **3D Solar System Visualization:** Renders a 3D model of the solar system, including the sun, planets, and background stars.
*   **Theme Switching:** Allows switching between dark and light themes.
*   **Animation Control:** Provides controls to pause/resume the animation and adjust the global animation speed.
*   **Individual Planet Controls:** Provides planet speed controls (likely sliders).
*   **Mouse Interaction:** Enables camera controls (rotation, pan, and zoom) via mouse interaction.
*   **Tooltip for Planet Information:** Displays planet information.
*   **Touch Interaction:** Implements touch controls for mobile devices.
*   **UI Controls:** Includes a control panel with sliders and buttons.

## How It Works (Implementation Overview)

The core functionality relies on a combination of HTML, CSS, and JavaScript.

*   **HTML (`index.html`):** Defines the structure of the web page, including the 3D canvas, user controls (buttons, sliders), and information display.  It loads external CSS and JavaScript files.
*   **CSS (`src/style.css`):** Provides styling for the page's elements, including theming (light and dark modes), layout, control panel styling, tooltip styling, and scrollbar customization.
*   **JavaScript (`src/main.js`):** This core file handles the 3D rendering logic (using THREE.js), scene setup (sun, planets, stars), animation, camera controls, UI control handling (theme toggle, speed controls, pausing), and user interaction.  It also handles the creation and update of tooltips.
*   **Animation:** The `animate()` function, driven by `requestAnimationFrame`, continuously updates the 3D scene to simulate planet movement and other visual effects.
*   **Interaction:**  Event listeners handle user interactions such as mouse clicks, mouse movements, and touch events to control the camera and UI elements.

## Tech Stack

*   **Languages:** HTML, CSS, JavaScript.
*   **Libraries/Frameworks:**
    *   THREE.js (for 3D graphics rendering).
    *   Vite (build tool).
*   **Tools:**
    *   npm (Node Package Manager)
    *   esbuild
    *   PostCSS
    *   rollup
    *   VS Code (implied by `.vscode` in `.gitignore`)

## Getting Started (optional)

1.  **Project Setup:**  Uses npm to install dependencies via `npm install`.
2.  **Development:**  `npm run dev` to start a development server.

## Conclusion

The 3DSolarSystem project provides an interactive 3D visualization of our solar system.  The project features core 3D rendering capabilities.  The project offers a customizable and engaging experience for users to explore and interact with the solar system.
```