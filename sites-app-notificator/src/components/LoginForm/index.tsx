import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { Container } from "./styles";
import { ISessionRequest } from "../../services/auth/auth.request";
import { useAuth } from "../../hooks/useAuth";
import AuthContext from "../../contexts/auth.context";

const LoginForm: React.FC = () => {
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const { Login } = useAuth();

  const initialValues: ISessionRequest = {
    userName: "",
    password: "",
  };

  const schemaValidate = yup.object().shape({
    userName: yup.string().required("usuário é obrigatório"),
    password: yup
      .string()
      .min(4, "senha muito curta")
      .required("senha é obrigatório"),
  });

  async function handleSubmit(data: ISessionRequest) {
    const session = await Login(data);

    if (session.acessToken) {
      setAuth(session);
      await window.Main.setCredentials(session);
    } else {
      setError("erro ao inicar sessão!");
    }
  }

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={schemaValidate}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, errors, isValid, isSubmitting, handleChange }) => (
          <Form>
            <TextField
              fullWidth
              margin="normal"
              name="userName"
              placeholder="usuário"
              onChange={handleChange}
              value={values.userName}
              error={!!errors.userName}
              helperText={errors.userName}
            />
            <TextField
              fullWidth
              type="password"
              name="password"
              margin="normal"
              placeholder="senha"
              onChange={handleChange}
              value={values.password}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              style={{
                marginTop: 10,
                background: "#F5DD58",
                fontWeight: "bold",
                color: "#333",
              }}
              size="large"
              variant="contained"
              type="submit"
              fullWidth
              disabled={!isValid || isSubmitting}
            >
              Logar
            </Button>
          </Form>
        )}
      </Formik>
      <Typography alignSelf="center" mt={2} color="#F93207">
        {error}
      </Typography>
    </Container>
  );
};

export default LoginForm;
