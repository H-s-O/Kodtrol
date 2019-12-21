import React from 'react';
import { connect } from "react-redux";
import { Tree, Button } from "@blueprintjs/core";

const mapStateToProps = ({ devices }) => ({ devices });

function DeviceBrowser(props) {
  const { devices } = props;
  const contents = devices.map(({ id, name }) => ({
    id,
    key: id,
    depth: 0,
    label: name,
    icon: 'music',
    secondaryLabel: <Button minimal small icon="more" />
  }));

  return (
    <Tree
      contents={contents}
    />
  );
}

export default connect(mapStateToProps)(DeviceBrowser);
