import React from 'react';
import { connect } from "react-redux";

import ManagedTree from '../ui/ManagedTree';

function MediasBrowser(props) {
  const { medias } = props;
  const items = medias.map(({ id, name }) => ({
    id,
    key: id,
    depth: 0,
    label: name,
  }));

  return (
    <ManagedTree
      items={items}
    />
  );
}

const mapStateToProps = ({ medias }) => ({ medias });

export default connect(mapStateToProps)(MediasBrowser);
