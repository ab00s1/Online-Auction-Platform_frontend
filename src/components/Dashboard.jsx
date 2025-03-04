import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";

function Dashboard() {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const user = localStorage.getItem("current");
    if (!user) {
      nav("/signIn");
      return;
    }

    const fetchItems = async () => {
      try {
        const response = await fetch("https://online-auction-platform-backend.onrender.com/");
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        const filteredItems = data.filter((item) =>
          item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setItems(filteredItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
    const interval = setInterval(fetchItems, 1000); // Refresh every 1s
    return () => clearInterval(interval);
  }, [nav, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => {
          setCurrentPage(number);
          setIsClicked(false);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleBid = async (itemID, currentBid) => {
    const user = localStorage.getItem("current");

    const bidAmount = parseFloat(
      prompt(`Current bid is ₹${currentBid}. Enter your bid:`)
    );

    if (isNaN(bidAmount)) {
      alert("Please enter a valid number.");
      return;
    }

    if (bidAmount <= currentBid) {
      alert("Your bid must be higher than the current bid.");
      return;
    }

    try {
      // Send bid update to MongoDB
      const response = await fetch("https://online-auction-platform-backend.onrender.com/update-bid", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemID,
          bidAmount,
          highestBidder: JSON.parse(user).fullName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bid");
      }

      const updatedItem = await response.json();

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemID
            ? {
                ...item,
                currentBid: bidAmount,
                highestBidder: user,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating bid:", error);
      alert("Failed to place bid. Try again.");
    }
  };

  const formatTimeRemaining = (endingTime) => {
    const timeLeft = new Date(endingTime).getTime() - Date.now();
    if (timeLeft <= 0) return "Bidding Closed";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleDelete = async (itemID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }
  
      const response = await fetch(
        `https://online-auction-platform-backend.onrender.com/delete-item/${itemID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
  
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemID));
      setIsClicked(false);
      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Try again.");
    }
  };

  return (
    <>
      <Button
        variant="outline-info"
        size="lg"
        as={Link}
        to="/postAuction"
        style={{ display: "block", margin: "10px" }}
      >
        Post new item
      </Button>

      <h2 className="dashboard">Auction Dashboard</h2>

      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col sm={4}>
            <ListGroup>
              {currentItems.map((obj) => (
                <ListGroup.Item
                  key={obj._id}
                  onClick={() => setIsClicked(true)}
                  action
                  href={`#${obj._id}`}
                >
                  {obj.itemName}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="pagination">
              <Pagination size="sm">{paginationItems}</Pagination>
            </div>
          </Col>
          <Col sm={8}>
            <Tab.Content style={{ height: "100%" }}>
              {isClicked ? (
                currentItems.map((obj) => (
                  <Tab.Pane key={obj._id} eventKey={`#${obj._id}`}>
                    <p>
                      Description: <strong>{obj.description}</strong>
                    </p>
                    <p>
                      Current Bid: <strong>₹{obj.currentBid}</strong>
                    </p>
                    <p>
                      Highest Bidder: <strong>{obj.highestBidder}</strong>
                    </p>
                    {!obj.isClosed ? (
                      <Button
                        onClick={() => handleBid(obj._id, obj.currentBid)}
                        className="bidmore"
                      >
                        Bid More
                      </Button>
                    ) : (
                      <Button
                        style={{ cursor: "not-allowed" }}
                        className="bidmore"
                      >
                        Bid More
                      </Button>
                    )}
                    <p>
                      <strong style={{ color: "orange" }}>
                        {obj.isClosed
                          ? "Bidding Closed"
                          : formatTimeRemaining(obj.endingTime)}
                      </strong>
                    </p>
                    <div className="edit-delete">
                      {JSON.parse(localStorage.getItem("current")).fullName ===
                      obj.creator ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => {
                              localStorage.setItem("editItemID", obj._id);
                              nav("/edit");
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() => handleDelete(obj._id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <p style={{ color: "gray", fontStyle: "italic" }}>
                          You can edit or delete only your bid.
                        </p>
                      )}
                    </div>
                  </Tab.Pane>
                ))
              ) : (
                <div className="empty-handle">
                  <img
                    src="/hand_12640222.jpeg"
                    alt="Select one from the list"
                  />
                </div>
              )}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}

export default Dashboard;
