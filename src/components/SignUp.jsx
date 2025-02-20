import React from "react";
import "./signUp.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

function SignUp({ setUser }) {
  const nav = useNavigate();

  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || password !== confirmPassword) {
      event.preventDefault();
      event.stopPropagation();
      setPasswordMatch(password === confirmPassword);
      setValidated(true);
      return;
    }

    const thisForm = new FormData(event.target);

    const firstName = thisForm.get("firstName");
    const lastName = thisForm.get("lastName");
    const fullName = firstName + " " + lastName;
    const email = thisForm.get("email");
    const city = thisForm.get("city");
    const state = thisForm.get("state");
    const zip = thisForm.get("zip");
    const pass = thisForm.get("password");

    const userObj = {
      fullName: fullName,
      email: email,
      city: city,
      state: state,
      zip: zip,
      pass: pass,
    };

    const userList = JSON.parse(localStorage.getItem("user")) || [];

    if (userList.find((user) => user.email === email)) {
      alert("This email is already in use.");
      setValidated(false);
    } else {
      userList.push(userObj);

      localStorage.setItem("user", JSON.stringify(userList));

      setUser(userObj);
      localStorage.setItem("current", userObj.fullName);
      nav("/dashboard");
      setValidated(true);
    }
  };

  return (
    <div className="signup-form">
      <div className="signup-form-img">
        <img src="/src/assets/19199299.jpg" alt="signup-page" />
      </div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              name="firstName"
              placeholder="First name"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a First name.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              name="lastName"
              placeholder="Last name"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a Last name.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomEmail">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" placeholder="City" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="State"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid state.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom05">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="text" name="zip" placeholder="Zip" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid zip.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom06">
            <Form.Label>Set your password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom07">
            <Form.Label>Re-enter your password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please re-enter your password.
            </Form.Control.Feedback>
            {!passwordMatch && (
              <div className="invalid-feedback d-block">
                Passwords do not match.
              </div>
            )}
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            label="Agree to terms and conditions"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Button type="submit">Sign up !</Button>
      </Form>
    </div>
  );
}

export default SignUp;
