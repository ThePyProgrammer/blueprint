# Design System Specification: The Tactical Architecture Governance Framework

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Architect’s HUD"**

This design system moves away from the static, "boxy" nature of traditional enterprise software. Instead, it draws inspiration from high-end Integrated Development Environments (IDEs) and tactical military command interfaces. The goal is to make complex architecture governance feel like navigating a high-fidelity simulation.

We achieve this through **Organic Technicality**: a blend of rigid geometric precision and ethereal, glowing depth. We break the "template" look by using intentional asymmetry—such as terminal-style sidebars that feel docked rather than floating—and high-contrast typography that treats data as the hero of the composition.

---

## 2. Colors & Atmospheric Depth
The palette is rooted in a "Deep Obsidian" void, using light not just as a highlight, but as a functional signifier of system health and architectural debt.

### Core Palette Application
*   **Background (`#0B0E14`):** The absolute foundation. All UI elements emerge from this darkness.
*   **Primary (`#8FF5FF` / `primary`):** Used for active states and critical path navigation.
*   **Secondary/Teal (`#8DEDEC`):** Used for secondary data visualizations and supportive UI elements.
*   **Tertiary/Neon Orange (`#FFB155`):** Reserved exclusively for **Architectural Debt** and high-priority warnings.
*   **Error (`#FF716C`):** Used for system failures or critical governance violations.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. To define boundaries, use:
1.  **Background Shifts:** Transition from `surface` to `surface_container_low` (`#10131A`).
2.  **Tonal Transitions:** Use `surface_bright` (`#282C36`) for header bars to create a sense of "docked" hardware.

### The "Glass & Glow" Rule
To achieve the "Command Center" aesthetic, floating panels must use **Glassmorphism**:
*   **Fill:** `surface_container_high` (`#1C2028`) at 60-80% opacity.
*   **Backdrop Blur:** Minimum `12px` to `20px`.
*   **Inner Glow:** Instead of an outer border, use a 1px inner stroke using `outline_variant` at 15% opacity to catch the "light" of the data behind it.

---

## 3. Typography: The Data-First Hierarchy
We utilize a dual-font strategy to distinguish between "Interface" (navigation) and "Intelligence" (governance data).

*   **Display & Headlines (Space Grotesk):** These are your "HUD Headers." Use `display-md` for high-level dashboard metrics. The wide aperture of Space Grotesk feels engineered and futuristic.
*   **Body & Titles (Inter):** Used for legibility in complex documentation and governance logs. `body-md` is the workhorse for all descriptions.
*   **Labels & Data (JetBrains Mono/Fira Code):** Any technical value, architecture node ID, or code snippet must use a Mono font. This signals to the user that the information is "raw" and "executable."

---

## 4. Elevation & Tonal Layering
In a dark HUD, shadows don't work the same way they do in light mode. We use **Luminance Layering** to create depth.

*   **The Layering Principle:** 
    *   **Level 0 (Base):** `surface` (#0B0E14) with a subtle grid pattern overlay.
    *   **Level 1 (Sections):** `surface_container_low` (#10131A).
    *   **Level 2 (Active Cards):** `surface_container_highest` (#22262F).
*   **Ambient Shadows:** When a modal or pop-over is required, use a shadow with a blur of `40px`, colored with a 10% opacity version of `primary` (#8FF5FF). This creates a "glow" rather than a "shadow," suggesting the element is projected.
*   **The Ghost Border:** For high-density data tables where separation is critical, use `outline_variant` at **10% opacity**. It should be felt, not seen.

---

## 5. Signature Components

### Glowing Status Indicators
Status is conveyed through "Pulse" elements. A healthy node isn't just a green dot; it's a soft emerald (`secondary`) circle with a `4px` outer glow. A debt-heavy node uses `tertiary` (#FFB155) with a sharper, more aggressive glow.

### Terminal Sidebars
Sidebars should not have right-side borders. Use `surface_container_low` and ensure the text is `label-sm` or `label-md` in Mono. Use `primary_container` for the active indicator—a vertical 2px line on the far left of the active menu item.

### Segmented Control Tabs
Avoid rounded pills. Use the `md` (0.375rem) roundedness scale. Active tabs should use a `primary` subtle gradient fill (from `primary` to `primary_dim`) with `on_primary_fixed` text for maximum "lit-up" contrast.

### Interactive Node Graphs
Nodes are the heart of this system.
*   **Connecting Lines:** Use `outline_variant` at 30% opacity.
*   **Flow Direction:** Use animated "marching ants" or gradient flows in `secondary` to indicate data direction.
*   **Container:** Nodes should use `surface_container_highest` with a `0.25rem` radius.

### Input Fields
*   **Resting:** Background `surface_container_lowest`, no border, `body-md` text.
*   **Focus:** 1px inner glow of `primary` and a subtle `0 0 8px` outer glow. The label should shift to `label-sm` in JetBrains Mono.

---

## 6. Do's and Don'ts

### Do
*   **Do** use the Spacing Scale religiously. Consistent `0.9rem` (4) and `1.3rem` (6) gaps create the "technical grid" feel.
*   **Do** use `primary_container` gradients for CTAs to make them feel like "Active Buttons" in a cockpit.
*   **Do** embrace asymmetry. A sidebar can be narrower than a standard 240px if the data requires it.

### Don't
*   **Don't** use pure white (#FFFFFF). Always use `on_surface` (#ECEDF6) to prevent eye strain in the dark environment.
*   **Don't** use standard dividers. If you feel the need to separate two sections, increase the vertical spacing to `8` (1.75rem) or shift the background tone.
*   **Don't** use large corner radii. Stick to `sm` (0.125rem) and `md` (0.375rem) to maintain the precision-engineered aesthetic. `full` is only for status pips.