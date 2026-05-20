# Multi-Branch Recruitment & Applicant Tracking System

A MERN stack Recruitment and Applicant Tracking System (ATS) for a software company with multiple branches. Candidates can register, upload Cloudinary-hosted resumes and cover letters, apply to jobs, and track application status. HR/Admin users can manage jobs, applicants, interviews, and email communication.

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- File Storage: Cloudinary
- Email: Gmail App SMTP
- Auth: JWT with role-based access control

## Project Structure

```text
backend/     Express API, MongoDB models, auth, uploads, email, seed data
frontend/    React app with public, candidate, and admin portals
docs/        API documentation, ER diagram, project report
```

## Setup

1. Install Node.js LTS.
2. Configure backend environment:

```bash
cd backend
cp .env.example .env
npm install --legacy-peer-deps
npm run seed
npm start
```

3. Configure frontend environment:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Required Environment Variables

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ats_db
JWT_SECRET=replace-with-a-long-secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
https://multi-branch-recruitment-applicant-one.vercel.app/
```

## Demo Accounts After Seeding

- Admin: `admin@softbranch.com` / `Admin@12345`
- HR: `hr@softbranch.com` / `Hr@12345`
- Candidate: `candidate@example.com` / `Candidate@12345`

## Deployment

- Backend: Render, Railway, or Vercel serverless
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas M0 cluster
- Files: Cloudinary

Add the live deployment URL here before submission:

- Frontend URL: `https://multi-branch-recruitment-applicant-one.vercel.app/`
- Backend URL: `https://multi-branch-recruitment-applicant-v42a.onrender.com`

## Deliverables Included

- Complete source code
- Sample data seeder
- API documentation: `docs/API.md`
- ER diagram: `docs/ER_DIAGRAM.md`
- Project report: `docs/PROJECT_REPORT.md`
