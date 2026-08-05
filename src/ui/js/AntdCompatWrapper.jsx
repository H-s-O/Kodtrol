/**
 * This top-level wrapper component is for Ant Design to properly render
 * on the older Chromium version in Kodtrol's Electron
 */

import React from 'react';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';

const transformers = [legacyLogicalPropertiesTransformer];

export default function AntdCompatWrapper(props) {
  return (
    <StyleProvider
      hashPriority="high"
      transformers={transformers}
      {...props}
    />
  );
};