import Footer from "~/components/structure/Footer";
import Header from "~/components/structure/Header";
import Main from "~/components/structure/Main";

export default function Page({ name, children, header }) {
  return (
    <div id="pico-root">
      <Header name={name}>{header}</Header>
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
