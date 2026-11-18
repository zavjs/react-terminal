import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: auto;
  padding-top: 20px;
  opacity: 0.4;
`;
const Greeting = () => (
  <Container>
    Made by <a href="https://github.com/zavjs">H. Zavareze</a>
    <br />
    Checkout the{" "}
    <a href="https://github.com/zavjs/terminal">Github Repository</a>
  </Container>
);

export default Greeting;
