import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.css";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import PostAuction from "./components/PostAuction";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { useState } from "react";
import Edit from "./components/Edit";

function App() {
  const nav = useNavigate();
  const year = new Date().getFullYear();

  const [user, setUser] = useState(localStorage.getItem("current"));
  const [query, setQuery] = useState("");

  function navigate(event) {
    const user = localStorage.getItem("current");
    if (user) {
      event.preventDefault();
    }
  }

  function logout() {
    localStorage.setItem("current", "");
    setUser("");
    nav("/");
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      nav(`/dashboard?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <div style={{ color: "coral", fontWeight: "bold" }}>
              Online Auction
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/postAuction">
                Post Auction
              </Nav.Link>
              <NavDropdown title="Join us" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/signIn" onClick={navigate}>
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/signUp" onClick={navigate}>
                  Create Account
                </NavDropdown.Item>
                {user && <NavDropdown.Divider />}
                {user && (
                  <NavDropdown.Item onClick={logout}>
                    <img
                      src="/right-from-bracket-solid.svg"
                      alt="logout"
                      width={20}
                    />{" "}
                    Log out
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
            <Form onSubmit={handleSearch} className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <Button type="submit" variant="outline-success">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/postAuction" element={<PostAuction />} />
        <Route path="/signIn" element={<SignIn setUser={setUser} />} />
        <Route path="/signUp" element={<SignUp setUser={setUser} />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>

      <footer>
        <p>&copy; {year} Auction App. All rights reserved.</p>
        <p>Welcome to the best place to buy and sell items through auctions!</p>
      </footer>
    </>
  );
}

export default App;
