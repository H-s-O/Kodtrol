import React from 'react';
import { connect } from "react-redux";
import { Tag } from "@blueprintjs/core";

import TagGroup from '../ui/TagGroup';
import ManagedTree from '../ui/ManagedTree';

const generateTags = (groups) => {
  return (
    <TagGroup>
      {groups.map((group, index) => {
        return (
          <Tag
            minimal
            key={index}
          >
            {group}
          </Tag>
        );
      })}
    </TagGroup>
  );
}

function DevicesBrowser(props) {
  const { devices } = props;
  const contents = devices.map(({ id, name, groups }) => ({
    id,
    key: id,
    depth: 0,
    label: name,
    // icon: 'music',
    secondaryLabel: generateTags(groups),
  }));

  return (
    <ManagedTree
      contents={contents}
    />
  );
}

const mapStateToProps = ({ devices }) => ({ devices });

export default connect(mapStateToProps)(DevicesBrowser);
