import Button from "./Button";

export default function ErrorState({ message = "Une erreur est survenue", onRetry }) {
  return (
    <div className="error-state">
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
