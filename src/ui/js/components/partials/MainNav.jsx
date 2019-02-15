import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Button, Glyphicon, Label } from 'react-bootstrap';

import { updateConfigModal } from '../../../../common/js/store/actions/modals';

import styles from '../../../styles/components/partials/mainnav.scss';

class MainNav extends PureComponent {
  renderOutputs = () => {
    const { outputs } = this.props;
    
    if (outputs) {
      if (outputs.length === 1) {
        return (
          <Label bsStyle="success">
            1 output
          </Label>
        );
      } else if (outputs.length > 1) {
        return (
          <Label bsStyle="success">
            { outputs.length } outputs
          </Label>
        );
      }
    }
    
    return (
      <Label bsStyle="danger">
        No outputs
      </Label>
    );
  }
  
  renderInputs = () => {
    const { inputs } = this.props;
    
    if (inputs) {
      if (inputs.length === 1) {
        return (
          <Label>
            1 input
          </Label>
        );
      } else if (inputs.length > 1) {
        return (
          <Label>
            { inputs.length } inputs
          </Label>
        );
      }
    }
    
    return (
      <Label>
        No inputs
      </Label>
    );
  }
  
  render = () => {
    const { doShowConfigModal } = this.props;
    
    return (
      <Navbar fluid className={styles.navbar}>
        <Navbar.Header className={styles.header}>
          <Navbar.Brand className={styles.brand}>
            Kodtrol
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <div className={styles.centerContent}>
            <Navbar.Text className={styles.text}>
              { this.renderOutputs() }
            </Navbar.Text>
            <Navbar.Text className={styles.text}>
              { this.renderInputs() }
            </Navbar.Text>
          </div>
          <Navbar.Form pullRight>
            <Button bsSize="xs" onClick={doShowConfigModal}>
              <Glyphicon glyph="cog"/>
            </Button>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = ({outputs, inputs}) => {
  return {
    outputs,
    inputs,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    doShowConfigModal: () => dispatch(updateConfigModal(true)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
