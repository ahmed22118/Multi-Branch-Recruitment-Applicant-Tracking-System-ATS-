# Project Report

## Project Title

Multi-Branch Recruitment & Applicant Tracking System (ATS)

## Introduction

This project is a professional web-based recruitment platform for a software company operating across Islamabad, Lahore, Karachi, and Remote branches. It allows candidates to apply for jobs online while HR/Admin users manage job postings, applicants, interview schedules, and email communication.

## Objectives

- Build a full-stack React and Node.js application.
- Implement REST APIs with Express.js.
- Store structured data in MongoDB Atlas.
- Use JWT authentication and role-based authorization.
- Upload resumes, cover letters, and profile images to Cloudinary.
- Send HR communication using Gmail App SMTP.
- Provide a realistic dashboard for candidates and HR/Admin users.

## Modules

### Public Career Portal

The public portal lists all open jobs and supports search/filtering by job title, department, and branch. Visitors can view complete job details before applying.

### Candidate Portal

Candidates can register, login, update profile information, upload resumes and cover letters, apply for jobs, and track application progress. Supported statuses are Submitted, Under Review, Shortlisted, Interview Scheduled, Rejected, and Selected.

### HR/Admin Portal

HR/Admin users can create jobs, view applicants, update application status, view Cloudinary-hosted resumes, schedule interviews, and send candidate email notifications.

### Branch Management

The system supports multiple branches through a dedicated Branch collection. Sample branches include Islamabad, Lahore, Karachi, and Remote.

## Database Collections

- Users
- Branches
- Jobs
- Applications
- Interviews

## Security

- Passwords are hashed with bcrypt.
- JWT tokens protect private routes.
- Role-based access control separates candidate and HR/Admin actions.
- `.env` files are ignored by Git.
- Cloudinary credentials and Gmail app password are loaded from environment variables.

## Cloudinary Integration

File uploads use Cloudinary through `multer-storage-cloudinary`. The server never stores uploaded files in a local uploads directory. MongoDB stores only returned Cloudinary URLs.

## Email Integration

The backend uses Nodemailer with Gmail App SMTP. Emails are sent when HR/Admin users shortlist, reject, select, message candidates, or schedule interviews.

## Deployment Plan

- Deploy MongoDB database on MongoDB Atlas.
- Deploy backend API on Render or Railway.
- Deploy frontend on Vercel or Netlify.
- Configure production environment variables in each deployment dashboard.

## Testing Data

The backend includes a seeder with admin, HR, candidate, branch, job, and application records.

## Conclusion

The ATS meets the required functional and technical scope for a MERN web development project and includes optional dashboard analytics counters for HR/Admin users.
