import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';

import isFunction from '../../lib/isFunction';

import styles from '../../../styles/components/partials/treeview.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onClickItem: PropTypes.func,
  actions: PropTypes.node,
  style: PropTypes.shape({}),
  renderActions: PropTypes.func,
  renderTags: PropTypes.func,
};

const defaultProps = {
  value: [],
  onClickItem: null,
  actions: null,
  style: null,
  renderActions: null,
  renderTags: null,
};

class TreeView extends PureComponent {
  onClickItem = (it) => {
    const { onClickItem } = this.props;
    if (isFunction(onClickItem)) {
      onClickItem(it);
    }
  }

  renderItem = (it, index) => {
    const { renderActions, renderTags } = this.props;
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
      { renderTags ? (
        <div
          className={styles.tags}
        >
          { renderTags(it) }
        </div>
      ) : null }
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

  render = () => {
    const { value, className, style } = this.props;
    return (
      <ListGroup
        componentClass="ul"
        className={className}
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
