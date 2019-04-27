import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon, SplitButton, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Panel from '../partials/Panel';
import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import BoardBlockModal from './modals/BoardBlockModal';
import BoardBlock from './BoardBlock';
import { saveBoard, runBoard, stopBoard } from '../../../../common/js/store/actions/boards';
import { updateBoardInfo, updateBoardInfoUser } from '../../../../common/js/store/actions/boardInfo';
import { Provider } from './boardEditorContext';
import BoardWrapper from './BoardWrapper';

import styles from '../../../styles/components/board/boardeditor.scss';

const propTypes = {
  boardData: PropTypes.shape({}),
  boardInfo: PropTypes.shape({}),
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  doUpdateBoardInfo: PropTypes.func.isRequired,
  doUpdateBoardInfoUser: PropTypes.func.isRequired,
  doSaveBoard: PropTypes.func.isRequired,
  doRunBoard: PropTypes.func.isRequired,
  doStopRunBoard: PropTypes.func.isRequired,
};

const defaultProps = {
  boardData: null,
  boardInfo: null,
  scripts: [],
};

class BoardEditor extends PureComponent {
  editorCallbacks = null;
  layerEditor = null;
  state = {
    modalType: null,
    modalAction: null,
    modalValue: null,
    
    copyItemData: null,
    
    boardDataTemp: null,
  };
  
  constructor(props) {
    super(props);
    
    this.editorCallbacks = {
      boardAddItemAt: this.onAddItemAt,
      boardEditItem: this.onEditItem,
      boardUpdateItem: this.onUpdateItem,
      boardAdjustItem: this.onAdjustItem,
      boardDeleteItem: this.onDeleteItem,
      boardCopyItem: this.onCopyItem,
      boardPasteItem: this.onPasteItem,
      boardCanPasteItem: this.canPasteItem,
      boardItemMouseDown: this.onItemMouseDown,
      boardItemMouseUp: this.onItemMouseUp,
      boardItemIsActive: this.itemIsActive,
    };
  }
  
  getItem = (itemId) => {
    const { boardData } = this.props;
    const { items } = boardData;
    return items.find(({id}) => id === itemId);
  }
  
  getLayer = (layerId) => {
    const { boardData } = this.props;
    const { layers } = boardData;
    return layers.find(({id}) => id === layerId);
  }
  
