export default function Header({ name, children }) {
  return (
    <header>
      <h1>{name}</h1>
      <section>{children}</section>
    </header>
  );
}
