import React, { useEffect, useState } from "react";
import initialItems from "/src/itemList.js";
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
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

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
                  key={obj.id}
                  onClick={() => setIsClicked(true)}
                  action
                  href={`#${obj.id}`}
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
                  <Tab.Pane key={obj.id} eventKey={`#${obj.id}`}>
                    <p>
                      Description: <strong>{obj.description}</strong>
                    </p>
                    <p>
                      Current Bid: <strong>₹{obj.currentBid}</strong>
                    </p>
                    <p>
                      Highest Bidder: <strong>{obj.highestBidder}</strong>
                    </p>
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
