import { FooterMessage, HeaderMessage } from "./components/common/Messages";
import { useRef, useState, useEffect } from "react";
import { Form, Segment, TextArea, Divider, Button, Message } from 'semantic-ui-react';
import axios from "axios";
import catchErrors from './util/catchErrors';
import {setToken} from './util/auth';
import Cookies from "js-cookie";

const login = () => {

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);


  //* ~~~~~ HANDLERS ~~~~~ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    try {
      const res = await axios.post('/api/v1/user/login', {user})
      setToken(res.data);
    } catch (error) {
      console.log(error);
      const errorMsg = catchErrors(error);
      setErrorMessage(errorMsg);
    }

    setFormLoading(false);
  }

  //* ~~~~~ USEEFFECTS ~~~~~ */
  useEffect(() => {
    setSubmitDisabled(!(email && password));
  }, [user])

  useEffect(() => {
    document.title = 'Welcome Back!';
    const userEmail = Cookies.get('userEmail');
    if(userEmail) setUser((prev) => ({...prev, email: userEmail}));
  }, [])

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMessage !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Woops!"
          content={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
        <Segment>
          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          <Form.Input
            required
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            icon={
              showPassword
                ? {
                  name: "eye slash",
                  color: "red",
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)
                }
                : {
                  name: "eye",
                  color: "green",
                  circular: true,
                  link: true,
                  onClick: () => setShowPassword(!showPassword)
                }
            }
            iconPosition="left"
            type={showPassword ? "text" : "password"}
          />
          <Divider hidden />
          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="blue"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  )
}

export default login;