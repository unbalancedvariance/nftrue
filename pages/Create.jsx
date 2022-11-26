import React, { useState } from "react";

import { Container, Row, Col, Button } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";
import { NFT__DATA } from "../assets/data/data";
// import { create } from "ipfs-http-client";
import "../styles/create-item.css";

// const client = create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//     apiPath: "/api/v0",
// });

// var item = {
//   id: "",
//   title: "",
//   desc: "",
//   imgUrl: img,
//   creator: "",
//   creatorImg: avatar,
//   currentBid: 7.89,
//   royalty: 0,
// };
const Create = () => {
    const [name,setName] = useState("")
    const [price,setPrice] = useState(null);
    const [royalty, setRoyal] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    var x = NFT__DATA.lastIndexOf();
    var flag = 0;

    var item = {
        id: x + 2,
        title: title,
        desc: desc,
        imgUrl: img,
        creator: "Your Name",
        creatorImg: avatar,
        currentBid: 0,
        royalty: royalty,
    };

    function append() {
        NFT__DATA.push(item);
    }

    return (
        <>
            <CommonSection title="Create Item" />

            <section>
                <Container>
                    <Row>
                        {/* <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              <NftCard item={item} />
            </Col> */}

                        <Col lg="9" md="8" sm="6">
                            <div className="create__item">
                                <form>
                                    <div className="form__input">
                                        <label htmlFor="">Upload File</label>
                                        <input
                                            type="file"
                                            className="upload__input"
                                        />
                                    </div>

                                    <div className="form__input">
                                        <label htmlFor="">Price</label>
                                        <input
                                            type="number"
                                            placeholder="Enter price for one item (ETH)"
                                        />
                                    </div>

                                    <div className=" desc-flex align-items-center gap-4">
                                        <div className="form__input w-50">
                                            <label htmlFor="">
                                                Minimum Bid
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter minimum bid"
                                            />
                                        </div>

                                        <div className="form__input w-50">
                                            <label htmlFor="">
                                                Set Royalty
                                            </label>
                                            <input
                                                value={royalty}
                                                type="number"
                                                min="1"
                                                max="100"
                                                id="myPercent"
                                                placeholder="Set royalty"
                                                onChange={e =>
                                                    setRoyal(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className=" desc-flex align-items-center gap-4">
                                        <div className="form__input w-50">
                                            <label htmlFor="">
                                                Starting Date
                                            </label>
                                            <input type="date" />
                                        </div>

                                        <div className="form__input w-50">
                                            <label htmlFor="">
                                                Expiration Date
                                            </label>
                                            <input type="date" />
                                        </div>
                                    </div>

                                    <div className="form__input">
                                        <label htmlFor="">Title</label>
                                        <input
                                            value={title}
                                            type="text"
                                            placeholder="Enter title"
                                            onChange={e =>
                                                setTitle(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="form__input">
                                        <label htmlFor="">Description</label>
                                        <textarea
                                            value={desc}
                                            name=""
                                            id=""
                                            rows="7"
                                            placeholder="Enter description"
                                            className="w-100"
                                            onChange={e =>
                                                setDesc(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                    <div className="form__input">
                                        <Button onClick={append}>
                                            <label htmlFor="">Mint NFT</label>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Col>
                        <Col lg="3" md="4" sm="6">
                            <h5 className="mb-4 text-light">Preview Item</h5>
                            <NftCard item={item} />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Create;
