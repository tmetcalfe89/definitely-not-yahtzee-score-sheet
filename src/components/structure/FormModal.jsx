import { useCallback, useEffect, useState } from "react";

export default function FormModal({
  title,
  children,
  label,
  submit = "Ok",
  onSubmit = () => {},
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      onSubmit(evt);
      setOpen(false);
    },
    [onSubmit]
  );

  const handleDialogClick = useCallback((evt) => {
    setOpen(false);
  }, []);

  const handleDialogInnerClick = useCallback((evt) => {
    evt.stopPropagation();
  }, []);

  useEffect(() => {
    const handleKeyDown = (evt) => {
      if (evt.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}>{label}</button>
      <dialog open={open} onClick={handleDialogClick}>
        <article onClick={handleDialogInnerClick}>
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
