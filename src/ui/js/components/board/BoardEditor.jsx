import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, ButtonGroup, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Panel from '../partials/Panel';
import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import BoardBlockModal from './modals/BoardBlockModal';
import BoardBlock from './BoardBlock';
import { saveBoard } from '../../../../common/js/store/actions/boards';
import { updateBoardInfo, updateBoardInfoUser } from '../../../../common/js/store/actions/boardInfo';
import BoardWrapper from './BoardWrapper';

import styles from '../../../styles/components/board/boardeditor.scss';

const propTypes = {
  boardData: PropTypes.shape({}),
  boardInfo: PropTypes.shape({}),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doUpdateBoardInfo: PropTypes.func.isRequired,
  doUpdateBoardInfoUser: PropTypes.func.isRequired,
  doSaveBoard: PropTypes.func.isRequired,
};

const defaultProps = {
  boardData: null,
  boardInfo: null,
  scripts: [],
};

class BoardEditor extends PureComponent {
  layerEditor = null;
  state = {
    modalType: null,
    modalAction: null,
    modalValue: null,
    
    copyItemData: null,
    
    boardDataTemp: null,
  };

  ///////////////////////////////////////////////////////////////
  // EVENT HANDLERS

  onAddBlockClick = () => {
    this.doAddItem('block', {
      id: uniqid(), // generate new block id
    });
  }

  onPasteItemHereClick = (layerId, e) => {
    this.doPasteItem(layerId, '*', e);
  }
  
  onAddBlockHereClick = (layerId, e) => {
    this.doAddItemAt(layerId, 'block', e);
  }

  onAddLayerAtTopClick = () => {
    this.layerEditor.doAddLayer('max');
  }
  
  onAddLayerAtBottomClick = () => {
    this.layerEditor.doAddLayer('min');
  }

  onZoomLevelClick = (level) => {
    this.doSetZoomLevel(level);
  }
  
  onZoomVertLevelClick = (level) => {
    this.doSetZoomLevel(level, true);
  }

  onCopyItemClick = (itemId, mode) => {
    this.doCopyItem(itemId, mode);
  }
  
  onSaveClick = () => {
    // ?!?!
  }

  /////////////////////////////////////////////////////////
  // ACTIONS

  itemIsActive = (id) => {
    const { boardInfo } = this.props;
    const { activeItems } = boardInfo;
    return activeItems && id in activeItems;
  }

  getItem = (itemId) => {
    const { boardData } = this.props;
    const { items } = boardData;
    return items.find(({id}) => id === itemId);
  }
  
  doAddItem = (type, baseData) => {
    this.setState({
      modalType: type,
      modalValue: baseData,
      modalAction: 'add',
    });
  }

  doAddItemAt = (layerId, type, e) => {
    const data = {
      layer: layerId,
      id: uniqid(), // generate new item id
    };
    
    this.setState({
      modalType: type,
      modalValue: data,
      modalAction: 'add',
    });
  }

  doCopyItem = (itemId, mode) => {
    const item = this.getItem(itemId);
    
    let itemData;
    if (mode === '*') {
      itemData = item;
    } else {
      itemData = item[mode];
    }
    
    this.setState({
      copyItemData: itemData,
    });
  }

  doDeleteItem = (itemId) => {
    const { boardData } = this.props;
    const { items } = boardData;

    const newItems = items.filter(({id}) => id !== itemId);
    const newBoardData = {
      items: newItems,
    };
    
    this.doSave(newBoardData);
  }

  doEditItem = (itemId) => {
    const itemData = this.getItem(itemId);
    
    let type;
    if ('script' in itemData) {
      type = 'block';
    }
    
    this.setState({
      modalType: type,
      modalValue: {
        ...itemData,
      },
      modalAction: 'edit',
    });
  }
  
  itemModalSuccess = (itemData) => {
    const { boardData } = this.props;
    const { items } = boardData;
    
    // Attempt to find item index if existing
    const itemIndex = items.findIndex(({id}) => id === itemData.id); 
    
    let newItems;
    // If item does not exists, add it
    if (itemIndex === -1) {
      newItems = [
        ...items,
        itemData,
      ];
    } 
    // Update existing item
    else {
      newItems = items.map((item) => {
        if (item.id === itemData.id) {
          return itemData;
        }
        return item;
      });
    }
    
    const newBoardData = {
      items: newItems,
    };
    
    // Save timeline
    this.doSave(newBoardData);

    this.itemModalCancel();
  }
  
