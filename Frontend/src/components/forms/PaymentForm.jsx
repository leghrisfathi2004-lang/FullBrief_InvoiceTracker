import { useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";

export default function PaymentForm({ onSubmit, max, disabled, submitting = false }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return setError("Montant invalide");
    if (max != null && value > max)
      return setError(`Le montant ne peut pas dépasser ${max}`);
    setError(null);
    onSubmit({ amount: value });
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <Input
        label="Montant du paiement"
        name="amount"
        type="number"
        step="0.01"
        max={max}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={error}
        disabled={disabled}
      />
      <Button
        type="submit"
        variant="primary"
        loading={submitting}
        disabled={disabled}
      >
        Ajouter le paiement
      </Button>
    </form>
  );
}
