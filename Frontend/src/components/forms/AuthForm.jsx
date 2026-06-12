import { useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";

export default function AuthForm({ mode = "login", onSubmit, submitting = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isRegister = mode === "register";

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (isRegister && !name.trim()) errs.name = "Nom requis";
    if (!email.trim()) errs.email = "Email requis";
    if (!password || password.length < 6) errs.password = "Min. 6 caractères";
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});

    const payload = { email: email.trim(), password };
    if (isRegister) payload.name = name.trim();
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {isRegister && (
        <Input
          label="Nom"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" variant="primary" loading={submitting}>
        {isRegister ? "S'inscrire" : "Se connecter"}
      </Button>
    </form>
  );
}
