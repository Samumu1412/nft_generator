import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { EditingPage } from './EditingPage/EditingPage';
import { Error } from './ErrorPage/Error.js';
import { Fluidity } from './LoadingPage/Fluidity';
import { ThreeData } from './ThreeDIntro.js/page';
import './EditingPage/styles.css';
import { Selection } from './SelectionPage/Selection';

export const Webpages = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ThreeData />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/editing" element={<EditingPage />} />
        <Route path="/loading" element={<Fluidity />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function WebPagesWithProvider() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Webpages />
    </Web3ReactProvider>
  );
}
export default WebPagesWithProvider;
