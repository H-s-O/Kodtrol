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
  const { devices, devicesFolders } = props;
  const items = devices.map(({ id, name, groups }) => ({
    id,
    key: id,
    label: name,
    secondaryLabel: generateTags(groups),
  }));
  const folders = devicesFolders.map(({ id, name }) => ({
    id,
    key: id,
    label: name,
    hasCaret: true,
    isExpanded: false,
    icon: 'folder-close',
  }));

  return (
    <ManagedTree
      items={items}
      folders={folders}
    />
  );
}

const mapStateToProps = ({ devices, devicesFolders }) => ({ devices, devicesFolders });

export default connect(mapStateToProps)(DevicesBrowser);
