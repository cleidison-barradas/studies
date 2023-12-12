import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import audioNotification from "../assets/sound.mp3";

interface OrderContextData {
  orderId: string;
  setOrderId: (id: string) => void;
}

interface Props {
  children: React.ReactNode;
}

const OrderContext = createContext({} as OrderContextData);
const { Provider } = OrderContext;

export const OrderProvider: React.FC<Props> = ({ children }) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [playSound] = useSound(audioNotification)
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      console.log("play sound")
      playSound()
      navigate("/new-order");
    }
    else
      navigate("/home");
  }, [orderId]);

  return (
    <Provider
      value={{
        orderId,
        setOrderId,
      }}
    >
      {children}
    </Provider>
  );
};

export default OrderContext;
