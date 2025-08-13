# Project Nexus
# Table Top – Dynamic E-Commerce Product Catalog PWA

**Project Overview**  
Table Top is a dynamic, responsive, and performant e-commerce product catalog built as a Progressive Web App (PWA) using **Next.js**, **TypeScript**,Axios and **Tailwind CSS**. This project simulates a real-world scenario where developers must balance functional requirements with user experience considerations, providing hands-on experience in building scalable and maintainable frontends.

---

## **Real-World Application**
This project demonstrates how to create a modern e-commerce experience that:  

- Builds scalable and maintainable frontends with modern technologies.  
- Optimizes performance for high-traffic scenarios with pagination and infinite scrolling.  
- Ensures accessibility and responsiveness for diverse user bases.  
- Implements PWA features for offline support and native-app-like behavior.

---

## **Project Goals**
The primary objectives of the Table Top product catalog are:  

- **API Integration:** Dynamically fetch and display products from a backend API.  
- **User Convenience:** Implement filtering, sorting, and search to improve product discovery.  
- **Enhanced Experience:** Build a responsive, user-friendly interface with seamless navigation and optimized performance.  

---

## **Technologies Used**
- **Next.js:** Framework for server-side rendering and static site generation.  
- **React/TypeScript:** Component-based UI development with type safety.  
- **Tailwind CSS:** Utility-first CSS framework for responsive and modern designs.  
- **Axios (optional):** State management for cart and product filters.  
- **next-pwa:** Adds Progressive Web App capabilities, including offline support.

---

## **Key Features**
### 1. API Data Integration
- Fetch products dynamically from a backend API.  
- Includes loading states and error handling for smooth user experience.  

### 2. Filtering and Sorting
- **Category Filtering:** Users can browse products by selected categories.  
- **Price Sorting:** Sort products in ascending or descending order.  
- **Multi-Criteria Filters:** Combine multiple filters for precise results.  

### 3. Pagination and Infinite Scrolling
- **Pagination:** Navigate products in chunks using numbered pages.  
- **Infinite Scrolling:** Automatically load more products as users scroll for seamless browsing.  

### 4. Responsive Design
- Fully responsive across desktops, tablets, and mobile devices.  
- Ensures accessibility and usability across different screen sizes.  

### 5. Key Features
1. **API Data Integration**
   - Fetch products dynamically from fakestore API
   - Handle loading and error states gracefully.
2. **Filtering and Sorting**
   - Category-based filtering.
   - Price sorting (ascending/descending).
   - Multi-criteria filters for refined results.
3. **Pagination and Infinite Scrolling**
   - Paginated navigation for large datasets.
   - Infinite scroll for a seamless browsing experience.
4. **Responsive Design**
   - Fully responsive across desktop, tablet, and mobile devices.
5. **Progressive Web App (PWA)**
   - Offline access and app-like behavior.
   - Optimized for performance and speed

---
## Project structure
tabletop/
├── components/             # Reusable UI components (buttons, cards, modals, etc.)
├── pages/                  # Next.js pages (index.tsx, products.tsx, _app.tsx, _document.tsx)
├── public/                 # Static assets and PWA icons (favicon, images, manifest.json)
├── styles/                 # Global CSS, Tailwind CSS files (globals.css, tailwind.css)
├── types/                  # TypeScript types and interfaces (Product.ts, Cart.ts, etc.)
├── services/               # API integrations, mock data, utility functions
├── .eslintrc.js            # ESLint configuration
├── next-env.d.ts           # Next.js TypeScript environment declarations
├── next.config.js          # Next.js configuration (with PWA setup)
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuratio for Tailwind
├── public/manifest.json    # PWA manifest
└── README.md               # Project documentation

``````
## **Installation & Setup**
Installation & Setup
Clone the repository:

*bash
Copy
Edit
git clone https://github.com/peter-adjao/alx-project-nexus1.git
Navigate to the project directory:

*bash
Copy
Edit
cd tabletop
Install dependencies:

*bash
Copy
Edit
npm install
# or
yarn install
Start the development server:

*bash
Copy
Edit
npm run dev
# or
yarn dev
Open http://localhost:3000 to view the app in your browser.
`````````
Future Enhancements
Implement push notifications for new products and promotions.

Add user authentication and profile management.

Introduce product recommendations and personalized filters.

Enhance UI/UX with animations, micro-interactions, and advanced features.

``````````
## License
This project is licensed under the MIT License. See the LICENSE file for details.









