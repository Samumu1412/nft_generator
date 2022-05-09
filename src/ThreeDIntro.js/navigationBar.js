import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { isNil, get, truncate } from "lodash"

// Exporting Default Navbar to the App.js File
export const NavHomePage = ({
  setAboutOpen,
  setRoadmapOpen,
  setFAQOpen,
  onConnect,
  userInfo
}) => {

  return (
    <AppBar
      position="static"
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        variant="dense"
        style={{
          zIndex: 10,
          backgroundColor: "#2b2b2b30",
          justifyContent: 'flex-end',
          borderRadius: "10px",
          height: "25px",
        }}
      >
        <div className="eachOne">
          <Typography
            variant="h6"
            color="inherit"
            className="landingNavMenu"
            style={{ fontFamily: "monospace" }}
            onClick={() => {
              setAboutOpen(true);
            }}
          >
            ABOUT
          </Typography>
        </div>

        <div className="eachOne">
          <Typography
            variant="h6"
            color="inherit"
            className="landingNavMenu"
            style={{ fontFamily: "monospace" }}
            onClick={() => {
              setRoadmapOpen(true);
            }}
          >
            ROADMAP
          </Typography>
        </div>

        <div className="eachOne">
          <Typography
            variant="h6"
            color="inherit"
            className="landingNavMenu"
            style={{ fontFamily: "monospace" }}
            onClick={() => {
              setFAQOpen(true);
            }}
          >
            FAQ
          </Typography>
        </div>
        <div className="eachOne">
          <Typography
            variant="h6"
            color="inherit"
            className="landingNavMenu"
            style={{ fontFamily: "monospace" }}
            onClick={() => {
              if(isNil(get(userInfo, 'address'))) {
                onConnect()
              }
            }}
          >
            {isNil(get(userInfo, 'address'))
              ? 'CONNECT'
              : truncate(userInfo.address, { length: 8 })
            }
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};
