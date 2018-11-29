import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import { remote } from 'electron';

import percentString from '../../lib/percentString';
import { deleteWarning } from '../../lib/messageBoxes';
import TimelineBlock from './TimelineBlock';
import boardConnect from './boardConnect';

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

class BoardLayer extends PureComponent {
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
  
  onPasteItemHere = (e) => {
    const { timelinePasteItem, data } = this.props;
    const { id } = data;
    timelinePasteItem(id, '*', e);
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
  
  onAddAudioTrackHereClick = (e) => {
    this.doAddItemAt('audioTrack', e);
  }
  
  doAddItemAt = (type, e) => {
    const { timelineAddItemAt, data } = this.props;
    const { id } = data;
    timelineAddItemAt(id, type, e);
  }
  
  onAddLayerAboveClick = () => {
    const { timelineAddLayer, data } = this.props;
    const { order } = data;
    timelineAddLayer(order + 1);
  }
  
  onAddLayerBelowClick = () => {
    const { timelineAddLayer, data } = this.props;
    const { order } = data;
    timelineAddLayer(order);
  }
  
  onBoardLayerContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.persist(); // needed so that it can be forwarded for "add here"
    
    const { timelineCanPasteItem } = this.props;
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
      label: 'Paste item here',
      click: () => this.onPasteItemHere(e),
      enabled: timelineCanPasteItem('*'),
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
    menu.append(new MenuItem({
      label: 'Add audio track here...',
      click: () => this.onAddAudioTrackHereClick(e),
    }));
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  renderTimelineItem = (item, index) => {
    let ComponentClass = null;
    if ('script' in item) {
      ComponentClass = TimelineBlock;
    }
    
    if (ComponentClass == null) {
      return null;
    }
    
    const { duration } = this.props;
    
    return (
      <ComponentClass
        key={`item-${index}`}
        data={item}
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
        onContextMenu={this.onBoardLayerContextMenu}
      >
        { items && items.length ? items.map(this.renderTimelineItem) : null }
      </div>
    );
  }
}

BoardLayer.propTypes = propTypes;
BoardLayer.defaultProps = defaultProps;

export default boardConnect(BoardLayer);
