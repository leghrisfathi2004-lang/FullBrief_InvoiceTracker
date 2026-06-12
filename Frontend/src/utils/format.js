export const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(Number(n) || 0);

export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(d);
};

export const isOverdue = (dueDate, status) =>
  status !== "paid" && new Date(dueDate) < new Date();

export const calcProgress = (total, paid) =>
  total > 0 ? Math.min(100, (paid / total) * 100) : 0;
