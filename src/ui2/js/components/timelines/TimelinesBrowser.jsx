import React from 'react';
import { connect } from "react-redux";

import ManagedTree from '../ui/ManagedTree';

function TimelinesBrowser(props) {
  const { timelines } = props;
  const contents = timelines.map(({ id, name }) => ({
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

const mapStateToProps = ({ timelines }) => ({ timelines });

export default connect(mapStateToProps)(TimelinesBrowser);
