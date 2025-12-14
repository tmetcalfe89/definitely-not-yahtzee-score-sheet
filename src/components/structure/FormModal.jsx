import { useCallback, useState } from "react";

export default function FormModal({
  title,
  children,
  label,
  submit = "Ok",
  onSubmit = () => {}
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback((evt) => {
    evt.preventDefault();
    onSubmit(evt);
    setOpen(false);
  }, [onSubmit]);

  return (
    <>
      <button onClick={() => setOpen(true)}>{label}</button>
      <dialog open={open}>
        <article>
          <header>
            <button
              aria-label="Close"
              rel="prev"
              onClick={() => setOpen(false)}
            ></button>
            <p>
              <strong>{title}</strong>
            </p>
          </header>
          <form onSubmit={handleSubmit}>
            {children}
            {submit && <input type="submit" value={submit} />}
          </form>
        </article>
      </dialog>
    </>
  );
}
