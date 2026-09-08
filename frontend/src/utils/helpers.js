export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const imageUrl = (product) =>
  product?.images?.[0]?.url ||
  "https://placehold.co/800x800?text=No+Image";

export const errorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.[0]?.msg ||
  error?.message ||
  "Something went wrong";

export const statusLabel = (status = "") =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();