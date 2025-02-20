import React, { useEffect, useState } from "react";
import initialItems from "/src/itemList.js";
import "./postAuction.css";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

function PostAuction() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("current");
    if (!user) {
      nav("/signIn");
      return;
    }

    const storedItems = localStorage.getItem("itemList");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(initialItems);
      localStorage.setItem("itemList", JSON.stringify(initialItems));
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const id = Number(form.get("id"));
    const itemName = form.get("itemName");
    const description = form.get("description");
    const currentBid = Number(form.get("currentBid"));
    const highestBidder = form.get("highestBidder");

    const itemObj = {
      id : id,
      itemName : itemName,
      description : description,
      currentBid : currentBid,
      highestBidder : highestBidder
    };

    setItems((prevItems) => {
      const updatedItems = [...prevItems, itemObj];
      localStorage.setItem("itemList", JSON.stringify(updatedItems));
      return updatedItems;
    });

    nav("/dashboard");
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
          <Form.Control name="currentBid" type="number" required aria-label="Amount (in the Indian rupee)" />
          <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>

        <Form.Label htmlFor="highest-bid">Highest bidder</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">
            Name of the highest bidder
          </InputGroup.Text>
          <Form.Control id="highest-bid" name="highestBidder" required aria-describedby="basic-addon3" />
        </InputGroup>

        <InputGroup>
          <InputGroup.Text>Item Description</InputGroup.Text>
          <Form.Control as="textarea" name="description" required aria-label="With textarea" />
        </InputGroup>
        <Button type="submit" variant="success">
          Post
        </Button>
      </Form>
    </>
  );
}

export default PostAuction;
