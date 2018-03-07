import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

export default props => (
  <Jumbotron>
    <h1>Welcome!</h1>
    <p>
      New to [software]? Why not learn more on how to use this software, or go create
      your first script right away!
    </p>
    <p>
      <Button bsStyle="primary">Create new script</Button>
      <Button bsStyle="default">Learn more</Button>
    </p>
  </Jumbotron>
);
