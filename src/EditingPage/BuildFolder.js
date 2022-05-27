import React, { useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import { ObjectContext } from './EditingPage';
import TreeItem from '@material-ui/lab/TreeItem';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import './buildFolder.css';

export const Folders = ({ treeChildren }) => {
  const { disPatchObjects } = useContext(ObjectContext);

  const handleClick = (folder, subfolder) => {
    //console.log(objects, "folder: ", folder, subfolder, "index: ", index);
    disPatchObjects({
      type: 'update',
      nameToFind: folder,
      valueToChange: 'path',
      currentSlide: subfolder.path.slice(3),
    });
  };

  // console.log(folderStructure);

  return (
    <div>
      {treeChildren &&
        treeChildren.map((folder) => (
          <div key={folder.name}>
            <ListItem button component="a" href="#">
              <Typography
                className="element"
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={{
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  backgroundColor: '#102841',
                }}
              >
                {folder.name.slice(0, 1).toUpperCase() + folder.name.slice(1)}
              </Typography>
            </ListItem>

            {folder.children.map((subfolder) => (
              <div
                onClick={() => handleClick(folder.name, subfolder)}
                key={subfolder.name}
              >
                <ListItem button component="a" href="#">
                  <Typography
                    className="elementSubfolder"
                    style={{
                      fontFamily: 'monospace',
                    }}
                  >
                    {subfolder.name}
                  </Typography>
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

Folders.propTypes = {
  treeChildren: PropTypes.array,
};
