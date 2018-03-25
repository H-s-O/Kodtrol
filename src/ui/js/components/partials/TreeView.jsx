import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';

import styles from '../../../styles/components/partials/treeview.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
  onClickItem: PropTypes.func,
};

const defaultProps = {
  value: [],
  onClickItem: null,
};

class TreeView extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onClickItem(it) {
    const { onClickItem } = this.props;
    if (onClickItem) {
      onClickItem(it);
    }
  }

  renderItem(it, index) {
    return (
      <ListGroupItem
        key={index}
        className={styles.listItem}
        onClick={() => this.onClickItem(it)}
      >
      { it.icon && (
        <Glyphicon
          glyph={it.icon}
        />
      )}
      { it.label }
      </ListGroupItem>
    );
  }

  render() {
    const { value } = this.props;
    return (
      <ListGroup>
        { value.map(this.renderItem) }
      </ListGroup>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;
