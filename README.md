# LegalEase(NyayaSetu)
**Digital Legal Aid Platform — Democratizing access to justice**

[![Status](https://img.shields.io/badge/status-startup%20ready-brightgreen)](https://github.com/)
[![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20Flutter-blue)](https://github.com/)

> A startup-grade legal-tech product that connects citizens with verified lawyers, automates case matching, and provides multilingual, AI-assisted legal guidance with secure, real-time communication.

---
## Short Glimpse
---
<p align="center">
<img width="700" height="400" alt="Image" src="https://github.com/user-attachments/assets/5514c169-6a1a-4e2d-b88a-ec77d68bf731" />
</p>

---

## 🚀 Quick highlights
- **Built for scale** — production-aware architecture and cloud-ready components  
- **Smart matching** — weighted algorithm pairs clients with best-fit lawyers  
- **Secure real-time chat** — Twilio-backed encrypted communication channels  
- **AI assistant** — Gemini + Groq for triage & knowledge support  
- **Cross-platform** — React web app + Flutter mobile app + Node.js backend

---

## ✨ Core Features
- **Case Submission** — multilingual form, document upload, jurisdiction + category fields  
- **Lawyer–Client Matching** — expertise, jurisdiction, availability, load balancing, language support  
- **Real-time Chat** — Twilio tokens for secure sessions; extensible to voice/video  
- **Role Dashboards** — Client, Lawyer, Admin with role-based access control  
- **Document Management** — secure AWS S3 storage with access control and auditing  
- **AI Assistant** — automated triage, FAQ answers, and case categorization  
- **Analytics Dashboard** — case resolution, lawyer load, user metrics

---

## 🏗 Architecture & Tech Stack

### Frontend
- React.js, Vite  
- Tailwind CSS / Material UI

### Mobile
- Flutter (iOS & Android)

### Backend
- Node.js, Express.js  
- MongoDB (Mongoose)  
- JWT, bcrypt, Google OAuth  
- Twilio (Chat/Voice)  
- Gemini API, Groq API  
- AWS S3 for file storage

### DevOps
- MongoDB Atlas  
- Vercel (frontend)  
- Render / AWS (backend)  
- CI/CD ready

---

## 📂 folder structure
---
```
LegalEase/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── services/
│ │ ├── matching/
│ │ ├── twilio/
│ │ └── ai/
│ ├── config/
│ └── server.js
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.jsx
├── mobile_app/
│ └── lib/
├── scripts/
├── .env.example
└── README.md
```
---

## 🔄 Key workflows

### Case submission → match → assign → chat
1. Client submits case (forms + documents)  
2. Backend validates JWT and stores case in MongoDB  
3. Matching service computes weighted scores and selects best-fit lawyer  
4. System assigns case and generates Twilio token(s)  
5. Encrypted chat session opens; lawyer accepts and consults

### Offline asset pipeline
- Lawyer verification (documents & admin approval)  
- Profile activation and availability publishing

---

## 🛡 Security & compliance
- Password hashing with **bcrypt**  
- Authentication via **JWT**  
- Document encryption and secure storage on **AWS S3**  
- Follow **OWASP** recommendations and ISO-aligned best practices for sensitive data handling

---

## 📈 Sample impact metrics (customize)
- **~40%** reduction in case processing time (pilot)  
- **30–50%** reduction in basic query load via AI assistant  
- Increased lawyer onboarding efficiency with verified profiles

---

## 🛠 Developer quick-start

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
---
## Frontend
```
cd frontend
npm install
npm run dev
```
---
## 🔧 Environment variables Example
```
MONGO_URI=
JWT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_API_KEY_SID=
TWILIO_API_KEY_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
GEMINI_API_KEY=
GROQ_API_KEY=
GOOGLE_CLIENT_ID=
```
---
## 🛣 Roadmap (startup milestones)
---
- Harden backend for multi-tenant scaling & monitoring
- Advanced generative AI for document drafting & templates
- Voice + OCR + offline submission support for low-bandwidth regions
- Court e-filing and government/NGO pilot integrations
- Monetization: premium listings, enterprise deployments, & public sector contracts
---
## 💻 Developer
---
## Ayushmaan Kumar Yadav — Lead Developer & Product Owner<br>
- 👨‍💻 MERN Developer | GenAI | Cloud Architect<br>
- 🔗 [LinkedIn](https://www.linkedin.com/in/ayushmaan-yadav-152b141b1)


