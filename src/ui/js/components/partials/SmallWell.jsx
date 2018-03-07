import React from 'react';
import { Well } from 'react-bootstrap';

import styles from './smallwell.scss';

export default props => (
  <Well bsSize="small" className={styles.fullHeight}>
    { props.children }
  </Well>
);
