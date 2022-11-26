import React, { useState , useEffect} from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useAnimation, motion } from "framer-motion/dist/es/index";
import { useInView } from "react-intersection-observer";
import "./hero-section.css";
import { Canvas } from "@react-three/fiber";
// import CanvasResize from "react-canvas-resize";
import { Suspense } from "react";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { useGLTF, OrthographicCamera } from '@react-three/drei'

const textpopvariant={
  hidden: {
      opacity: 0,
      x : -100
  },
  visible: {
      opacity: 1,
      x:0,
      transition: {
          duration: 1.5
      },
  }
}
const cubepopvariant={
  hidden: {
      opacity: 0,
      x : +100,
  },
  visible: {
      opacity: 1,
      x:0,
      transition: {
          duration: 1.5
      },
  }
}

const HeroSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  useEffect(() => {
      if (inView) {
      controls.start("visible");
      }
  }, [controls, inView]);

  return (
    
    <section className="hero__section">
      <Container>
        <div class="row form-group">
          <div class = "col-lg-7">
            <motion.div className="hero__content"
            variants={textpopvariant} 
            ref={ref}
            animate={controls}
            initial="hidden">
              <h2>
                Buy, sell and mint NFTs
                <span>with true Artist royalty</span>
              </h2>
              <p>
                We provide the artists with full control over the royalty fees on their minted NFTs. Start creating, start minting, start earning
                <span> Now</span>.
              </p>

              <div className="hero__btns d-flex align-items-center gap-4">
                <button className=" explore__btn d-flex align-items-center gap-2">
                  <i class="ri-rocket-line"></i>{" "}
                  <Link to="/market">Explore</Link>
                </button>
                <button className=" create__btn d-flex align-items-center gap-2">
                  <i class="ri-ball-pen-line"></i>
                  <Link to="/create">Create</Link>
                </button>
              </div>
            </motion.div>
          </div>
          <div class = "col-lg-3 d-flex">
            <motion.div
            variants={cubepopvariant} 
            ref={ref}
            animate={controls}
            initial="hidden"
            >
            <Canvas>
            <mesh scale={3}>
              <sphereGeometry radius={40} segments={10} rings={10} />
              <meshNormalMaterial color="#E45C9C" wireframe={true} />
              
            </mesh>
            <mesh scale={1.5}>
              <sphereGeometry radius={40} segments={10} rings={10} />
              <meshNormalMaterial color="#E45C9C" wireframe={true} />
              
            </mesh>
            <ambientLight intensity={1.1}/>
            <directionalLight color={0x89ff45} intensity={1.5}/>
            <OrbitControls autoRotate autoRotateSpeed={3}/>
            </Canvas>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
