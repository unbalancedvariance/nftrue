import React, { useState } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/nft-showcase/nftshowcase";

import { NFT__DATA } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

const Profile = (props) => {
  const [data, setData] = useState(NFT__DATA);
  const user  = props.item

  // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "high") {
      const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

      setData(filterData);
    }

    if (filterValue === "mid") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 5.5 && item.currentBid < 6
      );

      setData(filterData);
    }

    if (filterValue === "low") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setData(filterData);
    }
  };

  return (
    <>
      <CommonSection title={"Profile"} />
      <section>
      
        <Container>
            <h1>my Created nfts</h1>
          <Row>
            
            <Col lg="12" className="mb-5">
                <div className="filter__right">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>

            </Col>

            {data?.map((item) => (
                item.creator == user ?
                    <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                        <NftCard item={item} />
                    </Col>
                : ""
            ))}
          </Row>
        </Container>

        <Container>
            <h1>my Owned nfts</h1>
          <Row>
            
            <Col lg="12" className="mb-5">
                <div className="filter__right">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>

            </Col>

            {data?.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Profile;