import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { remote } from 'electron';

import percentString from '../../lib/percentString';
import { deleteWarning } from '../../lib/messageBoxes';
import TimelineBlock from './TimelineBlock';
import TimelineTrigger from './TimelineTrigger';
import TimelineCurve from './TimelineCurve';
import TimelineAudioTrack from './TimelineAudioTrack';
import timelineConnect from './timelineConnect';

import styles from '../../../styles/components/timeline/timelinelayer.scss';

const propTypes = {
  duration: PropTypes.number,
  data: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  duration: 0,
  data: null,
  items: null,
};

class TimelineLayer extends PureComponent {
  onDeleteLayerClick = () => {
    const { data } = this.props;
    const { order } = data;
    deleteWarning(
      `Are you sure you want to delete layer ${order + 1} ? Deleting a layer will also delete all its items.`,
      (result) => {
        if (result) {
          this.doDeleteLayer();
        }
      }
    );
  }
  
  doDeleteLayer = () => {
    const { timelineDeleteLayer, data } = this.props;
    const { id } = data;
    timelineDeleteLayer(id);
  }
  
  onAddBlockHereClick = (e) => {
    this.doAddItemAt('block', e);
  }
  
  onAddTriggerHereClick = (e) => {
    this.doAddItemAt('trigger', e);
  }
  
  onAddCurveHereClick = (e) => {
    this.doAddItemAt('curve', e);
  }
  
  doAddItemAt = (type, e) => {
    const { timelineAddItemAt, data } = this.props;
    const { id } = data;
    timelineAddItemAt(id, type, e);
  }
  
  onAddLayerAboveClick = () => {
    const { timelineAddLayer, index } = this.props;
    timelineAddLayer(index + 1);
  }
  
  onAddLayerBelowClick = () => {
    const { timelineAddLayer, index } = this.props;
    timelineAddLayer(index);
  }
  
  onTimelineLayerContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.persist(); // needed so that it can be forwarded for "add here"
    
    const { Menu, MenuItem } = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Add layer above',
      click: this.onAddLayerAboveClick,
    }));
    menu.append(new MenuItem({
      label: 'Add layer below',
      click: this.onAddLayerBelowClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Delete layer...',
      click: this.onDeleteLayerClick,
    }));
    menu.append(new MenuItem({
      type: 'separator',
    }));
    menu.append(new MenuItem({
      label: 'Add block here...',
      click: () => this.onAddBlockHereClick(e),
    }));
    menu.append(new MenuItem({
      label: 'Add trigger here...',
      click: () => this.onAddTriggerHereClick(e),
    }));
    menu.append(new MenuItem({
      label: 'Add curve here...',
      click: () => this.onAddCurveHereClick(e),
    }));
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  renderTimelineItem = (item, index) => {
    if ('script' in item) {
      return this.renderTimelineLayerBlock(item, index);
    } else if ('trigger' in item) {
      return this.renderTimelineLayerTrigger(item, index);
    } else if ('curve' in item) {
      return this.renderTimelineLayerCurve(item, index);
    } else if ('file' in item) {
      return this.renderTimelineLayerAudioTrack(item, index);
    }
    return null;
  }

  renderTimelineLayerBlock = (block, index) => {
    const { duration } = this.props;
    return (
      <TimelineBlock
        key={`block-${index}`}
        data={block}
        layerDuration={duration}
      />
    );
  }

  renderTimelineLayerTrigger = (trigger, index) => {
    const { duration } = this.props;
    return (
      <TimelineTrigger
        key={`trigger-${index}`}
        data={trigger}
        layerDuration={duration}
      />
    );
  }

  renderTimelineLayerCurve = (curve, index) => {
    const { duration } = this.props;
    return (
      <TimelineCurve
        key={`curve-${index}`}
        data={curve}
        layerDuration={duration}
      />
    );
  }

  renderTimelineLayerAudioTrack = (audioTrack, index) => {
    const { duration } = this.props;
    return (
      <TimelineAudioTrack
        key={`audio-${index}`}
        data={audioTrack}
        layerDuration={duration}
      />
    );
  }

  render = () => {
    const { items, style } = this.props;
    
    return (
      <div
        style={style}
        className={styles.timelineLayer}
        onContextMenu={this.onTimelineLayerContextMenu}
      >
        { items && items.length ? items.map(this.renderTimelineItem) : null }
      </div>
    );
  }
}

TimelineLayer.propTypes = propTypes;
TimelineLayer.defaultProps = defaultProps;

export default timelineConnect(TimelineLayer);
