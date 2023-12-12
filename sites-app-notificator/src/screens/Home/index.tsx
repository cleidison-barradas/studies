import React, { useEffect, useContext } from "react";
import { Container, Image } from "./styles";
import LogoMypharma from "../../assets/MyPharma.png";
import AuthContext from "../../contexts/auth.context";
import socket from "../../services/socket";
import { server, admin } from "../../../config.json";
import OrderContext from "../../contexts/order.context";
import { Button } from "@mui/material";
import { Stack } from "@mui/system";

const Home: React.FC = () => {
  const { auth } = useContext(AuthContext);
  const { setOrderId } = useContext(OrderContext);

  useEffect(() => {
    handleSocket();
    window.Main.on('user:asynchronous-message', function (orderId: string) {
      setOrderId(orderId);
    });
    window.Main.on("user:finished-session", () => {
      socket.finishSession();
    });
  }, [handleSocket]);

  function handleSocket() {
    if (auth) {
      socket.init(server.socket, auth.acessToken);
    }
  }

  return (
    <Container>
      <Image src={LogoMypharma} alt="mypharma-logo" />
      <h2>Seus pedidos vão aparecer aqui!</h2>
      <Stack
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            marginTop: 10,
            background: "#F5DD58",
            fontWeight: "bold",
            color: "#333",
            width: "3rem",
          }}
          size="large"
          variant="contained"
          fullWidth
          onClick={() => { window.Main.hideApp() }}
        >
          OK
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;