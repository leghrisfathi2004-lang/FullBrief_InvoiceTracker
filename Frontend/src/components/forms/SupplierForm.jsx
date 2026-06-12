import { useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";

export default function SupplierForm({ onSubmit, defaultValues = {}, submitting = false }) {
  const [name, setName] = useState(defaultValues.name || "");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    setError(null);
    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <Input
        label="Nom du fournisseur"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
      />
      <Button type="submit" variant="primary" loading={submitting}>
        Enregistrer
      </Button>
    </form>
  );
}
