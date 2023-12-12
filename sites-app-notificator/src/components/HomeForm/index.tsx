import { Button } from "@mui/material";
import React, { useContext, useEffect } from "react";
import AuthContext from "../../contexts/auth.context";
import { Container } from "./styles";
import socket from "../../services/socket";
import { server, admin } from "../../../config.json";
import OrderContext from "../../contexts/order.context";

const HomeForm: React.FC = () => {
  const { auth } = useContext(AuthContext);
  const { setOrderId, orderId } = useContext(OrderContext);

  function sendToAdmin() {
    window.Main.openAdmin(admin.url + `/sale/${orderId}`);
    setOrderId(null);
  }

  return (
    <Container>
      <Button
        style={{
          marginTop: 10,
          background: "#F5DD58",
          fontWeight: "bold",
          color: "#333",
        }}
        size="large"
        variant="contained"
        fullWidth
        onClick={sendToAdmin}
      >
        ver pedido
      </Button>
    </Container>
  );
};

export default HomeForm;
