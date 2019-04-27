import React, { PureComponent } from 'react';

import percentString from '../../lib/percentString';
import LayerEditor from '../partials/layer_editor/LayerEditor';

import styles from '../../../styles/components/timeline/timelinewrapper.scss';

class TimelineWrapper extends PureComponent {
  timelineContainer = null;
  timelineCursorTracker = null;
  
  getTimelineScreenXFromEvent = (e) => {
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft } = this.timelineContainer;
    
    const pos = (clientX - left + scrollLeft);
    return pos;
  }
  
  getTimelinePercentFromEvent = (e) => {
    const { timelineData } = this.props;
    const { zoom } = timelineData;
    
    const { clientX } = e;
    const { left } = this.timelineContainer.getBoundingClientRect();
    const { scrollLeft, scrollWidth } = this.timelineContainer;
    
    const percent = (clientX - left + scrollLeft) / scrollWidth;
    return percent;
  }
  
  onContainerDoubleClick = (e) => {
    const { timelineUpdatePosition } = this.props;
    timelineUpdatePosition(e);
  }
  
  onContainerMouseMove = (e) => {
    const { timelineData } = this.props;
    if (timelineData) {
      const cursorPos = this.getTimelineScreenXFromEvent(e);
      this.timelineCursorTracker.style = `left:${cursorPos}px`;
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
    const { duration, zoom } = timelineData;
    
    const left = percentString((position / duration) * zoom);
    
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

export default TimelineWrapper;
