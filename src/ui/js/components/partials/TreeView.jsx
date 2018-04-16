import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import classNames from 'classnames'
import { isFunction } from 'lodash';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';

import styles from '../../../styles/components/partials/treeview.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onClickItem: PropTypes.func,
  actions: PropTypes.node,
  style: PropTypes.shape({}),
};

const defaultProps = {
  value: [],
  onClickItem: null,
  actions: null,
  style: null,
};

class TreeView extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onClickItem(it) {
    const { onClickItem } = this.props;
    if (isFunction(onClickItem)) {
      onClickItem(it);
    }
  }

  renderItem(it, index) {
    const { actions } = this.props;
    return (
      <li
        key={index}
        className={classNames({
          'list-group-item': true,
        })}
        onClick={() => this.onClickItem(it)}
      >
      { it.icon && (
        <Glyphicon
          glyph={it.icon}
        />
      )}
      <span
        className={styles.itemLabel}
      >
        { it.label }
      </span>
      { actions }
      </li>
    );
  }

  render() {
    const { value, style } = this.props;
    return (
      <ListGroup
        componentClass="ul"
        style={style}
      >
        { value.map(this.renderItem) }
      </ListGroup>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;
