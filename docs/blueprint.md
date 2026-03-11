# **App Name**: Bimmer CR

## Core Features:

- Product Catalog & Search: Browse and search for BMW original and aftermarket parts via a responsive grid with advanced filtering by category, model, price, and condition, leading to detailed product pages.
- Shopping Cart & Checkout: Manage selected parts in a persistent shopping cart and proceed through a multi-step checkout process, including personal information, delivery options, payment methods, and order summary. This interacts with the 'pedidos' Firestore collection.
- Used Vehicle Listings & Search: Explore available used BMW vehicles through a dedicated, responsive listing grid, with specific filters for model, year, mileage, and features, and detailed vehicle information pages.
- Inspection Appointment Scheduling: Schedule a vehicle inspection appointment directly from the detailed vehicle page via a form, allowing selection of preferred date/time. This creates entries in the 'citas' Firestore collection.
- Dynamic Data Management for Products & Vehicles: Backend infrastructure to store, retrieve, and update product and vehicle details, including images, specifications, compatibility lists, and historical data, utilizing the 'repuestos' and 'vehiculos' Firestore collections.
- Optimized & Responsive User Interface: A fully responsive design for seamless browsing on mobile, tablet, and desktop, incorporating lazy loading for images, real-time search/filtering, and intuitive visual feedback for all user interactions.

## Style Guidelines:

- Dark theme for a premium, M-inspired aesthetic. Primary action color is BMW M Blue (#1C69D4) for interactive elements and branding. Background is a very dark, cool gray (#111415) to ensure high contrast and a sleek feel. Accent color is BMW M Red (#E41E26) for highlights and alerts. Secondary elements use BMW M Dark Purple (#6C1D45).Extra elements with BMW M white.
- Font for both headlines and body text: 'Inter', a clean, professional sans-serif known for its legibility and modern, objective aesthetic, aligning with precision and contemporary design.
- Use a consistent set of minimalist, line-based icons to maintain a clean and uncluttered look. Icons should be clear and professional, avoiding any playful or overly decorative styles, adhering to the premium design language.
- A spacious layout featuring ample whitespace to emphasize product and vehicle imagery and information. Responsive grid layouts are crucial, adapting dynamically from single-column mobile views to multi-column desktop views (e.g., 2-6 columns for parts, 1-3 for vehicles) while maintaining consistent spacing.
- Subtle and fluid animations should be applied for navigation transitions, state changes (e.g., add-to-cart, filter application), and image loading (lazy load transitions) to enhance the premium and responsive feel without distracting the user.