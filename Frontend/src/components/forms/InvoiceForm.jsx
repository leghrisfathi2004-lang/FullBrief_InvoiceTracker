import { useState } from "react";
import Input from "../shared/Input";
import Select from "../shared/Select";
import Button from "../shared/Button";

export default function InvoiceForm({
  onSubmit,
  suppliers = [],
  defaultValues = {},
  submitting = false,
}) {
  const [fournisseurId, setFournisseurId] = useState(
    defaultValues.fournisseurId || ""
  );
  const [amount, setAmount] = useState(defaultValues.amount || "");
  const [dueDate, setDueDate] = useState(
    defaultValues.dueDate ? defaultValues.dueDate.slice(0, 10) : ""
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!fournisseurId) errs.fournisseurId = "Fournisseur requis";
    if (!amount || Number(amount) <= 0) errs.amount = "Montant invalide";
    if (!dueDate) errs.dueDate = "Date requise";
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    onSubmit({ fournisseurId, amount: Number(amount), dueDate });
  };

  const options = suppliers.map((s) => ({ value: s._id, label: s.name }));

  return (
    <form onSubmit={handleSubmit} className="form">
      <Select
        label="Fournisseur"
        name="fournisseurId"
        value={fournisseurId}
        onChange={(e) => setFournisseurId(e.target.value)}
        options={options}
        placeholder="Choisir un fournisseur"
        error={errors.fournisseurId}
      />
      <Input
        label="Montant"
        name="amount"
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
      />
      <Input
        label="Date d'échéance"
        name="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
      />
      <Button type="submit" variant="primary" loading={submitting}>
        Enregistrer
      </Button>
    </form>
  );
}
