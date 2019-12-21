import React from 'react';
import { connect } from "react-redux";

import ManagedTree from '../ui/ManagedTree';

function ScriptsBrowser(props) {
  const { scripts } = props;
  const contents = scripts.map(({ id, name }) => ({
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

const mapStateToProps = ({ scripts }) => ({ scripts });

export default connect(mapStateToProps)(ScriptsBrowser);
