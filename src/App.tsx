import React from "react";
import styled from "styled-components";

import Viewer from "./Viewer";
import ResourceList from "./ResourceList";

const App = () => {
  return (
    <Container>
      <ResourceList />
      <Viewer />
    </Container>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
`;
