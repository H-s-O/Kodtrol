import React from "react";
import { Empty } from "antd";

const styles = { image: { height: "auto", fontSize: "50px", color: "rgba(255, 255, 255, 0.45)" } };

export default function Placeholder({ icon, description, ...props }) {
  return (
    <Empty
      styles={styles}
      image={icon}
      // title="Script Editor"
      description={description}
      {...props}
    />
  );
}
