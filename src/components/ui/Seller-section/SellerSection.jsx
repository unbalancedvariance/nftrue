import React, { useState , useEffect} from "react";
import "./seller.css";
import { Container, Row, Col } from "reactstrap";
import { SELLER__DATA } from "../../../assets/data/data";
import { useAnimation, motion } from "framer-motion/dist/es/index";
import { useInView } from "react-intersection-observer";

const nftcardvariant={
  hidden: {
      opacity: 0,
      y : +50
  },
  visible: {
      opacity: 1,
      y:0,
      transition: {
          duration: 1
      },
  }
}

const SellerSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  useEffect(() => {
      if (inView) {
      controls.start("visible");
      }
  }, [controls, inView]);
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="seller__section-title">
              <h3>Top Seller</h3>
            </div>
          </Col>

          {SELLER__DATA.map((item) => (
            <Col lg="2" md="3" sm="4" xs="6" key={item.id} className="mb-4">
              <motion.div className="single__seller-card d-flex align-items-center gap-3"
              variants={nftcardvariant} 
              ref={ref}
              animate={controls}
              initial="hidden"
              >
                <div className="seller__img">
                  <img src={item.sellerImg} alt="" className="w-100" />
                </div>

                <div className="seller__content">
                  <h6>{item.sellerName}</h6>
                  <h6>{item.currentBid} ETH</h6>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default SellerSection;
