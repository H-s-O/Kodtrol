import React from 'react';
import { Card } from "antd";

const style = { height: '100%' }
const styles = { body: { height: '100%' } }

export default function FullHeightCard(props) {
  return (
    <Card style={style} styles={styles} {...props} />
  )
};