  itemModalCancel = () => {
    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
    });
  }
  
  canPasteItem = (mode) => {
    const { copyItemData } = this.state;
    if (copyItemData === null) {
      return false;
    } else if (mode === '*' && typeof copyItemData === 'object') {
      return true;
    } else if (mode !== '*' && typeof copyItemData === 'string') {
      return true;
    }
    return false;
  }

  // @TODO clean
  doPasteItem = (layerOrItemId, mode, e = null) => {
    const { copyItemData } = this.state;
    
    if (copyItemData !== null) {
      const { boardData } = this.props;
      const { items } = boardData;
      
      let newItem;
      let newItems;
      if (mode === '*') {
        newItem = {
          ...copyItemData,
          id: uniqid(), // override with new id
          layer: layerOrItemId,
        }
        newItems = [
          ...items,
          newItem,
        ];
      } else {
        const item = this.getItem(layerOrItemId);
        newItem = {
          ...item,
          [mode]: copyItemData,
        };
        newItems = items.map((item) => {
          if (item.id === layerOrItemId) {
            return newItem;
          }
          return item;
        });
      }
      const newBoardData = {
        ...boardData,
        items: newItems,
      };

      this.doSave(newBoardData);

      this.setState({
        copyItemData: null,
      });
    }
  }

  doSetZoomLevel = (level, vertical = false) => {
    const data = {
      [vertical ? 'zoomVert' : 'zoom']: level,
    };
    this.doSave(data);
  }

  doSave = (boardData) => {
    const { doSaveBoard, currentBoard } = this.props;
    doSaveBoard(currentBoard, boardData);
  }
  
  doItemMouseDown = (id) => {
    const item = this.getItem(id);
    const { type } = item;
    const { boardInfo } = this.props;
    const { activeItems } = boardInfo;
    const newItems = {
      ...activeItems,
      [id]: true,
    };
    if (type === 'toggle' && activeItems && id in activeItems) {
      delete newItems[id];
    }

    this.doUpdateInfo({
      activeItems: newItems
    });
  }
  
  doItemMouseUp = (id) => {
    const item = this.getItem(id);
    const { type } = item;

    if (type === 'trigger_once') {
      const { boardInfo } = this.props;
      const { activeItems } = boardInfo;
      const newItems = { ...activeItems };
      delete newItems[id];

      this.doUpdateInfo({
        activeItems: newItems
      });
    }
  }
  
  doUpdateInfo = (boardInfo) => {
    const { doUpdateBoardInfoUser } = this.props;
    doUpdateBoardInfoUser(boardInfo);
  }

  ////////////////////////////////////////////////////////////////////////////
  // RENDERS
  
  renderSave = () => {
    return (
      <Button
        bsSize="xsmall"
        onClick={this.onSaveClick}
      >
        Save
      </Button>
    );
  }
  
  renderAddItems = () => {
    const { boardData } = this.props;
    const { items, layers } = boardData;
    
    const canAddItems = layers && layers.length;
    
    return (
      <DropdownButton
        id="board-items-menu"
        title={(
          <Glyphicon
            glyph="plus"
          />
        )}
        bsSize="xsmall"
        onClick={stopEvent}
      >
        { !items.length ? (
          <MenuItem
            onSelect={this.onAddLayerAtTopClick}
            >
            Add layer
          </MenuItem>
        ) : (
          <Fragment>
            <MenuItem
              onSelect={this.onAddLayerAtTopClick}
            >
              Add layer at top
            </MenuItem>
            <MenuItem
              onSelect={this.onAddLayerAtBottomClick}
            >
              Add layer at bottom
            </MenuItem>
          </Fragment>
        )}
        <MenuItem
          divider
        />
        <MenuItem
          onSelect={this.onAddBlockClick}
          disabled={!canAddItems}
        >
          Add block...
        </MenuItem>
      </DropdownButton>
    );
  }

  renderZoomControls = () => {
    const levels = [1, 1.5, 3, 6, 8, 10];
    const { boardData } = this.props;
    const { zoom, zoomVert } = boardData;
    
    return (
      <ButtonGroup>
        <DropdownButton
          id="board-zoom-menu"
          title={(
            <Fragment>
              <Glyphicon
                glyph="search"
                />
              <Glyphicon
                glyph="resize-horizontal"
                />
            </Fragment>
          )}
          bsSize="xsmall"
          onClick={stopEvent}
          >
          { levels.map((level) => (
            <MenuItem
              key={`zoom-level-${level}`}
              onSelect={() => this.onZoomLevelClick(level)}
              active={level == zoom}
              >
              { percentString(level, true) }
            </MenuItem>
          )) }
        </DropdownButton>
        <DropdownButton
          id="board-zoom-vert-menu"
          title={(
            <Fragment>
              <Glyphicon
                glyph="search"
                />
              <Glyphicon
                glyph="resize-vertical"
                />
            </Fragment>
          )}
          bsSize="xsmall"
          onClick={stopEvent}
          >
          { levels.map((level) => (
            <MenuItem
              key={`zoom-vert-level-${level}`}
              onSelect={() => this.onZoomVertLevelClick(level)}
              active={level == zoomVert}
              >
              { percentString(level, true) }
            </MenuItem>
          )) }
        </DropdownButton>
      </ButtonGroup>
    );
  }

  renderItemComponent = (item, index, items, layerEditorCallbacks) => {
    let ComponentClass = null;
    if ('script' in item) {
      ComponentClass = BoardBlock;
    }
    
    if (ComponentClass === null) {
      return null;
    }
    
    const itemsCount = Math.max(4, items.length);
    const widthPercent = (1 / itemsCount) * 0.95;
    const leftPercent = ((index * widthPercent) * 1.05);
    
    return (
      <ComponentClass
        key={`item-${index}`}
        data={item}
        style={{
          left: percentString(leftPercent),
          width: percentString(widthPercent),
        }}
        active={this.itemIsActive(item.id)}
        boardDeleteItem={this.doDeleteItem}
        boardEditItem={this.doEditItem}
        boardCopyItem={this.doCopyItem}
        boardPasteItem={this.doPasteItem}
        boardItemMouseDown={this.doItemMouseDown}
        boardItemMouseUp={this.doItemMouseUp}
        boardCanPasteItem={this.canPasteItem}
        {...layerEditorCallbacks}
      />
    );
  }

  renderLayerContextMenu = (baseTemplate, layerId, e) => {
    const template = [
      {
        type: 'separator',
      },
      {
        label: 'Paste item here',
        click: () => this.onPasteItemHereClick(layerId, e),
        enabled: this.canPasteItem('*'),
      },
      {
        label: 'Add block...',
        click: () => this.onAddBlockHereClick(layerId, e),
      },
    ];

    return [
      ...baseTemplate,
      ...template,
    ];
  }

  setLayerEditorRef = (ref) => {
    this.layerEditor = ref;
  }

  renderBoardWrapper = (workingBoardData, workingBoardInfo) => {
    return (
      <div
        className={styles.boardEditorContent}
      >
        <BoardWrapper
          layerEditorRef={this.setLayerEditorRef}
          boardData={workingBoardData}
          boardInfo={workingBoardInfo}
          layerEditorRenderItemComponent={this.renderItemComponent}
          layerEditorRenderLayerContextMenu={this.renderLayerContextMenu}
          layerEditorOnChange={this.doSave}
        />
      </div>
    );
  }
  
  renderItemModals = () => {
    const { boardData, scripts } = this.props;
    const { modalType, modalValue, modalAction } = this.state;
    const { layers } = boardData;
    
    return (
      <Fragment>
        <BoardBlockModal
          initialValue={modalValue}
          show={modalType === 'block' && modalAction !== 'record'}
          title={modalAction === 'add' ? 'Add block' : 'Edit block'}
          onCancel={this.itemModalCancel}
          onSuccess={this.itemModalSuccess}
          scripts={scripts}
          layers={layers}
        />
      </Fragment>
    );
  }

  render = () => {
    const { boardData, boardInfo } = this.props;
    const { boardDataTemp } = this.state;
    const workingBoardData = boardDataTemp || boardData;

    return (
      <Panel
        title="Board editor"
        className={styles.fullHeight}
        headingContent={
          workingBoardData ? (
            <ButtonToolbar>
              { this.renderSave() }
              { this.renderAddItems() }
              { this.renderZoomControls() }
            </ButtonToolbar>
          ) : null
        }
      >
        { workingBoardData ? this.renderBoardWrapper(workingBoardData, boardInfo) : null }
        { workingBoardData ? this.renderItemModals() : null }
      </Panel>
    );
  }
}

BoardEditor.propTypes = propTypes;
BoardEditor.defaultProps = defaultProps;

const boardDataSelector = createSelector(
  [
    (state) => state.currentBoard,
    (state) => state.boards,
  ],
  (currentBoard, boards) => {
    return boards.find(({id}) => id === currentBoard);
  }
);
const mapStateToProps = (state) => {
  return {
    currentBoard: state.currentBoard,
    boardData: boardDataSelector(state),
    scripts: state.scripts,
    boardInfo: state.boardInfo,
    runBoard: state.runBoard,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    doUpdateBoardInfo: (data) => dispatch(updateBoardInfo(data)),
    doUpdateBoardInfoUser: (data) => dispatch(updateBoardInfoUser(data)),
    doSaveBoard: (id, data) => dispatch(saveBoard(id, data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardEditor);
