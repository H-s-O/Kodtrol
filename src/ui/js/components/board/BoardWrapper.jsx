import React, { PureComponent } from 'react';

import percentString from '../../lib/percentString';
import LayerEditor from '../partials/layer_editor/LayerEditor';

import styles from '../../../styles/components/board/boardwrapper.scss';

class BoardWrapper extends PureComponent {
  render = () => {
    const { 
      boardData,
      layerEditorOnChange,
      layerEditorRef,
      layerEditorRenderItemComponent,
      layerEditorRenderLayerContextMenu,
    } = this.props;
    const { zoom, zoomVert, layers, items } = boardData;

    return (
      <div
        className={styles.wrapper}
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
      </div>
    );
  }
}

export default BoardWrapper;
