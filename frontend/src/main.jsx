import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Briefcase, Building2, CalendarDays, Check, LogOut, Search, Send, UserRound } from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AuthContext = createContext(null);
const statuses = ["Submitted", "Under Review", "Shortlisted", "Interview Scheduled", "Rejected", "Selected"];

async function api(path, options = {}) {
  const token = localStorage.getItem("ats_token");
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("ats_user") || "null"));
  const value = useMemo(
    () => ({
      user,
      login(data) {
        localStorage.setItem("ats_token", data.token);
        localStorage.setItem("ats_user", JSON.stringify(data.user));
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("ats_token");
        localStorage.removeItem("ats_user");
        setUser(null);
      }
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="topbar">
        <Link to="/" className="brand"><Briefcase size={22} /> SoftBranch ATS</Link>
        <div className="navlinks">
          <Link to="/">Jobs</Link>
          {user?.role === "candidate" && <Link to="/candidate">Candidate</Link>}
          {(user?.role === "hr" || user?.role === "admin") && <Link to="/admin">HR/Admin</Link>}
          {!user ? <Link to="/login">Login</Link> : <button className="ghost" onClick={logout}><LogOut size={16} /> Logout</button>}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/candidate" element={<Protected roles={["candidate"]}><CandidateDashboard /></Protected>} />
          <Route path="/admin" element={<Protected roles={["hr", "admin"]}><AdminDashboard /></Protected>} />
        </Routes>
      </main>
    </>
  );
}

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({ search: "", department: "", branch: "" });

  useEffect(() => {
    api("/branches").then(setBranches);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api(`/jobs?${params}`).then(setJobs);
  }, [filters]);

  return (
    <section className="page">
      <div className="headline">
        <div>
          <p className="eyebrow">Public Career Portal</p>
          <h1>Open roles across Islamabad, Lahore, Karachi, and Remote teams</h1>
        </div>
        <div className="filters">
          <label><Search size={16} /><input placeholder="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
          <input placeholder="Department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
          <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })}>
            <option value="">All branches</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid">
        {jobs.map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </section>
  );
}

function JobCard({ job }) {
  return (
    <article className="card">
      <div className="row between">
        <span className="pill">{job.department}</span>
        <span>{job.type}</span>
      </div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <div className="meta"><Building2 size={16} /> {job.branch?.name} · {job.seats} seats</div>
      <Link className="button" to={`/jobs/${job._id}`}>View details</Link>
    </article>
  );
}

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => { api(`/jobs/${id}`).then(setJob); }, [id]);

  async function apply(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("message", message);
    if (resume) form.append("resume", resume);
    await api(`/applications/jobs/${id}`, { method: "POST", body: form });
    setNotice("Application submitted successfully.");
  }

  if (!job) return <section className="page">Loading...</section>;
  return (
    <section className="page details">
      <div>
        <p className="eyebrow">{job.department} · {job.branch?.name}</p>
        <h1>{job.title}</h1>
        <p>{job.description}</p>
        <h3>Requirements</h3>
        <ul>{job.requirements?.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
      <form className="panel" onSubmit={apply}>
        <h2>Apply online</h2>
        {!user && <p>Please login as a candidate to apply.</p>}
        <textarea placeholder="Short message to HR" value={message} onChange={(e) => setMessage(e.target.value)} />
        <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} />
        <button disabled={!user || user.role !== "candidate"}><Send size={16} /> Submit application</button>
        {notice && <p className="success">{notice}</p>}
      </form>
    </section>
  );
}

function AuthPage({ mode }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify(form) });
      auth.login(data);
      navigate(data.user.role === "candidate" ? "/candidate" : "/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth">
      <form className="panel narrow" onSubmit={submit}>
        <h1>{mode === "login" ? "Login" : "Create candidate account"}</h1>
        {mode === "register" && <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required minLength="8" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>{mode === "login" ? "Login" : "Register"}</button>
        {error && <p className="error">{error}</p>}
        <Link to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Need an account?" : "Already registered?"}</Link>
      </form>
    </section>
  );
}

