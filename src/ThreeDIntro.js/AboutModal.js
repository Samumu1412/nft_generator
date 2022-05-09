import * as React from "react";
import { Backdrop } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import "../style.css"
import { map } from "lodash";

const members = [
  'roger',
  'gt',
  'vivian',
]

const intro = {
  roger: 'intro1 ...',
  gt: 'intro2...',
  vivian: 'intro3...',
}


export const AboutModalComponent = (props) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.isOpen}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className="modal-component">
            {map(members, (member, index) => (
              <div className="row" key={member} style={{ padding: 10 }}>
                <img
                  src={require(`../Assets/avatar${index+1}.png`)}
                  alt="toolpass"
                  style={{
                    zIndex: 3,
                    width: '200px',
                    height: '200px',
                    borderRadius: '200px',
                    marginRight: '20px' 
                  }}
                />
                <p className="description-text">
                  {intro[member]}
                </p>
              </div>
            ))}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
