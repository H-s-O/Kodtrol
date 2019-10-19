import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Button, Glyphicon, Label } from 'react-bootstrap';

import { updateConfigModal } from '../../../../common/js/store/actions/modals';
import * as IOStatus from '../../../../common/js/constants/io';

import styles from '../../../styles/components/partials/mainnav.scss';

class MainNav extends PureComponent {
  getStatusStyle = (status) => {
    switch(status) {
      case IOStatus.IO_DISCONNECTED: return 'danger'; break;
      case IOStatus.IO_CONNECTED: return 'success'; break;
      case IOStatus.IO_ACTIVITY: return 'info'; break;
      default: return 'default'; break;
    }
  }

  renderOutputs = () => {
    const { outputs, ioStatus } = this.props;
    
    if (outputs && outputs.length) {
      return outputs.map(({id, name}, index) => {
        const status = id in ioStatus ? ioStatus[id] : null;

        return (
          <Label
            key={`output-${index}`}
            className={styles.tags}
            bsStyle={this.getStatusStyle(status)}
          >
            { name } <Glyphicon glyph="log-out" />
          </Label>
        );
      })
    }
    
    return (
      <Label bsStyle="warning">
        No outputs
      </Label>
    );
  }
  
  renderInputs = () => {
    const { inputs, ioStatus } = this.props;
    
    if (inputs && inputs.length) {
      return inputs.map(({id, name}, index) => {
        const status = id in ioStatus ? ioStatus[id] : null;

        return (
          <Label
            key={`input-${index}`}
            className={styles.tags}
            bsStyle={this.getStatusStyle(status)}
          >
            <Glyphicon glyph="log-in" /> { name }
          </Label>
        );
      });
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
            <strong>Kodtrol</strong>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <div className={styles.centerContent}>
            <Navbar.Text className={styles.text}>
              { this.renderInputs() }
            </Navbar.Text>
            <Navbar.Text className={styles.text}>
              { this.renderOutputs() }
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

const mapStateToProps = ({outputs, inputs, ioStatus}) => {
  return {
    outputs,
    inputs,
    ioStatus,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    doShowConfigModal: () => dispatch(updateConfigModal(true)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
