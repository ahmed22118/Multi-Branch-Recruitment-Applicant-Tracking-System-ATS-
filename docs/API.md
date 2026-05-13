# API Documentation

Base URL: `/api`

Authentication uses JWT Bearer tokens.

```http
Authorization: Bearer <token>
```

## Auth

### Register Candidate

`POST /auth/register`

```json
{
  "name": "Ali Candidate",
  "email": "candidate@example.com",
  "password": "Candidate@12345"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "admin@softbranch.com",
  "password": "Admin@12345"
}
```

### Current User

`GET /auth/me`

Roles: candidate, hr, admin

### Update Profile

`PUT /auth/profile`

Content type: `multipart/form-data`

Fields: `name`, `phone`, `skills`, `experience`, `education`, `profileImage`, `resume`, `coverLetter`

Files are uploaded to Cloudinary and only returned URLs are stored in MongoDB.

## Branches

### List Branches

`GET /branches`

### Create Branch

`POST /branches`

Roles: hr, admin

```json
{
  "name": "Islamabad",
  "city": "Islamabad",
  "address": "Blue Area",
  "isRemote": false
}
```

### Update Branch

`PUT /branches/:id`

Roles: hr, admin

### Delete Branch

`DELETE /branches/:id`

Roles: admin

## Jobs

### List Jobs

`GET /jobs?search=react&department=Engineering&branch=<branchId>&status=open`

Public endpoint.

### Job Details

`GET /jobs/:id`

Public endpoint.

### Create Job

`POST /jobs`

Roles: hr, admin

```json
{
  "title": "Frontend React Developer",
  "department": "Engineering",
  "branch": "<branchId>",
  "type": "Full Time",
  "seats": 3,
  "description": "Build React dashboards.",
  "requirements": ["React", "REST APIs"]
}
```

### Update Job

`PUT /jobs/:id`

Roles: hr, admin

### Delete Job

`DELETE /jobs/:id`

Roles: admin

## Applications

### Apply For Job

`POST /applications/jobs/:jobId`

Role: candidate

Content type: `multipart/form-data`

Fields: `resume`, `message`

### Candidate Applications

`GET /applications/mine`

Role: candidate

### List Applications

`GET /applications?status=Shortlisted&job=<jobId>`

Roles: hr, admin

### Update Application Status

`PATCH /applications/:id/status`

Roles: hr, admin

```json
{
  "status": "Shortlisted",
  "message": "Please wait for interview details."
}
```

Supported statuses:

- Submitted
- Under Review
- Shortlisted
- Interview Scheduled
- Rejected
- Selected

### Send Custom HR Message

`POST /applications/:id/message`

Roles: hr, admin

```json
{
  "subject": "Portfolio request",
  "message": "Please share your portfolio link."
}
```

## Interviews

### List Interviews

`GET /interviews`

Roles: hr, admin

### Schedule Interview

`POST /interviews`

Roles: hr, admin

```json
{
  "application": "<applicationId>",
  "dateTime": "2026-06-01T10:00:00.000Z",
  "location": "Google Meet",
  "message": "Please join five minutes early."
}
```

Scheduling an interview automatically changes the application status to `Interview Scheduled` and sends an email invitation through Gmail SMTP.
