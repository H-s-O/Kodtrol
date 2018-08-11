import React, { PureComponent } from 'react';
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
  renderActions: PropTypes.func,
};

const defaultProps = {
  value: [],
  onClickItem: null,
  actions: null,
  style: null,
  renderActions: null,
};

class TreeView extends PureComponent {
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
    const { renderActions } = this.props;
    return (
      <li
        key={index}
        className={classNames({
          'list-group-item': true,
          'active': it.active,
          [styles.item]: true,
        })}
        onClick={() => this.onClickItem(it)}
      >
      { it.icon ? (
        <Glyphicon
          glyph={it.icon}
        />
      ) : null }
      <span
        className={styles.itemLabel}
      >
        { it.label }
      </span>
      { renderActions ? (
        <div
          className={styles.actions}
        >
          { renderActions(it) }
        </div>
      ) : null }
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
