import React, { useEffect, useState } from "react";
import "./postAuction.css";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

function Edit() {
  const nav = useNavigate();
  const [itemDetails, setItemDetails] = useState({});
  const [endingTime, setEndingTime] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("current");
    if (!user) {
      nav("/signIn");
      return;
    }

    const itemID = localStorage.getItem("editItemID");
    if (!itemID) {
      alert("No item selected for editing.");
      nav("/dashboard");
      return;
    }

    fetch(`https://online-auction-platform-backend.onrender.com/item/${itemID}`)
      .then((res) => res.json())
      .then((data) => {
        setItemDetails(data);
        setEndingTime(new Date(data.endingTime).toISOString());
      })
      .catch((err) => console.error("Error fetching item:", err));
  }, [nav]);

  async function handleEdit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please log in.");
      return;
    }

    const itemName = form.get("itemName");
    const description = form.get("description");
    const currentBid = Number(form.get("currentBid"));
    const highestBidder = form.get("highestBidder");

    const updatedItem = {
      itemName,
      description,
      currentBid,
      highestBidder,
      endingTime,
      isClosed: false,
    };

    try {
      const response = await fetch(
        `https://online-auction-platform-backend.onrender.com/edit-item/${itemDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      alert("Item updated successfully");
      nav("/dashboard");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  return (
    <>
      <h2 className="edit">Edit the item</h2>
      <Form onSubmit={handleEdit} className="edit-form">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">ID</InputGroup.Text>
          <Form.Control
            name="id"
            value={localStorage.getItem("editItemID")}
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

        <Button type="submit" variant="primary">
          Update
        </Button>
      </Form>
    </>
  );
}

export default Edit;
