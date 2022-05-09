import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import { get } from 'lodash'

import { NavHomePage } from "./navigationBar";
import "./style.css";
import { AboutModalComponent } from "./AboutModal";
import { RoadmapModalComponent } from "./ContactModal";
import { FAQModalComponent } from "./InstructionsModal";
import toolPassABI from '../ABI/toolPassABI.json'

const toolPassContractAddress = '0x44Aa52d9F0aD68867eC52C5c4d11CB6E1aF8a8CA'

export const ThreeData = () => {
  const [openAbout, setAboutOpen] = React.useState(false);
  const [openRoadmap, setRoadmapOpen] = React.useState(false);
  const [openFAQ, setFAQOpen] = React.useState(false);

  const injectedConnector = new InjectedConnector({supportedChainIds: [1, 3, 4, 5, 42, ],})
  const { activate } = useWeb3React()
  const onConnect = () => {
    activate(injectedConnector)
  }

  const [userInfo, setUserInfo] = useState(null)

  const getContract = async () => {
    const { ethereum } = window;

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const toolPassContract = new ethers.Contract(toolPassContractAddress, toolPassABI, signer)

      const ownerBalance = await toolPassContract.balanceOf(accounts[0])
      
      setUserInfo({
        address: accounts[0],
        isToolPassOwner: ownerBalance.toNumber() > 0 ? true : false
      })
    } catch (err) {
      console.log(err)
    }
  }

  const [, forceUpdate] = useReducer(() => {
    getContract()
  })

  useEffect(() => {
    forceUpdate();
  }, [])

  const handleCloseAbout = () => {
    setAboutOpen(false);
  };
  const handleCloseRoadmap = () => {
    setRoadmapOpen(false);
  };
  const handleCloseFAQ = () => {
    setFAQOpen(false);
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
            setRoadmapOpen={setRoadmapOpen}
            setFAQOpen={setFAQOpen}
            onConnect={onConnect}
            userInfo={userInfo}
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
            }}
          >
            Neo Base
          </p>
        </div>


        <div className="description-container" style={{
          zIndex: 3,
          marginTop: "20vh"
        }}>
          <h2 className="description-header">
            Tool PASS
          </h2>
          <div className="row">
            <p className="description-text">
              Be one of 10,000 people to get access to the collector side of web3's most popular tool.
            </p>
            <img
              src={require("./ToolPass.png")}
              alt="toolpass"
              style={{ zIndex: 3, width: '300px', marginRight: '20px' }}
            />
          </div>
          {get(userInfo, 'isToolPassOwner') && (
            <button
              className="transparent-button"
              style={{ zIndex: 3, fontFamily: "monospace" }}
              onClick={handleClick}
            >
              Enter
            </button>
          )}
        </div>

        <img
          src={require("./background.jpg")}
          alt="backgroundImage"
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
          <RoadmapModalComponent
            isOpen={openRoadmap}
            handleClose={handleCloseRoadmap}
          />
        </div>
        <div>
          <FAQModalComponent
            isOpen={openFAQ}
            handleClose={handleCloseFAQ}
          />
        </div>
      </div>
    </div>
  );
};
