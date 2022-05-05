import React, { Component } from "react";
import { NavHomePage } from "./navigationBar";
import "./style.css";
import data from "../traffic.json";
import { AboutModalComponent } from "./AboutModal";
import { ContactModalComponent } from "./ContactModal";
import { InstructionsModalComponent } from "./InstructionsModal";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const ThreeData = () => {
  const [openAbout, setAboutOpen] = React.useState(false);
  const [openContact, setContactOpen] = React.useState(false);
  const [openInstructions, setInstructionsOpen] = React.useState(false);

  const handleCloseAbout = () => {
    setAboutOpen(false);
  };
  const handleCloseContact = () => {
    setContactOpen(false);
  };
  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
  };

  const handleClick = () => {
    const ID = { uuid: uuidv4() };
    sessionStorage.setItem("uuid", JSON.stringify(ID.uuid));

    axios.post("http://localhost:8443/saveID", ID);

    window.location.href = "/selection";
  };
  return (
    <div style={{ backgroundColor: "#000" }}>
      <div>
        <div>
          <NavHomePage
            setAboutOpen={setAboutOpen}
            setContactOpen={setContactOpen}
            setInstructionsOpen={setInstructionsOpen}
          />
        </div>

        {/* <div className="title" style={{ zIndex: 3, marginTop: "3vh" }}>
          <h3
            style={{
              zIndex: 3,
              fontFamily: "monospace",
              marginLeft: "80vw",
              backgroundColor: "#3d3d3d48",
              padding: "5px",
              borderRadius: "10px",
            }}
          >{`Total Users: ${data.TotalUsers}`}</h3>
          <h3
            style={{
              zIndex: 3,
              fontFamily: "monospace",
              marginLeft: "80vw",
              marginTop: "5px",
              backgroundColor: "#3d3d3d48",
              padding: "5px",
              borderRadius: "10px",
            }}
          >{`Total Items: ${data.TotalItems}`}</h3>
        </div> */}

        <div
          style={{
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className="glitch"
            style={{
              zIndex: 3,
              marginTop: "8vh",
              color: "#000",
            }}
          >
            <span aria-hidden="true">Neo Base</span>
            Neo Base
            <span aria-hidden="true">Neo Base</span>
          </p>
        </div>


        <div className="description-container" style={{
          zIndex: 3,
          marginTop: "3vh"
        }}>
          <h2 className="description-header">
            Tool PASS
          </h2>
          <div style={{ 
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p className="description-text">
              Be one of 10,000 people to get access to the collector side of web3's most popular tool.
            </p>
            <img
              src={require("./ToolPass.png")}
              alt="toolpass"
              style={{ zIndex: 3, width: '300px', marginRight: '20px' }}
            />
          </div>
        </div>

        <button
          className="nice"
          style={{ zIndex: 3, fontFamily: "monospace" }}
          onClick={handleClick}
        >
          Enter
        </button>

        <img
          src={require("./background.jpg")}
          alt="AlienImage"
          className="imageBackground"
          style={{ zIndex: 2 }}
        />
        <div>
          <AboutModalComponent
            isOpen={openAbout}
            handleClose={handleCloseAbout}
          />
        </div>
        <div>
          <ContactModalComponent
            isOpen={openContact}
            handleClose={handleCloseContact}
          />
        </div>
        <div>
          <InstructionsModalComponent
            isOpen={openInstructions}
            handleClose={handleCloseInstructions}
          />
        </div>
      </div>
    </div>
  );
};