  onUpdateItem = (itemId, data) => {
    const { boardData } = this.props;
    const { items } = boardData;
    const itemData = this.getItem(itemId);
    
    const newItemData = {
      ...itemData,
      ...data,
    };
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return newItemData;
      }
      return item;
    });
    const newBoardData = {
      items: newItems,
    };
    
    this.doSave(newBoardData);
  }
  
  onDeleteItem = (itemId) => {
    const { boardData } = this.props;
    const { items } = boardData;

    const newItems = items.filter(({id}) => id !== itemId);
    const newBoardData = {
      items: newItems,
    };
    
    this.doSave(newBoardData);
  }
  
  onEditItem = (itemId) => {
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
  
  onItemModalSuccess = (itemData) => {
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

    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
    });
  }
  
  onItemModalCancel = () => {
    // Hide modal
    this.setState({
      modalType: null,
      modalAction: null,
      modalValue: null,
    });
  }
  
  onAddLayerAtTopClick = () => {
    this.layerEditor.doAddLayer('max');
  }
  
  onAddLayerAtBottomClick = () => {
    this.layerEditor.doAddLayer('min');
  }

  onSaveClick = () => {
    // const { boardData, doSaveBoard } = this.props;
    // doSaveBoard(boardData);
  }
  
  
  onAddBlockClick = () => {
    this.doAddItem('block', {
      id: uniqid(), // generate new block id
    });
  }

  onPasteItemHere = (e) => {
    const { boardPasteItem, data } = this.props;
    const { id } = data;
    boardPasteItem(id, '*', e);
  }
  
  onAddBlockHereClick = (e) => {
    this.doAddItemAt('block', e);
  }
  
  doAddItemAt = (type, e) => {
    const { boardAddItemAt, data } = this.props;
    const { id } = data;
    boardAddItemAt(id, type, e);
  }
  
  doAddItem = (type, baseData) => {
    this.setState({
      modalType: type,
      modalValue: baseData,
      modalAction: 'add',
    });
  }

  onCopyItem = (itemId, mode) => {
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
  
  canPasteItem = (mode) => {
    const { copyItemData } = this.state;
    if (copyItemData === null) {
      return false;
    } else if (mode === '*' && typeof copyItemData === 'object') {
      return true;
    } else if (mode !== '*' && typeof copyItemData === 'number') {
      return true;
    }
    return false;
  }

  onPasteItem = (itemId, mode, e = null) => {
    const { copyItemData } = this.state;
    
    if (copyItemData !== null) {
      const { boardData } = this.props;
      const { items, duration } = boardData;
      
      let newItem;
      let newItems;
      if (mode === '*') {
        const { inTime, outTime } = copyItemData;
        let newInTime = this.getTimelinePositionFromEvent(e);
        if (newInTime < 0) {
          newInTime = 0;
        } else if (newInTime > duration) {
          newInTime = duration;
        }
        newItem = {
          ...copyItemData,
          id: uniqid(), // override with new id
          layer: itemId,
          inTime: newInTime,
        }
        if ('outTime' in copyItemData) {
          const diffTime = outTime - inTime;
          let newOutTime = newInTime + diffTime;
          if (newOutTime < 0) {
            newOutTime = 0;
          } else if (newOutTime > duration) {
            newOutTime = duration;
          }
          newItem.outTime = newOutTime;
        }
        newItems = [
          ...items,
          newItem,
        ];
      } else {
        const item = this.getItem(itemId);
        newItem = {
          ...item,
          [mode]: copyItemData,
        };
        newItems = items.map((item) => {
          if (item.id === itemId) {
            return newItem;
          }
          return item;
        });
      }
      const newTimelineData = {
        ...boardData,
        items: newItems,
      };

      this.doSave(newTimelineData);

      this.setState({
        copyItemData: null,
      });
    }
  }
  
  onAddItemAt = (layerId, type, e) => {
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

  onZoomLevelClick = (level) => {
    const data = {
      zoom: level,
    };
    this.doSave(data);
  }
  
  onZoomVertLevelClick = (level) => {
    const data = {
      zoomVert: level,
    };
    this.doSave(data);
  }

  doSave = (boardData) => {
    const { doSaveBoard, currentBoard } = this.props;
    doSaveBoard(currentBoard, boardData);
  }
  
  ////////////////////////////////////////////////////////////////////////////
  // BOARD INFO
  
  onItemMouseDown = (id) => {
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
  
  onItemMouseUp = (id) => {
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
  
  itemIsActive = (id) => {
    const { boardInfo } = this.props;
    const { activeItems } = boardInfo;
    return activeItems && id in activeItems;
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
  
  renderBoardControls = () => {
    const { boardInfo, runBoard } = this.props;
    if (!boardInfo) {
      return null;
    }
    
    const { playing } = boardInfo;
    
    return (
      <ButtonGroup>
        <Button
          disabled={runBoard === null}
          bsSize="xsmall"
          onClick={this.onTimelineRewindClick}
        >
          <Glyphicon
            glyph="step-backward"
          />
        </Button>
        { !playing ? (
          <Button
            disabled={runBoard === null}
            bsSize="xsmall"
            onClick={this.onTimelinePlayClick}
          >
            <Glyphicon
              glyph="play"
            />
          </Button>
        ) : (
          <Button
            disabled={runBoard === null}
            bsSize="xsmall"
            onClick={this.onTimelinePauseClick}
          >
            <Glyphicon
              glyph="pause"
            />
          </Button>
        )}
      </ButtonGroup>
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

  renderItemComponent = (item, index, items) => {
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
      />
    );
  }

  renderLayerContextMenu = (currentTemplate, e) => {
    const template = [
      {
        type: 'separator',
      },
      {
        label: 'Paste item here',
        click: () => this.onPasteItemHere(e),
        enabled: this.canPasteItem('*'),
      },
      {
        label: 'Add block...',
        click: () => this.onAddBlockHereClick(e),
      },
    ];

    return [
      ...currentTemplate,
      ...template,
    ];
  }

  setLayerEditorRef = (ref) => {
    this.layerEditor = ref;
  }

  renderBoardWrapper = (workingBoardData) => {
    return (
      <div
        className={styles.boardEditorContent}
      >
        <Provider
          value={this.editorCallbacks}
        >
          <BoardWrapper
            layerEditorRef={this.setLayerEditorRef}
            layerEditorRenderItemComponent={this.renderItemComponent}
            layerEditorRenderLayerContextMenu={this.renderLayerContextMenu}
            layerEditorOnChange={this.doSave}
            boardData={workingBoardData}
          />
        </Provider>
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
          onCancel={this.onItemModalCancel}
          onSuccess={this.onItemModalSuccess}
          scripts={scripts}
          layers={layers}
        />
      </Fragment>
    );
  }

  render = () => {
    const { boardData } = this.props;
    const { boardDataTemp } = this.state;
    const workingBoardData = boardDataTemp || boardData;

    return (
      <Panel
        title="Board editor"
        className={styles.fullHeight}
        headingContent={
          workingBoardData && (
            <ButtonToolbar>
              { this.renderSave() }
              { this.renderBoardControls() }
              { this.renderAddItems() }
              { this.renderZoomControls() }
            </ButtonToolbar>
          )
        }
      >
        { workingBoardData ? this.renderBoardWrapper(workingBoardData) : null }
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
    doRunBoard: (id) => dispatch(runBoard(id)),
    doStopRunBoard: () => dispatch(stopBoard()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardEditor);
