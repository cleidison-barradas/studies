import React from "react";
import { Routes as RouteContainer, Route } from "react-router-dom";
import Session from "../screens/Session";
import NewOrder from "../screens/NewOrder";
import Home from "../screens/Home";

export default function Routes() {
  return (
    <RouteContainer>
      <Route path="/" element={<Session />} />
      <Route path="/home" element={<Home />} />
      <Route path="/new-order" element={<NewOrder />} />
    </RouteContainer>
  );
}
