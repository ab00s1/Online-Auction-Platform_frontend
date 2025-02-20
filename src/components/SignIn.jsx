import React from "react";
import "./signIn.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

function SignIn({ setUser }) {
  const nav = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const email = form.get("email");
    const password = form.get("password");

    if (!localStorage.getItem("user")) {
      alert("Create an account");
      nav("/signUp");
      return;
    }

    const detailsList = JSON.parse(localStorage.getItem("user"));

    const user = detailsList.find(
      (details) => details.email === email && details.pass === password
    );

    if (user) {
      localStorage.setItem("current", user.fullName);
      setUser(user);
      nav("/dashboard");
    } else {
      alert("Wrong email or password.");
    }

    // console.log("User signed in:", { email, password });
  }

  return (
    <div className="signin-form">
      <div className="signin-form-img">
        <img src="/2780906.jpg" alt="signin-page" />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
          <Col sm={{ span: 10, offset: 2 }}>
            <Form.Check label="Remember me" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Sign in</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default SignIn;
