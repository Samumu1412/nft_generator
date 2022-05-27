import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { List, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { TreeView } from '@material-ui/lab';
import PropTypes from 'prop-types';

import { FoldersRarity } from './BuildFolderRarity';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    paddingTop: 5,
  },
}));

export default function TreesTempRarity({ folderData }) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const treeData = folderData;

  return (
    <div className={classes.root} style={{ marginTop: '20px' }}>
      <div
        style={{
          justifyContent: 'center',
          display: 'flex',
          fontWeight: 'bold',
          fontSize: '20px',
          fontFamily: 'monospace',
          color: '#fff',
        }}
      >
        Rarity Control
      </div>
      <List>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<IconButton />}
          defaultExpandIcon={<MenuIcon />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <FoldersRarity treeChildren={treeData && treeData.children} />
        </TreeView>
      </List>
    </div>
  );
}

TreesTempRarity.propTypes = {
  folderData: PropTypes.object,
};
