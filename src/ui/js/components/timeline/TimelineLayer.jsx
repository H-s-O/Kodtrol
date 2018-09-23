import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { remote } from 'electron';

import percentString from '../../lib/percentString';
import { deleteWarning } from '../../lib/messageBoxes';
import TimelineBlock from './TimelineBlock';
import TimelineTrigger from './TimelineTrigger';
import TimelineAudioTrack from './TimelineAudioTrack';

import styles from '../../../styles/components/partials/timeline.scss';

const propTypes = {
  index: PropTypes.number,
  totalLayers: PropTypes.number,
  duration: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onDeleteLayer: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onAdjustItem: PropTypes.func,
  onCopyItem: PropTypes.func,
  onPasteItem: PropTypes.func,
  onAddItemAt: PropTypes.func,
  onAddLayer: PropTypes.func,
};

const defaultProps = {
  index: 0,
  totalLayers: 0,
  duration: 0,
  data: null,
  onDeleteLayer: null,
  onDeleteItem: null,
  onEditItem: null,
  onAdjustItem: null,
  onCopyItem: null,
  onPasteItem: null,
  onAddItemAt: null,
  onAddLayer: null,
};

class TimelineLayer extends PureComponent {
  onDeleteLayerClick = () => {
    const { index } = this.props;
    deleteWarning(`Are you sure you want to delete layer ${index + 1} ?`, (result) => {
      if (result) {
        this.doDeleteLayer();
      }
    });
  }
  
  doDeleteLayer = () => {
    const { onDeleteLayer, index } = this.props;
    onDeleteLayer(index);
  }
  
  onAddBlockHereClick = (e) => {
    this.doAddItemAt('block', e);
  }
  
  onAddTriggerHereClick = (e) => {
    this.doAddItemAt('trigger', e);
  }
  
  doAddItemAt = (type, e) => {
    const { onAddItemAt, index } = this.props;
    onAddItemAt(index, type, e);
  }
  
  doEditItem = (itemIndex) => {
    const { onEditItem, index } = this.props;
    onEditItem(index, itemIndex);
  }
  
  doDeleteItem = (itemIndex) => {
    const { onDeleteItem, index } = this.props;
    onDeleteItem(index, itemIndex);
  }
  
  doAdjustItem = (itemIndex, mode) => {
    const { onAdjustItem, index } = this.props;
    onAdjustItem(index, itemIndex, mode);
  }
  
  doCopyItem = (itemIndex, mode) => {
    const { onCopyItem, index } = this.props;
    onCopyItem(index, itemIndex, mode);
  }
  
  doPasteItem = (itemIndex, mode) => {
    const { onPasteItem, index } = this.props;
    onPasteItem(index, itemIndex, mode);
  }
  
  onAddLayerAboveClick = () => {
    const { onAddLayer, index } = this.props;
    onAddLayer(index + 1);
  }
  
  onAddLayerBelowClick = () => {
    const { onAddLayer, index } = this.props;
    onAddLayer(index);
  }
  
  onTimelineLayerContextMenu = (e) => {
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

    e.stopPropagation();
    e.preventDefault();
    e.persist(); // needed so that it can be forwarded for "add here"
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
      // @TODO
    } else if ('file' in item) {
      return this.renderTimelineLayerAudioTrack(item, index);
    }
  }

  renderTimelineLayerBlock = (block, index) => {
    const { duration } = this.props;
    return (
      <TimelineBlock
        key={`block-${index}`}
        data={block}
        index={index}
        layerDuration={duration}
        onEditItem={this.doEditItem}
        onDeleteItem={this.doDeleteItem}
        onAdjustItem={this.doAdjustItem}
        onCopyItem={this.doCopyItem}
        onPasteItem={this.doPasteItem}
      />
    );
  }

  renderTimelineLayerTrigger = (trigger, index) => {
    const { duration } = this.props;
    return (
      <TimelineTrigger
        key={`trigger-${index}`}
        data={trigger}
        index={index}
        layerDuration={duration}
        onEditItem={this.doEditItem}
        onDeleteItem={this.doDeleteItem}
        onAdjustItem={this.doAdjustItem}
        onCopyItem={this.doCopyItem}
        onPasteItem={this.doPasteItem}
      />
    );
  }

  renderTimelineLayerAudioTrack = (audioTrack, index) => {
    const { duration } = this.props;
    return (
      <TimelineAudioTrack
        key={`audio-${index}`}
        data={audioTrack}
        index={index}
        layerDuration={duration}
        onEditItem={this.doEditItem}
        onDeleteItem={this.doDeleteItem}
        onAdjustItem={this.doAdjustItem}
        onCopyItem={this.doCopyItem}
        onPasteItem={this.doPasteItem}
      />
    );
  }

  render = () => {
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
