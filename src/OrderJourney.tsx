import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Package,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { Button, Modal } from "./App";
import { sampleLines, total, money, parsePrice, type Line } from "./domain";
const key = "inventory-sales:sample-order:v1";
type Draft = { customer: string; lines: Line[]; comments: string };
function initial(): Draft {
  try {
    const d = JSON.parse(localStorage.getItem(key) || "null");
    if (
      d &&
      typeof d.customer === "string" &&
      typeof d.comments === "string" &&
      Array.isArray(d.lines)
    ) {
      total(d.lines);
      return d;
    }
  } catch {}
  return { customer: "", lines: structuredClone(sampleLines), comments: "" };
}
export function OrderJourney() {
  const [draft, setDraft] = useState(initial),
    [step, setStep] = useState(0),
    [query, setQuery] = useState(""),
    [customers, setCustomers] = useState([
      "Harbor Market",
      "Oak Street Deli",
      "Northside Corner Store",
    ]),
    [newCustomer, setNewCustomer] = useState(false),
    [name, setName] = useState(""),
    [editing, setEditing] = useState<Line | null>(null),
    [price, setPrice] = useState(""),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false),
    [add, setAdd] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(draft));
    } catch {
      setError(
        "Browser storage is unavailable. Keep this tab open to preserve your sample draft.",
      );
    }
  }, [draft]);
  const amount = total(draft.lines);
  function change(id: string, quantity: number) {
    if (quantity < 1 || quantity > 10000) return;
    setDraft((d) => ({
      ...d,
      lines: d.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
    }));
  }
  function savePrice(e: FormEvent) {
    e.preventDefault();
    try {
      const cents = parsePrice(price);
      setDraft((d) => ({
        ...d,
        lines: d.lines.map((l) =>
          l.id === editing!.id ? { ...l, price: cents } : l,
        ),
      }));
      setEditing(null);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="order-layout">
      <header className="order-header">
        <a className="brand" href="/demo/admin">
          <span className="brand-mark">
            <Package />
          </span>
          Inventory & Sales
        </a>
        <span className="badge pending">Sample workspace</span>
      </header>
      <main className="order-main">
        <a className="back-link" href="/demo/admin">
          <ArrowLeft size={16} />
          Admin preview
        </a>
        <div className="preview-banner">
          Sample order · Stored in this browser only. No real sale or inventory
          change.
        </div>
        <div className="page-title">
          <div>
            <p className="eyebrow">NORTHSIDE SUPPLY · SAMPLE BUSINESS</p>
            <h1>
              {saved
                ? "Your sample order is saved."
                : step === 0
                  ? "Who is this order for?"
                  : step === 1
                    ? "Build your order"
                    : "Review your order"}
            </h1>
            <p className="muted">
              {draft.customer || "Choose a customer to get started."}
              {draft.customer ? " · Draft order" : ""}
            </p>
          </div>
          {step > 0 && !saved && (
            <button className="text-button" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>
        {!saved && (
          <ol className="steps">
            {["Customer", "Products", "Review"].map((s, i) => (
              <li key={s} className={i <= step ? "current" : ""}>
                <span>{i < step ? <Check size={14} /> : i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        )}
        {step === 0 ? (
          <section className="card customer-picker">
            <div className="filters">
              <label className="search">
                <Search size={18} />
                <input
                  aria-label="Search customers"
                  placeholder="Search customers…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <Button
                className="secondary"
                onClick={() => setNewCustomer(true)}
              >
                <Plus size={18} />
                New customer
              </Button>
            </div>
            {customers
              .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
              .map((c) => (
                <button
                  className="customer-row"
                  key={c}
                  onClick={() => {
                    setDraft((d) => ({ ...d, customer: c }));
                    setStep(1);
                  }}
                >
                  <span className="business-icon">{c.slice(0, 1)}</span>
                  <span>
                    <strong>{c}</strong>
                    <small>Sample customer</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
              ))}
          </section>
        ) : (
          <div className="order-grid">
            <section>
              {saved ? (
                <div className="card document-preview">
                  <span className="badge">
                    SAMPLE · NOT A FINAL PRINT TEMPLATE
                  </span>
                  <div className="document-heading">
                    <div>
                      <strong>NORTHSIDE SUPPLY</strong>
                      <p>Sample business</p>
                    </div>
                    <h2>ORDER</h2>
                  </div>
                  <div className="document-address">
                    <div>
                      <small>SOLD TO</small>
                      <strong>{draft.customer}</strong>
                    </div>
                    <div>
                      <small>SHIP TO</small>
                      <strong>{draft.customer}</strong>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Qty</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft.lines.map((l) => (
                        <tr key={l.id}>
                          <td>{l.quantity}</td>
                          <td>{l.name}</td>
                          <td>{money(l.price)}</td>
                          <td>{money(l.quantity * l.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="document-total">
                    Total <strong>{money(amount)}</strong>
                  </p>
                  {draft.comments && <p>{draft.comments}</p>}
                  <p className="muted">
                    No payment recorded. Orders do not reduce inventory.
                  </p>
                </div>
              ) : (
                <>
                  {step === 1 && (
                    <Button
                      className="secondary add-product"
                      onClick={() => setAdd(true)}
                    >
                      <Plus size={18} />
                      Add products
                    </Button>
                  )}
                  {draft.lines.map((l) => (
                    <article className="card line-card" key={l.id}>
                      <div className="section-heading">
                        <h2>{l.name}</h2>
                        {step === 1 && (
                          <button
                            className="icon-button"
                            aria-label={`Remove ${l.name}`}
                            onClick={() =>
                              setDraft((d) => ({
                                ...d,
                                lines: d.lines.filter((x) => x.id !== l.id),
                              }))
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p
                        className={l.stock === 0 ? "stock-warning" : "stock-ok"}
                      >
                        {l.stock === 0
                          ? "Out of stock · Ordering allowed"
                          : `${l.stock} available`}
                      </p>
                      <div className="line-controls">
                        <label>
                          Quantity
                          {step === 1 ? (
                            <div className="quantity">
                              <button
                                aria-label={`Decrease ${l.name}`}
                                onClick={() => change(l.id, l.quantity - 1)}
                                disabled={l.quantity === 1}
                              >
                                −
                              </button>
                              <span>{l.quantity}</span>
                              <button
                                aria-label={`Increase ${l.name}`}
                                onClick={() => change(l.id, l.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <strong>{l.quantity}</strong>
                          )}
                        </label>
                        <label>
                          Unit price
                          {step === 1 ? (
                            <button
                              className="price-button"
                              aria-label={`Edit price for ${l.name}`}
                              onClick={() => {
                                setEditing(l);
                                setPrice((l.price / 100).toFixed(2));
                                setError("");
                              }}
                            >
                              {money(l.price)}
                              <Pencil size={15} />
                            </button>
                          ) : (
                            <strong>{money(l.price)}</strong>
                          )}
                        </label>
                      </div>
                      <div className="line-total">
                        <span>Line total</span>
                        <strong>{money(l.quantity * l.price)}</strong>
                      </div>
                    </article>
                  ))}
                  {!draft.lines.length && (
                    <div className="card empty">
                      Add at least one product to continue.
                    </div>
                  )}
                  <div className="notice warning">
                    <strong>Orders do not reduce inventory.</strong>
                    <p>You can order items even when stock is zero.</p>
                  </div>
                  {step === 2 && (
                    <label>
                      Comments
                      <textarea
                        value={draft.comments}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, comments: e.target.value }))
                        }
                        maxLength={1000}
                        placeholder="Optional details for this order"
                      />
                    </label>
                  )}
                </>
              )}
            </section>
            <aside className="card order-summary">
              <p className="eyebrow">ORDER SUMMARY</p>
              <h2>{draft.customer}</h2>
              <button
                className="text-button"
                disabled={saved}
                onClick={() => setStep(0)}
              >
                Change customer
              </button>
              <hr />
              <div>
                <span>
                  {draft.lines.reduce((n, l) => n + l.quantity, 0)} units ·{" "}
                  {draft.lines.length} products
                </span>
                <strong>{money(amount)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <span>{money(0)}</span>
              </div>
              <div>
                <span>Tax · sample only</span>
                <span>{money(0)}</span>
              </div>
              <hr />
              <div className="grand-total">
                <strong>Total</strong>
                <strong>{money(amount)}</strong>
              </div>
              {saved ? (
                <>
                  <p className="notice">
                    <Check size={16} />
                    Saved in this sample workspace.
                  </p>
                  <Button
                    onClick={() => {
                      setSaved(false);
                      setStep(0);
                      setDraft({
                        customer: "",
                        lines: structuredClone(sampleLines),
                        comments: "",
                      });
                    }}
                  >
                    Start another sample order
                  </Button>
                  <p className="muted">
                    Reference-matching PDF, email and printing arrive in the
                    document milestone.
                  </p>
                </>
              ) : (
                <Button
                  disabled={!draft.lines.length}
                  onClick={() => (step === 1 ? setStep(2) : setSaved(true))}
                >
                  {step === 1 ? "Review order" : "Save sample order"}
                  <ArrowRight size={18} />
                </Button>
              )}
              <small>
                Sample prices only. Tax configuration is not implemented.
              </small>
            </aside>
          </div>
        )}
        {error && !editing && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </main>
      {newCustomer && (
        <Modal
          title="Add sample customer"
          onClose={() => setNewCustomer(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCustomers((c) => [...c, name.trim()]);
              setDraft((d) => ({ ...d, customer: name.trim() }));
              setName("");
              setNewCustomer(false);
              setStep(1);
            }}
          >
            <label>
              Customer name
              <input
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <Button>Add customer & continue</Button>
          </form>
        </Modal>
      )}
      {editing && (
        <Modal title="Edit unit price" onClose={() => setEditing(null)}>
          <p>{editing.name}</p>
          <p className="muted">
            Only this order changes. The product's standard price stays the
            same.
          </p>
          <form onSubmit={savePrice}>
            <label>
              Unit price ($)
              <input
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button>Apply price</Button>
          </form>
        </Modal>
      )}
      {add && (
        <Modal title="Add products" onClose={() => setAdd(false)}>
          {sampleLines.map((l) => (
            <button
              className="customer-row"
              key={l.id}
              onClick={() => {
                setDraft((d) => ({
                  ...d,
                  lines: d.lines.some((x) => x.id === l.id)
                    ? d.lines.map((x) =>
                        x.id === l.id ? { ...x, quantity: x.quantity + 1 } : x,
                      )
                    : [...d.lines, { ...l, quantity: 1 }],
                }));
                setAdd(false);
              }}
            >
              <span>
                {l.name}
                <small>
                  {l.stock === 0
                    ? "Out of stock · Ordering allowed"
                    : `${l.stock} available`}
                </small>
              </span>
              <strong>{money(l.price)}</strong>
              <Plus size={18} />
            </button>
          ))}
        </Modal>
      )}
    </div>
  );
}
