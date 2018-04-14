import React from 'react';
import { Panel } from 'react-bootstrap';

export default props => (
  <Panel className={props.className}>
    { props.title && (
      <Panel.Heading
        className="clearfix"
      >
        <Panel.Title
          componentClass="h3"
          className="pull-left"
        >
          { props.title }
        </Panel.Title>
        { props.headingContent }
      </Panel.Heading>
    )}
    { props.children }
  </Panel>
);