function CandidateDashboard() {
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState({});
  const [notice, setNotice] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    api("/applications/mine").then(setApps);
    api("/auth/me").then(setProfile);
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const updated = await api("/auth/profile", { method: "PUT", body: data });
    login({ token: localStorage.getItem("ats_token"), user: updated });
    setNotice("Profile updated.");
  }

  return (
    <section className="page">
      <div className="dashboard">
        <form className="panel" onSubmit={saveProfile}>
          <h2><UserRound size={20} /> Candidate Profile</h2>
          <input name="name" defaultValue={profile.name} placeholder="Name" />
          <input name="phone" defaultValue={profile.phone} placeholder="Phone" />
          <input name="skills" defaultValue={profile.skills?.join(", ")} placeholder="Skills comma separated" />
          <textarea name="experience" defaultValue={profile.experience} placeholder="Experience" />
          <label>Resume PDF<input name="resume" type="file" accept="application/pdf" /></label>
          <label>Cover Letter PDF/DOCX<input name="coverLetter" type="file" accept=".pdf,.docx" /></label>
          <button><Check size={16} /> Save profile</button>
          {notice && <p className="success">{notice}</p>}
        </form>
        <div className="panel">
          <h2>Applied Jobs</h2>
          {apps.map((app) => (
            <div className="listitem" key={app._id}>
              <strong>{app.job?.title}</strong>
              <span>{app.job?.branch?.name}</span>
              <span className="pill">{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const refresh = () => {
    api("/jobs").then(setJobs);
    api("/branches").then(setBranches);
    api("/applications").then(setApplications);
    api("/interviews").then(setInterviews);
  };
  useEffect(refresh, []);

  async function addJob(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.requirements = data.requirements.split(",").map((r) => r.trim()).filter(Boolean);
    data.seats = Number(data.seats);
    await api("/jobs", { method: "POST", body: JSON.stringify(data) });
    e.currentTarget.reset();
    refresh();
  }

  async function updateStatus(id, status) {
    await api(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    refresh();
  }

  async function updateJob(id, updates) {
    await api(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    refresh();
  }

  async function editJob(job) {
    const title = window.prompt("Job title", job.title);
    if (!title) return;
    const seats = Number(window.prompt("Available seats", job.seats));
    if (!seats) return;
    await updateJob(job._id, { title, seats });
  }

  async function deleteJob(id) {
    await api(`/jobs/${id}`, { method: "DELETE" });
    refresh();
  }

  async function sendMessage(id) {
    const message = window.prompt("Message to candidate");
    if (!message) return;
    await api(`/applications/${id}/message`, { method: "POST", body: JSON.stringify({ message }) });
  }

  async function schedule(e) {
    e.preventDefault();
    await api("/interviews", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    e.currentTarget.reset();
    refresh();
  }

  return (
    <section className="page">
      <div className="stats">
        <Stat icon={<Briefcase />} label="Open Jobs" value={jobs.length} />
        <Stat icon={<UserRound />} label="Applicants" value={applications.length} />
        <Stat icon={<CalendarDays />} label="Interviews" value={interviews.length} />
        <Stat icon={<Building2 />} label="Branches" value={branches.length} />
      </div>
      <div className="dashboard three">
        <form className="panel" onSubmit={addJob}>
          <h2>Add Job</h2>
          <input required name="title" placeholder="Title" />
          <input required name="department" placeholder="Department" />
          <select required name="branch">{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
          <input required name="seats" type="number" min="1" placeholder="Seats" />
          <textarea required name="description" placeholder="Description" />
          <input name="requirements" placeholder="Requirements, comma separated" />
          <button>Create job</button>
          <h2>Manage Jobs</h2>
          {jobs.map((job) => (
            <div className="listitem" key={job._id}>
              <strong>{job.title}</strong>
              <span>{job.branch?.name} · {job.seats} seats</span>
              <select value={job.status} onChange={(e) => updateJob(job._id, { status: e.target.value })}>
                <option value="open">open</option>
                <option value="closed">closed</option>
              </select>
              <button type="button" className="secondary" onClick={() => editJob(job)}>Edit</button>
              {user.role === "admin" && <button type="button" className="danger" onClick={() => deleteJob(job._id)}>Delete</button>}
            </div>
          ))}
        </form>
        <div className="panel wide">
          <h2>Applicants</h2>
          {applications.map((app) => (
            <div className="listitem applicant" key={app._id}>
              <div>
                <strong>{app.candidate?.name}</strong>
                <span>{app.job?.title} · {app.job?.branch?.name}</span>
                <a href={app.resumeUrl} target="_blank">View resume</a>
                <button type="button" className="secondary" onClick={() => sendMessage(app._id)}>Send message</button>
              </div>
              <select value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
        <form className="panel" onSubmit={schedule}>
          <h2>Schedule Interview</h2>
          <select required name="application">{applications.map((a) => <option key={a._id} value={a._id}>{a.candidate?.name} - {a.job?.title}</option>)}</select>
          <input required name="dateTime" type="datetime-local" />
          <input name="location" placeholder="Location / meeting link" />
          <textarea name="message" placeholder="Custom message" />
          <button>Schedule</button>
        </form>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }) {
  return <div className="stat">{icon}<div><strong>{value}</strong><span>{label}</span></div></div>;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
