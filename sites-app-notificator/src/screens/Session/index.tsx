import React from "react";
import { Container, Image } from "./styles";
import Logo from "../../assets/MyPharma.png";
import LoginForm from "../../components/LoginForm";

const Session: React.FC = () => {
  return (
    <Container>
      <Image src={Logo} alt="Mypharma" />
      <LoginForm />
    </Container>
  );
};

export default Session;
