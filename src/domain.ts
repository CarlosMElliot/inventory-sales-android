export type Line = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  quantity: number;
  price: number;
};
export const sampleLines: Line[] = [
  {
    id: "coffee",
    name: "Colombian coffee · 12 oz",
    sku: "COF-001",
    stock: 24,
    quantity: 2,
    price: 1200,
  },
  {
    id: "water",
    name: "Sparkling water · 12 pack",
    sku: "WAT-012",
    stock: 0,
    quantity: 3,
    price: 800,
  },
];
export function total(lines: Line[]) {
  return lines.reduce((sum, l) => {
    if (
      !Number.isSafeInteger(l.price) ||
      l.price < 0 ||
      !Number.isInteger(l.quantity) ||
      l.quantity < 1 ||
      l.quantity > 10000
    )
      throw new Error("Invalid quantity or price");
    const next = sum + l.price * l.quantity;
    if (!Number.isSafeInteger(next))
      throw new Error("Total exceeds supported range");
    return next;
  }, 0);
}
export function parsePrice(value: string) {
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(value))
    throw new Error("Enter a price with up to two decimal places.");
  const [d, c = ""] = value.split(".");
  return Number(d) * 100 + Number(c.padEnd(2, "0"));
}
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export type Business = {
  id: string;
  name: string;
  subscription_status: string;
  enabled: boolean;
  created_at: string;
};
export type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: "admin" | "business";
  enabled: boolean;
  business_id: string | null;
  setup_state: string;
};
export type Audit = {
  id: string;
  action: string;
  reason: string | null;
  created_at: string;
  target_id: string | null;
};
export type Dashboard = {
  businesses: Business[];
  users: Profile[];
  events: Audit[];
};
