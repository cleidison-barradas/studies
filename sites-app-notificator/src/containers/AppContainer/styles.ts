import styled from "styled-components";
import imagePath from "../../assets/background-map.png";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-image: url(${imagePath});
`;
