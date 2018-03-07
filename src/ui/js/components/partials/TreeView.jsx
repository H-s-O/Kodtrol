import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';

import styles from '../../../styles/components/partials/treeview.scss';

const propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  value: [],
};

const renderItem = (it, index) => (
  <ListGroupItem
    key={index}
    className={styles.listItem}
  >
    { it.icon && (
      <Glyphicon
        glyph={it.icon}
      />
    )}
    { it.label }
  </ListGroupItem>
);

const TreeView = props => (
  <ListGroup>
    { props.value.map(renderItem) }
  </ListGroup>
);

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;
