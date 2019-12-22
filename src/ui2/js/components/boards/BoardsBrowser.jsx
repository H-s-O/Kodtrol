import React from 'react';
import { connect } from "react-redux";

import ManagedTree from '../ui/ManagedTree';

function BoardsBrowser(props) {
  const { boards } = props;
  const contents = boards.map(({ id, name }) => ({
    id,
    key: id,
    depth: 0,
    label: name,
  }));

  return (
    <ManagedTree
      contents={contents}
    />
  );
}

const mapStateToProps = ({ boards }) => ({ boards });

export default connect(mapStateToProps)(BoardsBrowser);
