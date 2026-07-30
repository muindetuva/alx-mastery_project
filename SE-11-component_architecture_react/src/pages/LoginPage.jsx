import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await Promise.resolve(login(form));
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch {
      setSubmitError("Sign in could not be completed. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-5 py-12 dark:bg-night">
      <section className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-2xl shadow-brand/10 dark:border-white/10 dark:bg-panel">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand text-xl font-black text-white">P</span>
        <h1 className="mt-7 text-3xl font-black tracking-tight">Welcome to PulseBoard</h1>
        <p className="mt-2 text-muted dark:text-white/60">Sign in to open your real-time team workspace.</p>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-2 block font-bold" htmlFor="name">Name</label>
            <input className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 dark:border-white/15 dark:bg-night" id="name" name="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block font-bold" htmlFor="email">Email</label>
            <input className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 dark:border-white/15 dark:bg-night" id="email" name="email" type="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}
          <button className="rounded-xl bg-brand px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand/90" type="submit">Open dashboard</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
