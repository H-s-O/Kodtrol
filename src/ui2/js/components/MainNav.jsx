import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Button, Alignment, Tag } from '@blueprintjs/core';

import { updateConfigModal } from '../../../common/js/store/actions/modals';
import { IO_DISCONNECTED, IO_CONNECTED, IO_ACTIVITY } from '../../../common/js/constants/io';
import TagGroup from './ui/TagGroup';

const getStatusIntent = (status) => {
  switch (status) {
    case IO_DISCONNECTED: return 'danger'; break;
    case IO_CONNECTED: return 'success'; break;
    case IO_ACTIVITY: return 'primary'; break;
    default: return null; break;
  }
}

const renderOutputs = (props) => {
  const { outputs, ioStatus } = props;

  if (outputs && outputs.length) {
    return (
      <TagGroup>
        {outputs.map(({ id, name }, index) => {
          const status = id in ioStatus ? ioStatus[id] : null;

          return (
            <Tag
              minimal
              key={`output-${index}`}
              intent={getStatusIntent(status)}
              rightIcon="log-out"
            >
              {name}
            </Tag>
          );
        })}
      </TagGroup>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No outputs
    </span>
  );
}

const renderInputs = (props) => {
  const { inputs, ioStatus } = props;

  if (inputs && inputs.length) {
    return (
      <TagGroup>
        {inputs.map(({ id, name }, index) => {
          const status = id in ioStatus ? ioStatus[id] : null;

          return (
            <Tag
              minimal
              key={`input-${index}`}
              intent={getStatusIntent(status)}
              icon="log-in"
            >
              {name}
            </Tag>
          );
        })}
      </TagGroup>
    )
  }

  return (
    <span
      className="bp3-text-muted"
    >
      No inputs
    </span>
  );
}

function MainNav(props) {
  const { doShowConfigModal } = props;

  return (
    <Navbar>
      <Navbar.Group>
        <Navbar.Heading>
          Kodtrol
        </Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group
        align={Alignment.RIGHT}
      >
        {renderInputs(props)}
        <Navbar.Divider />
        {renderOutputs(props)}
        <Navbar.Divider />
        <Button
          small
          icon="cog"
          onClick={doShowConfigModal}
        />
      </Navbar.Group>
    </Navbar>
  );
}

const mapStateToProps = ({ outputs, inputs, ioStatus }) => {
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
