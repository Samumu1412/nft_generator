import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import '../style.css';

// Using Inline Styling
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    primary: {
      main: '000',
    },
  },
}));

// Exporting Default Navbar to the App.js File
export const NavComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{ color: '#212529' }}>
      <AppBar position="sticky" style={{ background: 'rgb(16, 16, 32)' }}>
        <Toolbar variant="dense" style={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            style={{
              fontFamily: 'monospace',
              animation: 'glow 2s ease-in-out infinite alternate',
              marginLeft: '0.5vw',
            }}
            onClick={() => (window.location.href = '/')}
          >
            <div className="landingNavMenu">Neo Base</div>
          </Typography>

          <Typography
            variant="h6"
            color="inherit"
            style={{
              fontFamily: 'monospace',
              animation: 'glow 2s ease-in-out infinite alternate',
            }}
            className="landingNavMenu"
          >
            NFT Generator
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
