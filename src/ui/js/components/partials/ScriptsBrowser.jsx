import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button, Glyphicon } from 'react-bootstrap';
import Panel from './Panel';
import TreeView from './TreeView';

import styles from '../../../styles/components/partials/scriptsbrowser.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onScriptSelect: PropTypes.func,
};

const defaultProps = {
  value: [],
  onScriptSelect: null,
};

class ScriptsBrowser extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onScriptSelect(name) {
    const { onScriptSelect } = this.props;
    if (onScriptSelect) {
      onScriptSelect(name);
    }
  }

  onAddClick() {
    prompt('Enter script name');
  }

  render() {
    const { value, onScriptSelect } = this.props;
    return (
      <Panel
        title="Scripts"
        className={styles.fullHeight}
        headingContent={
          <div
            className="pull-right"
          >
            <Button
              bsSize="xsmall"
              onClick={this.onAddClick}
            >
              <Glyphicon
                glyph="plus"
              />
            </Button>
          </div>
        }
      >
        <TreeView
          value={value}
          onClickItem={(it) => this.onScriptSelect(it.label)}
        />
      </Panel>
    );
  }
};

ScriptsBrowser.propTypes = propTypes;
ScriptsBrowser.defaultProps = defaultProps;

export default ScriptsBrowser;
