export default function LoadingSpinner({ message = 'Cargando…' }) {
  return (
    <div className="cms-loading">
      <span className="spinner" />
      <span>{message}</span>
    </div>
  );
}
