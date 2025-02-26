import React, { useEffect, useState } from "react";
import "./postAuction.css";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

function PostAuction() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [newId, setNewId] = useState(1);
  const [endingTime, setEndingTime] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("current");
    if (!user) {
      nav("/signIn");
      return;
    }

    fetch("http://localhost:5001/")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        console.log(data);
        const highestId =
          data.length > 0 ? Math.max(...data.map((item) => item._id)) : 0;
        setNewId(highestId + 1); // Assign next available ID
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, [nav]);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const _id = Number(form.get("id"));
    const itemName = form.get("itemName");
    const description = form.get("description");
    const currentBid = Number(form.get("currentBid"));
    const highestBidder = form.get("highestBidder");

    const itemObj = {
      _id: newId,
      itemName,
      description,
      currentBid,
      highestBidder,
      endingTime,
      isClosed: false,
    };

    try {
      const response = await fetch("http://localhost:5001/post-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemObj),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const data = await response.json();
      console.log("Item added:", data);

      nav("/dashboard");
    } catch (error) {
      console.error("Error posting item:", error);
    }
  }

  return (
    <>
      <h2 className="post">Post a new item</h2>
      <Form onSubmit={handleSubmit} className="post-form">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">ID</InputGroup.Text>
          <Form.Control
            name="id"
            value={items.length + 1}
            readOnly
            aria-label="ID"
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Name</InputGroup.Text>
          <Form.Control
            placeholder="Write the name of item"
            name="itemName"
            required
            aria-label="Item's name"
            aria-describedby="basic-addon2"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Current bid (in ₹)</InputGroup.Text>
          <Form.Control
            name="currentBid"
            type="number"
            required
            aria-label="Amount (in the Indian rupee)"
          />
          <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>

        <Form.Label htmlFor="highest-bid">Highest bidder</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">
            Name of the highest bidder
          </InputGroup.Text>
          <Form.Control
            id="highest-bid"
            name="highestBidder"
            required
            aria-describedby="basic-addon3"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Item Description</InputGroup.Text>
          <Form.Control
            as="textarea"
            name="description"
            required
            aria-label="With textarea"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>Auction Ends At</InputGroup.Text>
          <Form.Control
            type="datetime-local"
            name="endingTime"
            required
            onChange={(e) => setEndingTime(e.target.value)}
          />
        </InputGroup>

        <Button type="submit" variant="success">
          Post
        </Button>
      </Form>
    </>
  );
}

export default PostAuction;
