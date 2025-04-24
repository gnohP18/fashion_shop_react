const Validate = ({ label, error, children, className = "" }) => (
  <div className={`field mb-4 ${className}`}>
    <label className="mb-2 block">{label}</label>
    {children}
    {error && <small className="p-error block">{error}</small>}
  </div>
);

export default Validate;
