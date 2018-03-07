import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import Panel from './Panel';
import TreeView from './TreeView';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

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

const ScriptsBrowser = props => (
  <Panel
    title="Scripts"
    className={styles.fullHeight}
    headingContent={
      <div
        className="pull-right"
      >
        <Button
          bsSize="xsmall"
        >
          <Glyphicon
            glyph="plus"
          />
        </Button>
      </div>
    }
  >
    <TreeView
      value={props.value}
    />
  </Panel>
);

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

export default ScriptsBrowser;
