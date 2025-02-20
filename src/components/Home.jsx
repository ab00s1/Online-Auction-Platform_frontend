import React from "react";
import Card from "react-bootstrap/Card";
import "./home.css";

function Home() {
  return (
    <>
      <Card>
        <div className="img-con">
          <Card.Img variant="top" src="/29710.jpg" />
        </div>
        <Card.Body>
          <Card.Text>
            <div className="card-text">
              <h2>Welcome to Auction App</h2>
              <p>
                An auction is usually a process of buying and selling goods or
                services by offering them up for bids, taking bids, and then
                selling the item to the highest bidder or buying the item from
                the lowest bidder. Some exceptions to this definition exist and
                are described in the section about different types.
              </p>
              <p>
                Auctions can take place in various formats, including live
                auctions, online auctions, and silent auctions. The process
                typically involves an auctioneer who facilitates the bidding and
                ensures that all participants follow the established rules.
                Auctions are commonly used for selling valuable or unique items
                such as antiques, artwork, collectibles, real estate, and even
                government contracts.
              </p>
              <p>
                Today, auctions are widely used in both the public and private
                sectors, with industries like finance, government, and
                e-commerce leveraging them for procurement, liquidation, and
                competitive pricing. The transparency and efficiency of auctions
                make them a popular method for fair market transactions.
              </p>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Home;
