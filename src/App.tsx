import {
  useEffect,
  useState,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Search,
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  ClipboardList,
  LogOut,
  Package,
  Check,
  Mail,
  MoreHorizontal,
  X,
  AlertTriangle,
  FileText,
  RefreshCw,
} from "lucide-react";
import { auth, api } from "./api";
import { money, type Profile, type Dashboard } from "./domain";
import { OrderJourney } from "./OrderJourney";
export function Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={"button " + className} {...props}>
      {children}
    </button>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const el = ref.current;
    return () => el?.close();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="dialog-title">
      <div className="modal-head">
        <h2 id="dialog-title">{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export const date = (s: string) =>
  new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export function App() {
  const path = window.location.pathname;
  const demo = path.startsWith("/demo");
  const [actor, setActor] = useState<Profile | null>(null),
    [checking, setChecking] = useState(!demo && !!auth),
    [error, setError] = useState("");
  useEffect(() => {
    if (!auth || demo) return;
    let live = true;
    const refresh = () => {
      setChecking(true);
      api<Profile>("/me")
        .then((p) => {
          if (live) {
            setActor(p);
            setError("");
          }
        })
        .catch((e) => {
          if (live) {
            setActor(null);
            setError(e.message);
          }
        })
        .finally(() => {
          if (live) setChecking(false);
        });
    };
    auth.auth
      .getSession()
      .then(({ data: { session } }) =>
        session ? refresh() : setChecking(false),
      );
    const {
      data: { subscription },
    } = auth.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setActor(null);
        setChecking(false);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
        setTimeout(refresh, 0);
    });
    return () => {
      live = false;
      subscription.unsubscribe();
    };
  }, [demo]);
  if (path === "/auth/set-password") return <PasswordSetup />;
  if (demo && path === "/demo/order") return <OrderJourney />;
  if (demo) return <Admin demo />;
  if (checking)
    return (
      <main className="loading" role="status">
        Checking your account…
      </main>
    );
  if (actor?.role === "admin") return <Admin actor={actor} />;
  if (actor)
    return (
      <main className="business-home">
        <p className="eyebrow">INVENTORY & SALES</p>
        <h1>Welcome, {actor.display_name}</h1>
        <p>
          Your business account is connected. Customer, product and transaction
          persistence are the next milestone.
        </p>
        <a className="button" href="/demo/order">
          Explore the sample order journey <ArrowRight size={18} />
        </a>
        <Button className="secondary" onClick={() => auth?.auth.signOut()}>
          Sign out
        </Button>
      </main>
    );
  return <Login serverError={error} />;
}
function Login({ serverError }: { serverError: string }) {
  const [admin, setAdmin] = useState(
      window.location.pathname.startsWith("/admin"),
    ),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setBusy(true);
    setError("");
    const { error } = await auth.auth.signInWithPassword({ email, password });
    if (error) setError("Unable to sign in. Check your email and password.");
    setBusy(false);
  }
  async function reset() {
    if (!auth || !email.includes("@"))
      return setError("Enter your email first.");
    setBusy(true);
    await auth.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + "/auth/set-password",
    });
    setMessage(
      "If the account can receive recovery email, a setup link will be sent.",
    );
    setBusy(false);
  }
  return (
    <div className="login-layout">
      <aside className="login-story">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Package />
          </span>
          Inventory & Sales
        </a>
        <div>
          <p className="eyebrow">LESS ADMIN. MORE BUSINESS.</p>
          <h1>
            Your business,
            <br />
            all in order.
          </h1>
          <p>
            From the first order to the last payment.
            <br />A simpler way to keep everything connected.
          </p>
          <div className="story-card">
            <span>
              <ShieldCheck /> Built around your business
            </span>
            <p>
              Customers, inventory and sales.
              <br />
              One clear place to manage it all.
            </p>
          </div>
        </div>
        <small>A straightforward workspace for small businesses.</small>
      </aside>
      <main className="login-main">
        <div className="login-card">
          <div className="mobile-brand">
            <Package /> Inventory & Sales
          </div>
          <div className="segmented">
            <button
              className={!admin ? "selected" : ""}
              onClick={() => setAdmin(false)}
            >
              Business login
            </button>
            <button
              className={admin ? "selected" : ""}
              onClick={() => setAdmin(true)}
            >
              Creator admin
            </button>
          </div>
          <span className="round-icon">
            <ShieldCheck />
          </span>
          <h1>{admin ? "Welcome back, creator." : "Welcome back."}</h1>
          <p className="muted">
            {admin
              ? "Sign in to manage businesses, users and access."
              : "Sign in to your business workspace."}
          </p>
          {!auth && (
            <div className="notice">
              Account sign-in needs environment configuration. You can explore
              the sample workspace below.
            </div>
          )}
          <form onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                required
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  aria-label="Password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <button
              type="button"
              className="text-button forgot"
              onClick={reset}
              disabled={busy || !auth}
            >
              Forgot password?
            </button>
            {(error || serverError) && (
              <p role="alert" className="error">
                {error || serverError}
              </p>
            )}
            {message && (
              <p role="status" className="notice">
                {message}
              </p>
            )}
            <Button disabled={busy || !auth}>
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight size={18} />
            </Button>
          </form>
          <p className="account-help">
            Business accounts are created by your administrator.
          </p>
          <div className="demo-links">
            <a href="/demo/admin">
              Explore admin preview <ArrowRight size={15} />
            </a>
            <a href="/demo/order">
              Try a sample order <ArrowRight size={15} />
            </a>
          </div>
          <small className="muted">
            Previews use sample data and never send email.
          </small>
        </div>
      </main>
    </div>
  );
}
function PasswordSetup() {
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!auth) return;
    if (password !== confirm) return setMessage("Passwords do not match.");
    setBusy(true);
    const {
      data: { session },
    } = await auth.auth.getSession();
    if (!session) {
      setMessage(
        "This link is expired or invalid. Request a new password-setup email.",
      );
      setBusy(false);
      return;
    }
    const { error } = await auth.auth.updateUser({ password });
    setMessage(
      error
        ? "Password could not be updated. Request a fresh link."
        : "Password updated. You can now sign in.",
    );
    if (!error) await auth.auth.signOut();
    setBusy(false);
  }
  return (
    <main className="setup-card card">
      <ShieldCheck />
      <h1>Set your password</h1>
      <p>Choose a private password of at least 12 characters.</p>
      <form onSubmit={submit}>
        <label>
          New password
          <input
            type="password"
            minLength={12}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            minLength={12}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>
        {!auth && <p className="notice">Authentication is not configured.</p>}
        {message && <p role="status">{message}</p>}
        <Button disabled={!auth || busy}>Set password</Button>
        <a href="/login">Return to sign in</a>
      </form>
    </main>
  );
}
const sample: Dashboard = {
  businesses: [
    {
      id: "sample-1",
      name: "Northside Supply",
      subscription_status: "active",
      enabled: true,
      created_at: "2026-09-24T12:00:00Z",
    },
    {
      id: "sample-2",
      name: "Harbor Market",
      subscription_status: "active",
      enabled: true,
      created_at: "2026-09-26T12:00:00Z",
    },
    {
      id: "sample-3",
      name: "Oak Street Deli",
      subscription_status: "grace",
      enabled: true,
      created_at: "2026-09-28T12:00:00Z",
    },
  ],
  users: [
    {
      id: "sample-a",
      email: "alex@example.com",
      display_name: "Alex Smith",
      role: "business",
      enabled: true,
      business_id: "sample-1",
      setup_state: "active",
    },
    {
      id: "sample-b",
      email: "jordan@example.com",
      display_name: "Jordan Lee",
      role: "business",
      enabled: true,
      business_id: "sample-2",
      setup_state: "active",
    },
    {
      id: "sample-c",
      email: "casey@example.com",
      display_name: "Casey Rivera",
      role: "business",
      enabled: true,
      business_id: "sample-3",
      setup_state: "pending",
    },
  ],
  events: [
    {
      id: "event-1",
      action: "account_created",
      target_id: null,
      reason: "Oak Street Deli",
      created_at: "2026-09-28T12:00:00Z",
    },
    {
      id: "event-2",
      action: "password_setup_accepted",
      target_id: null,
      reason: null,
      created_at: "2026-09-26T12:00:00Z",
    },
  ],
};
export function Admin({
  demo = false,
  actor,
}: {
  demo?: boolean;
  actor?: Profile;
}) {
  const [tab, setTab] = useState("Overview"),
    [data, setData] = useState<Dashboard>(
      demo
        ? structuredClone(sample)
        : { businesses: [], users: [], events: [] },
    ),
    [loading, setLoading] = useState(!demo),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [create, setCreate] = useState(false),
    [selected, setSelected] = useState<Profile | null>(null),
    [reason, setReason] = useState(""),
    [busy, setBusy] = useState(false);
  async function refresh() {
    if (demo) return;
    setLoading(true);
    setError("");
    try {
      setData(await api<Dashboard>("/admin/dashboard"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function action(kind: "access" | "setup" | "revoke") {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      if (demo) {
        if (kind === "access")
          setData((d) => ({
            ...d,
            users: d.users.map((u) =>
              u.id === selected.id ? { ...u, enabled: !u.enabled } : u,
            ),
          }));
        setNotice("Preview updated. No real account or email was changed.");
      } else {
        await api(
          `/admin/users/${selected.id}/${kind}`,
          kind === "setup"
            ? {}
            : kind === "access"
              ? { enabled: !selected.enabled, reason }
              : { reason },
        );
        setNotice(
          kind === "setup"
            ? "Setup email accepted for delivery; receipt is not confirmed."
            : "Access updated.",
        );
        await refresh();
      }
      setSelected(null);
      setReason("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const visible = data.businesses.filter((b) => {
    const u = data.users.find((u) => u.business_id === b.id);
    return (
      (b.name + " " + u?.email + " " + u?.display_name)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" ||
        (status === "pending"
          ? u?.setup_state === "pending"
          : status === "disabled"
            ? !u?.enabled
            : b.subscription_status === status))
    );
  });
  const tabs = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Businesses", icon: Building2 },
    { name: "Users", icon: Users },
    { name: "Audit log", icon: ClipboardList },
  ];
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Package />
          </span>
          <span>
            Inventory & Sales<small>CREATOR CONSOLE</small>
          </span>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          {tabs.map((t) => (
            <button
              key={t.name}
              className={tab === t.name ? "active" : ""}
              onClick={() => setTab(t.name)}
            >
              <t.icon size={19} />
              {t.name}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <ShieldCheck />
          <strong>You're in control.</strong>
          <p>One place to manage your businesses and their access.</p>
        </div>
        <a className="sidebar-sample" href="/demo/order">
          Sample order journey <ArrowRight size={16} />
        </a>
        <button
          className="signout"
          onClick={() =>
            demo ? location.assign("/login") : auth?.auth.signOut()
          }
        >
          <LogOut size={18} />
          {demo ? "Exit preview" : "Sign out"}
        </button>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <span>
            Workspace <span className="slash">/</span> <strong>{tab}</strong>
          </span>
          <div className="account-chip">
            <span className="live-dot" />
            Creator admin
            <span className="avatar">
              {(actor?.display_name || "Creator").slice(0, 1)}
            </span>
          </div>
        </header>
        <main className="main-content">
          {demo && (
            <div className="preview-banner">
              <span>
                <ShieldCheck size={16} />
                Interactive preview · Sample data only
              </span>
              <a href="/login">
                Go to sign in <ArrowRight size={14} />
              </a>
            </div>
          )}
          <div className="page-title">
            <div>
              <p className="eyebrow">YOUR BUSINESS NETWORK</p>
              <h1>
                {tab === "Overview" ? "A clear view of your workspace." : tab}
              </h1>
              <p className="muted">
                {tab === "Overview"
                  ? "Manage businesses, welcome new users and keep access in order."
                  : tab === "Audit log"
                    ? "A record of administrative changes and account activity."
                    : "Every business. One user. All in one place."}
              </p>
            </div>
            <Button onClick={() => setCreate(true)}>
              <Plus size={18} />
              Create business & user
            </Button>
          </div>
          {error && (
            <div className="error" role="alert">
              {error}
              <button className="text-button" onClick={refresh}>
                Retry
              </button>
            </div>
          )}
          {notice && (
            <div role="status" className="notice">
              {notice}
            </div>
          )}
          {tab === "Overview" && (
            <div className="stats">
              <button
                className="stat card"
                onClick={() => {
                  setTab("Businesses");
                  setStatus("all");
                }}
              >
                <Building2 />
                <span>Total businesses</span>
                <strong>{loading ? "—" : data.businesses.length}</strong>
                <small>Across your workspace</small>
              </button>
              <button
                className="stat card"
                onClick={() => {
                  setTab("Users");
                  setStatus("active");
                }}
              >
                <Users />
                <span>Active subscriptions</span>
                <strong>
                  {loading
                    ? "—"
                    : data.businesses.filter(
                        (b) => b.subscription_status === "active",
                      ).length}
                </strong>
                <small>Business accounts</small>
              </button>
              <button
                className="stat card"
                onClick={() => {
                  setTab("Users");
                  setStatus("pending");
                }}
              >
                <Mail />
                <span>Awaiting setup</span>
                <strong>
                  {loading
                    ? "—"
                    : data.users.filter((u) => u.setup_state === "pending")
                        .length}
                </strong>
                <small>Password setup pending</small>
              </button>
            </div>
          )}
          {loading ? (
            <div className="card loading" role="status">
              Loading your workspace…
            </div>
          ) : tab === "Audit log" ? (
            <section className="card">
              <div className="section-heading">
                <h2>Recent account activity</h2>
                <span className="muted">Latest 50 events</span>
              </div>
              {data.events.length ? (
                data.events.map((e) => (
                  <div className="activity" key={e.id}>
                    <span className="round-icon">
                      <ClipboardList size={18} />
                    </span>
                    <div>
                      <strong>{e.action.replaceAll("_", " ")}</strong>
                      <p>{e.reason || "Administrative account event"}</p>
                    </div>
                    <small>{date(e.created_at)}</small>
                  </div>
                ))
              ) : (
                <Empty text="No administrative changes yet." />
              )}
            </section>
          ) : (
            <section className="card table-card">
              <div className="section-heading">
                <div>
                  <h2>
                    {tab === "Users" ? "Business users" : "Your businesses"}
                  </h2>
                  <p className="muted">
                    Create accounts and manage their access.
                  </p>
                </div>
                <button
                  className="icon-button"
                  aria-label="Refresh workspace"
                  onClick={refresh}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <div className="filters">
                <label className="search">
                  <Search size={18} />
                  <input
                    aria-label="Search businesses or users"
                    placeholder="Search business, name or email…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Filter account status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active subscription</option>
                  <option value="pending">Awaiting setup</option>
                  <option value="disabled">Disabled users</option>
                  <option value="grace">Grace period</option>
                </select>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Business user</th>
                      <th>Subscription</th>
                      <th>User access</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => {
                      const u = data.users.find((u) => u.business_id === b.id);
                      return (
                        <tr key={b.id}>
                          <td>
                            <div className="business-cell">
                              <span className="business-icon">
                                <Building2 size={19} />
                              </span>
                              <div>
                                <strong>{b.name}</strong>
                                <small>Created {date(b.created_at)}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>{u?.display_name || "Not assigned"}</strong>
                            <small>{u?.email || "No login user"}</small>
                          </td>
                          <td>
                            <span className={"badge " + b.subscription_status}>
                              {b.subscription_status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={
                                "badge " +
                                (!u?.enabled
                                  ? "disabled"
                                  : u.setup_state === "pending"
                                    ? "pending"
                                    : "active")
                              }
                            >
                              {!u?.enabled
                                ? "Disabled"
                                : u.setup_state === "pending"
                                  ? "Awaiting setup"
                                  : "Active"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="icon-button"
                              aria-label={`Manage ${b.name}`}
                              disabled={!u}
                              onClick={() => {
                                setSelected(u!);
                                setReason("");
                                setError("");
                              }}
                            >
                              <MoreHorizontal />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!visible.length && (
                <Empty
                  text={
                    query
                      ? "No matches. Try another name or email."
                      : "No businesses yet. Create your first business and user."
                  }
                />
              )}
              <footer className="table-footer">
                {visible.length} of {data.businesses.length} businesses · Up to
                200 most recent accounts
              </footer>
            </section>
          )}
          {tab === "Overview" && (
            <div className="bottom-grid">
              <section className="card welcome-card">
                <span className="round-icon">
                  <Plus />
                </span>
                <h2>A new business starts here.</h2>
                <p>
                  Add the business details and its user. Send a private
                  password-setup email when you're ready.
                </p>
                <button className="text-button" onClick={() => setCreate(true)}>
                  Create a business <ArrowRight size={16} />
                </button>
              </section>
              <section className="card">
                <div className="section-heading">
                  <h2>Recent activity</h2>
                  <button
                    className="text-button"
                    onClick={() => setTab("Audit log")}
                  >
                    View log
                  </button>
                </div>
                {data.events.slice(0, 3).map((e) => (
                  <div className="activity compact" key={e.id}>
                    <span className="activity-dot" />
                    <div>
                      <strong>{e.action.replaceAll("_", " ")}</strong>
                      <small>{date(e.created_at)}</small>
                    </div>
                  </div>
                ))}
                {!data.events.length && (
                  <p className="muted">
                    Your account activity will appear here.
                  </p>
                )}
              </section>
            </div>
          )}
          <footer className="page-footer">
            Inventory & Sales{" "}
            <span>Simple by design. Connected by purpose.</span>
          </footer>
        </main>
      </div>
      {create && (
        <CreateAccount
          demo={demo}
          onClose={() => setCreate(false)}
          onCreated={(result) => {
            if (demo) {
              const now = new Date().toISOString();
              setData((d) => ({
                ...d,
                businesses: [
                  {
                    id: result.business_id,
                    name: result.business_name,
                    subscription_status: "active",
                    enabled: true,
                    created_at: now,
                  },
                  ...d.businesses,
                ],
                users: [
                  {
                    id: result.user_id,
                    email: result.email,
                    display_name: result.display_name,
                    role: "business",
                    enabled: true,
                    business_id: result.business_id,
                    setup_state: "pending",
                  },
                  ...d.users,
                ],
                events: [
                  {
                    id: crypto.randomUUID(),
                    action: "account_created",
                    reason: result.business_name,
                    target_id: result.user_id,
                    created_at: now,
                  },
                  ...d.events,
                ],
              }));
            } else void refresh();
            setNotice(
              demo
                ? "Sample account created. No real user or email was created."
                : "Account created. Open its actions to send a password-setup email.",
            );
            setCreate(false);
          }}
        />
      )}
      {selected && (
        <Modal
          title={`Manage ${selected.display_name}`}
          onClose={() => !busy && setSelected(null)}
        >
          <p className="muted">{selected.email}</p>
          <p>
            Passwords are private. You can send setup instructions or change
            account access.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <Button
            disabled={busy || !selected.enabled}
            onClick={() => action("setup")}
          >
            <Mail size={18} />
            {demo ? "Preview setup email" : "Send password-setup email"}
          </Button>
          <label>
            Reason for access change
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain this change"
              maxLength={300}
            />
          </label>
          <div className="modal-actions">
            <Button
              className="secondary"
              disabled={busy || reason.trim().length < 3}
              onClick={() => action("revoke")}
            >
              Revoke sessions
            </Button>
            <Button
              className={selected.enabled ? "danger" : ""}
              disabled={busy || reason.trim().length < 3}
              onClick={() => action("access")}
            >
              {selected.enabled ? "Disable user" : "Reactivate user"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <Building2 />
      <p>{text}</p>
    </div>
  );
}
function CreateAccount({
  demo,
  onClose,
  onCreated,
}: {
  demo: boolean;
  onClose: () => void;
  onCreated: (r: {
    business_id: string;
    user_id: string;
    business_name: string;
    display_name: string;
    email: string;
  }) => void;
}) {
  const [name, setName] = useState(""),
    [display, setDisplay] = useState(""),
    [email, setEmail] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [attempted, setAttempted] = useState(false);
  const [id] = useState(() => crypto.randomUUID());
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setAttempted(true);
    setError("");
    try {
      const r = demo
        ? { business_id: crypto.randomUUID(), user_id: crypto.randomUUID() }
        : await api<{ business_id: string; user_id: string }>(
            "/admin/accounts",
            {
              operation_id: id,
              business_name: name,
              display_name: display,
              email,
            },
          );
      onCreated({ ...r, business_name: name, display_name: display, email });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Create business & user" onClose={() => !busy && onClose()}>
      <p className="muted">One business. One login. A complete workspace.</p>
      <form onSubmit={submit}>
        <label>
          Business name
          <input
            required
            minLength={2}
            maxLength={120}
            disabled={attempted}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Northside Supply"
          />
        </label>
        <label>
          User's full name
          <input
            required
            minLength={2}
            maxLength={100}
            disabled={attempted}
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            placeholder="e.g. Alex Smith"
          />
        </label>
        <label>
          Login email
          <input
            required
            type="email"
            maxLength={254}
            disabled={attempted}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@business.com"
          />
        </label>
        <div className="notice">
          <ShieldCheck size={18} />
          <span>
            The user chooses a private password. Creating the account does not
            send an email.
          </span>
        </div>
        {error && (
          <div role="alert" className="error">
            {error}
            <p>Retry preserves the original request to avoid duplicates.</p>
          </div>
        )}
        <div className="modal-actions">
          <Button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button disabled={busy}>
            {busy
              ? "Creating…"
              : attempted
                ? "Retry same request"
                : "Create account"}
            <ArrowRight size={17} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
