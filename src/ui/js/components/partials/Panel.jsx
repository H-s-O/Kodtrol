import React from 'react';
import { Panel } from 'react-bootstrap';
import classNames from 'classnames';

import styles from '../../../styles/components/partials/panel.scss';

export default (props) => {
  const { className, title, headingContent, children } = props;
  return (
    <Panel
      className={classNames({
        [className]: !!className,
        [styles.panelCol]: true,
      })}
    >
      { title && (
        <Panel.Heading
          className="clearfix"
        >
          <Panel.Title
            componentClass="h3"
            className="pull-left"
          >
            { title }
          </Panel.Title>
          { headingContent }
        </Panel.Heading>
      )}
      { children }
    </Panel>
  );
};
