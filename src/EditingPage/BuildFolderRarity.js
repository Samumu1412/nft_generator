import React from 'react';
import { ObjectContext } from './EditingPage';
import TreeItem from '@material-ui/lab/TreeItem';
import { Typography, TextField, ListItem } from '@material-ui/core';
import PropTypes from 'prop-types';

import './buildFolder.css';

export const FoldersRarity = ({ treeChildren }) => {
  const { disPatchTree, numberOfCopies } = React.useContext(ObjectContext);

  const handleRaritySet = (folderIndex, subfolderIndex, val) => {
    disPatchTree({
      type: 'update',
      value: val,
      folderIndex: folderIndex,
      subfolderIndex: subfolderIndex,
    });
  };

  return (
    <div>
      {treeChildren &&
        treeChildren.map((folder, index1) => (
          <div key={folder.name}>
            <ListItem button component="a" href="#">
              <Typography
                className="rarityFolder"
                style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
              >
                {`${
                  folder.name.slice(0, 1).toUpperCase() + folder.name.slice(1)
                } ${numberOfCopies.value} Copies`}
              </Typography>
            </ListItem>

            {folder.children.map((subfolder, index2) => (
              <div key={subfolder.name}>
                <ListItem button component="a" href="#">
                  <img
                    src={require(`.${subfolder.path.slice(15)}`)}
                    alt="item"
                    style={{ maxWidth: '40%' }}
                  />
                  <Typography
                    className="elementSubfolder"
                    style={{
                      fontFamily: 'monospace',
                      maxWidth: '30%',
                    }}
                  >
                    {subfolder.name}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: 'monospace',
                      maxWidth: '10%',
                      marginLeft: '3%',
                      color: 'rgb(172, 172, 172)',
                    }}
                  >
                    Rarity:
                  </Typography>
                  <div
                    style={{
                      width: '25%',
                      paddingLeft: '2%',
                      color: 'white',
                    }}
                  >
                    <TextField
                      className="rarityText"
                      size="small"
                      variant="outlined"
                      inputProps={{ style: { textAlign: 'center' } }}
                      placeholder="how many should there be?"
                      onBlur={(event) => {
                        handleRaritySet(index1, index2, event.target.value);
                      }}
                    />
                  </div>
                </ListItem>
              </div>
            ))}
            <TreeItem
              nodeId="1"
              label={
                <ListItem root="true" component="a" href="#">
                  <Typography styles={{ backgroundColor: '#034b92' }}>
                    {' '}
                  </Typography>
                </ListItem>
              }
            />
          </div>
        ))}
    </div>
  );
};

FoldersRarity.propTypes = {
  treeChildren: PropTypes.array.isRequired,
};
