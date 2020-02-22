import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import percentString from '../../lib/percentString';
import LayerEditor from '../partials/layer_editor/LayerEditor';

import styles from '../../../styles/components/timeline/timelinewrapper.scss';

const propTypes = {
  timelineUpdatePosition: PropTypes.func,
};

class TimelineWrapper extends PureComponent {
  timelineContainer = null;
  timelineCursorTracker = null;

  componentDidUpdate = (prevProps, prevState) => {
    // Hide and reset the position of the timeline tracker, which
    // prevents the wrapper from overflowing after a zoom change
    const { timelineData: prevTimelineData } = prevProps;
    const { timelineData: currentTimelineData } = this.props;
    if (prevTimelineData.zoom !== currentTimelineData.zoom) {
      this.timelineCursorTracker.style = 'left:0px;visibility:hidden;';
    }
  }

  ///////////////////////////////////////////////////////////////
  // EVENT HANDLERS

  onContainerDoubleClick = (e) => {
    this.doUpdateTimelinePosition(e);
  }
  
  onContainerMouseMove = (e) => {
    this.doUpdateTimelineCursor(e);
  }

  //////////////////////////////////////////////////////////////
  // ACTIONS
  
  getTimelineScreenXFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft } = this.timelineContainer;
    
    const pos = (clientX - left + scrollLeft);
    return pos;
  }
  
  getTimelinePercentFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft, scrollWidth } = this.timelineContainer;
    
    const percent = (clientX - left + scrollLeft) / scrollWidth;
    return percent;
  }

  doUpdateTimelinePosition = (e) => {
    const { timelineUpdatePosition } = this.props;
    timelineUpdatePosition(e);
  }

  doUpdateTimelineCursor = (e) => {
    const { timelineData } = this.props;
    if (timelineData) {
      const cursorPos = this.getTimelineScreenXFromEvent(e);
      this.timelineCursorTracker.style = `left:${cursorPos}px;visibility:visible;`;
    }
  }
  
  ////////////////////////////////////////////////////////////////
  // RENDERS

  setTimelineCursorTrackerRef = (ref) => {
    this.timelineCursorTracker = ref;
  }
  
  renderTimelineCursorTracker = () => {
    return (
      <div
        ref={this.setTimelineCursorTrackerRef}
        className={styles.timelineCursorTracker}
      >
      </div>
    )
  }
  
  renderTimelineTracker = () => {
    const { timelineInfo, timelineData } = this.props;
    const { position } = timelineInfo;
    const { duration } = timelineData;
    
    const left = percentString(position / duration);
    
    return (
      <div
        className={styles.timelineTracker}
        style={{
          left
        }}
      >
        <div
          className={styles.arrow}
        >
        </div>
      </div>
    );
  }
  
  setTimelineContainerRef = (ref) => {
    this.timelineContainer = ref;
  }
  
  render = () => {
    const { 
      timelineData,
      layerEditorOnChange,
      layerEditorRef,
      layerEditorRenderItemComponent,
      layerEditorRenderLayerContextMenu,
    } = this.props;
    const { zoom, zoomVert, layers, items } = timelineData;

    return (
      <div
        ref={this.setTimelineContainerRef}
        className={styles.wrapper}
        onDoubleClick={this.onContainerDoubleClick}
        onMouseMove={this.onContainerMouseMove}
        style={{
          width: percentString(zoom),
          height: percentString(zoomVert),
        }}
      >
        <LayerEditor
          ref={layerEditorRef}
          layers={layers}
          items={items}
          renderLayerContextMenu={layerEditorRenderLayerContextMenu}
          renderItemComponent={layerEditorRenderItemComponent}
          onChange={layerEditorOnChange}
        />
        { this.renderTimelineCursorTracker() }
        { this.renderTimelineTracker() }
      </div>
    );
  }
}

TimelineWrapper.propTypes = propTypes;

export default TimelineWrapper;
