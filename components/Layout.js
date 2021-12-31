import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";

const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
      <h1>Im a footer</h1>
    </Container>
  );
};

export default Layout;
