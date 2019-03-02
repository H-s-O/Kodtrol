import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Button, Glyphicon, Label } from 'react-bootstrap';

import { updateConfigModal } from '../../../../common/js/store/actions/modals';

import styles from '../../../styles/components/partials/mainnav.scss';

class MainNav extends PureComponent {
  renderOutputs = () => {
    const { outputs } = this.props;
    
    if (outputs && outputs.length) {
      return outputs.map(({name}, index) => {
        return (
          <Label bsStyle="success" key={`output-${index}`}>
            { name } <Glyphicon glyph="log-out" />
          </Label>
        );
      })
    }
    
    return (
      <Label bsStyle="danger">
        No outputs
      </Label>
    );
  }
  
  renderInputs = () => {
    const { inputs } = this.props;
    
    if (inputs && inputs.length) {
      return inputs.map(({name}, index) => {
        return (
          <Label key={`input-${index}`}>
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
