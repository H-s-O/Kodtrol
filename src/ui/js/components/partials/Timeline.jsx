import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import Panel from './Panel';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  value: [
    {
      icon: 'file',
      label: 'premier script',
    },
    {
      icon: 'file',
      label: '2e script',
    }
  ],
};

const Timeline = props => (
  <Panel
    title="Timeline"
    headingContent={
      <Button
        className="pull-right"
        bsSize="xsmall"
      >
        <Glyphicon
          glyph="cog"
        />
      </Button>
    }
  >
    { props.children }
  </Panel>
);

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;
