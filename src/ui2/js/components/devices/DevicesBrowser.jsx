import React from 'react';
import { connect } from "react-redux";
import { Tag, Button } from "@blueprintjs/core";

import TagGroup from '../ui/TagGroup';
import ManagedTree from '../ui/ManagedTree';

const generateTagsAndActions = (tags) => {
  return (
    <>
      <TagGroup>
        {tags.map((tag, index) => {
          return (
            <Tag
              minimal
              key={index}
            >
              {tag}
            </Tag>
          );
        })}
      </TagGroup>
      <Button
        small
        minimal
        icon="eye-open"
      />
    </>
  );
}

function DevicesBrowser(props) {
  const { devices, devicesFolders } = props;
  const items = devices.map(({ id, name, tags }) => ({
    id,
    key: id,
    label: name,
    secondaryLabel: generateTagsAndActions(tags),
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
