import React from "react";
import styled from "styled-components";
import { ChakraProvider } from "@chakra-ui/react";

import Viewer from "./views/Viewer";
import ResourceList from "./views/ResourceList";
import { ViewerProvider } from "./contexts/viewer";

const App = () => {
  return (
    <ChakraProvider>
      <Container>
        <ViewerProvider>
          <ResourceList />
          <Viewer />
        </ViewerProvider>
      </Container>
    </ChakraProvider>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
`;
