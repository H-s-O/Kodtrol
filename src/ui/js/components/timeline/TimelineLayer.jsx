import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import classNames from 'classnames'
import { isFunction } from 'lodash';
import { remote } from 'electron';
import percentString from '../../lib/percentString';
import TimelineBlock from './TimelineBlock';
import TimelineTrigger from './TimelineTrigger';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  index: PropTypes.number,
  totalLayers: PropTypes.number,
  duration: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onDeleteLayer: PropTypes.func,
  onDeleteBlock: PropTypes.func,
  onEditBlock: PropTypes.func,
  onAdjustBlock: PropTypes.func,
  onCopyBlock: PropTypes.func,
  onPasteBlock: PropTypes.func,
  onDeleteTrigger: PropTypes.func,
  onEditTrigger: PropTypes.func,
  onAdjustTrigger: PropTypes.func,
  onCopyTrigger: PropTypes.func,
  onPasteTrigger: PropTypes.func,
};

const defaultProps = {
  index: 0,
  totalLayers: 0,
  duration: 0,
  data: null,
  onDeleteLayer: null,
  onDeleteBlock: null,
  onEditBlock: null,
  onAdjustBlock: null,
  onCopyBlock: null,
  onPasteBlock: null,
  onDeleteTrigger: null,
  onEditTrigger: null,
  onAdjustTrigger: null,
  onCopyTrigger: null,
  onPasteTrigger: null,
};

class TimelineLayer extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onDeleteLayerClick() {
    const { onDeleteLayer, index } = this.props;
    if (isFunction(onDeleteLayer)) {
      onDeleteLayer(index);
    }
  }

  onTimelineLayerContextMenu(e) {
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Delete layer',
      click: this.onDeleteLayerClick,
    }));

    e.stopPropagation();
    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  renderTimelineItem(item, index) {
    if ('script' in item) {
      return this.renderTimelineLayerBlock(item, index);
    } else if ('trigger' in item) {
      return this.renderTimelineLayerTrigger(item, index);
    } else if ('curve' in item) {
      // @TODO
    }
  }

  renderTimelineLayerBlock(block, index) {
    const { duration, onEditBlock, onDeleteBlock, onAdjustBlock, onCopyBlock, onPasteBlock } = this.props;
    return (
      <TimelineBlock
        key={`block-${index}`}
        data={block}
        index={index}
        layerDuration={duration}
        onEditBlock={onEditBlock}
        onDeleteBlock={onDeleteBlock}
        onAdjustBlock={onAdjustBlock}
        onCopyBlock={onCopyBlock}
        onPasteBlock={onPasteBlock}
      />
    );
  }

  renderTimelineLayerTrigger(trigger, index) {
    const { duration, onEditTrigger, onDeleteTrigger, onAdjustTrigger, onCopyTrigger, onPasteTrigger } = this.props;
    return (
      <TimelineTrigger
        key={`trigger-${index}`}
        data={trigger}
        index={index}
        layerDuration={duration}
        onEditTrigger={onEditTrigger}
        onDeleteTrigger={onDeleteTrigger}
        onAdjustTrigger={onAdjustTrigger}
        onCopyTrigger={onCopyTrigger}
        onPasteTrigger={onPasteTrigger}
      />
    );
  }

  render() {
    const { index, totalLayers, data } = this.props;
    const layersCount = Math.max(4, totalLayers);
    const layerHeight = (1 / layersCount);
    const top = percentString(1 - ((index + 1) * layerHeight));
    const height = percentString(layerHeight * 0.9);
    return (
      <div
        className={styles.timelineLayer}
        style={{ top, height }}
        onContextMenu={this.onTimelineLayerContextMenu}
      >
        { data ? data.map(this.renderTimelineItem) : null }
      </div>
    );
  }
}

TimelineLayer.propTypes = propTypes;
TimelineLayer.defaultProps = defaultProps;

export default TimelineLayer;
