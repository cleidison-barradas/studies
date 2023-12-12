import React from "react";

import { Container } from "./styles";

interface Props {
  children: React.ReactNode;
}

const AppContainer: React.FC<Props> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default AppContainer;
