import React from "react";
import { Container, Image } from "./styles";
import HomeForm from "../../components/HomeForm";
import newOrder from "../../assets/neworder.svg";

const NewOrder: React.FC = () => {
  return (
    <Container>
      <Image src={newOrder} alt="mypharma-logo" />
      <HomeForm />
    </Container>
  );
};

export default NewOrder;