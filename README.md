# 🌊 Marine Analytica - Autonomous Stock Assessment AI

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)

## 📌 Overview
Marine Analytica is a production-ready, autonomous stock assessment platform powered by AI. Designed to merge complex marine biology with enterprise software, it enables researchers and commercial operators to analyze length-weight relationships, compute mortality rates, track spatial ecosystems, and automate complex policy reports seamlessly. 

## ⚙️ Core Features & Tech Stack
- **Framework:** Next.js App Router for edge-optimized React server components.
- **Authentication:** Better-Auth integrated via a direct PostgreSQL connection pool.
- **Database:** Supabase PostgreSQL (utilizing the transaction pooler on port 6543 for strict SSL connectivity).
- **Storage:** Hybrid Architecture utilizing Cloudinary for high-res micrograph storage to preserve database bandwidth.
- **Security:** Ironclad edge Route Protection via Next.js Middleware ensuring unauthorized sessions are instantly intercepted.

## 🧠 The AI Core ("Project Jervis")
Marine Analytica features **Jervis**, a highly intelligent, natural, and conversational AI thought partner. Jervis utilizes advanced dynamic intent recognition to seamlessly transition between acting as an expert data analyst—providing precise, high-level marine science insights—and a thoughtful, witty conversationalist. Jervis operates as a knowledgeable peer rather than a standard robotic chatbot, ensuring all interactions are fluid, human-like, and highly productive.

## 📦 The 8 Core Modules

1. **AI Vision (`ai-vision`)**
   Handles smart data collection via camera integration, performing real-time biometric extraction and ensuring offline persistence through IndexedDB.

2. **Core Analysis (`analysis`)**
   The foundational mathematics engine managing Length-Weight Relationships (LWR), biomass calculations, and advanced scatter plot modeling.

3. **Elefan Analytics (`elefan`)**
   Provides advanced Length-Frequency (LF) modeling and generates comprehensive, data-driven stock status reports (LB-SPR).

4. **Ecosystem Digital Twin (`ecosystem`)**
   Powers spatial modeling, real-time 3D estuarine tracking, environmental parameter mapping (e.g., blue carbon), and eDNA biodiversity tracking.

5. **Autonomous Scientist (`scientist`)**
   Utilizes deep-sea neural nets (incorporating drone and gear vision) to analyze gear efficiency and isolate target species from critical bycatch.

6. **Automation (`automation`)**
   Automates the generation of complex Socio-Ecological Environmental Impact Assessments (EIAs) and policy reports using integrated LLM synthesis.

7. **Commercial / DaaS (`commercial`)**
   Acts as the enterprise data gateway, transforming raw ecological metrics into secure, consumable open APIs (Data-as-a-Service).

8. **Marketplace (`marketplace`)**
   Functions as a robust B2B exchange platform designed to bridge raw, verified scientific data with sustainable commercial operations.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory and configure the following required variables:
   ```env
   # Database (Supabase PostgreSQL - ensure port is 6543 for the pooler)
   DATABASE_URL="postgres://postgres.xxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   
   # Better-Auth
   BETTER_AUTH_SECRET="your_secret_key"
   BETTER_AUTH_URL="http://localhost:3000"

   # Cloudinary (Storage)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

3. **Database Migration**
   Generate the required authentication and schema tables directly in Supabase using the Better-Auth CLI:
   ```bash
   npx @better-auth/cli migrate
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---
---

## 👨‍💻 Developed By

**Mehedi Islam**  
*Institute of Marine Sciences, University of Chittagong*  

Passionate about merging marine biology research with modern web development and AI automation to build next-generation autonomous tools for oceanography.

- 🌐 **Portfolio:** mehedi-islam.vercel.app
- 🐙 **GitHub:** [Your GitHub URL]
- 📧 **Email:** mehediislam0173@gmail.com

---
<div align="center">
  <i>Developed for next-generation marine research and autonomous data analysis.</i>
</div>
