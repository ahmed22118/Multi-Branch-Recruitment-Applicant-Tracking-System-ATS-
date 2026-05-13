# ER Diagram

```mermaid
erDiagram
  USERS {
    ObjectId _id PK
    string name
    string email
    string password
    string role
    string phone
    ObjectId branch FK
    string[] skills
    string experience
    string education
    string profileImageUrl
    string resumeUrl
    string coverLetterUrl
  }

  BRANCHES {
    ObjectId _id PK
    string name
    string city
    string address
    boolean isRemote
  }

  JOBS {
    ObjectId _id PK
    string title
    string department
    ObjectId branch FK
    string type
    number seats
    string description
    string[] requirements
    string status
    ObjectId createdBy FK
  }

  APPLICATIONS {
    ObjectId _id PK
    ObjectId job FK
    ObjectId candidate FK
    string resumeUrl
    string coverLetterUrl
    string message
    string status
  }

  INTERVIEWS {
    ObjectId _id PK
    ObjectId application FK
    ObjectId scheduledBy FK
    date dateTime
    string location
    string message
  }

  BRANCHES ||--o{ USERS : assigned_to
  BRANCHES ||--o{ JOBS : hosts
  USERS ||--o{ JOBS : creates
  USERS ||--o{ APPLICATIONS : submits
  JOBS ||--o{ APPLICATIONS : receives
  APPLICATIONS ||--o{ INTERVIEWS : schedules
  USERS ||--o{ INTERVIEWS : schedules
```

## Relationship Notes

- One branch can have many jobs and HR/admin users.
- One candidate can submit many applications.
- Each application belongs to exactly one job and one candidate.
- Each interview belongs to an application and is scheduled by an HR/admin user.
- Cloudinary stores files externally; MongoDB stores only the file URLs.
