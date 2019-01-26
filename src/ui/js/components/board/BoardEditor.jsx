import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, set, unset } from 'lodash';
import { Button, Glyphicon, SplitButton, Label, ButtonGroup, ButtonToolbar, FormControl, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import path from 'path';

import Panel from '../partials/Panel';
import stopEvent from '../../lib/stopEvent';
import percentString from '../../lib/percentString';
import BoardBlockModal from './modals/BoardBlockModal';
import { saveBoard, runBoard, stopBoard } from '../../../../common/js/store/actions/boards';
import { updateBoardInfo, updateBoardInfoUser } from '../../../../common/js/store/actions/boardInfo';
import { Provider } from './boardEditorContext';
import BoardDisplay from './BoardDisplay';

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
  timelineWrapper = null;
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
      boardAddLayer: this.onAddLayer,
      boardDeleteLayer: this.onDeleteLayer,
      boardItemClick: this.onItemClick,
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
    this.onAddLayer('max');
  }
  
  onAddLayerAtBottomClick = () => {
    this.onAddLayer('min');
  }

  onAddLayer = (index) => {
    const { boardData } = this.props;
    const { layers } = boardData;

    const newLayer = {
      id: uniqid(),
    };
    
    if (index === 'max') {
      const max = layers.reduce((carry, {order}) => order > carry ? order : carry, 0);
      newLayer.order = max + 1;
    } else if (index === 'min') {
      newLayer.order = 0;
    } else {
      newLayer.order = index;
    }
    
    const newLayers = [
      ...layers.map((layer) => {
        if (layer.order >= newLayer.order) {
          // adjust order
          return {
            ...layer,
            order: layer.order + 1,
          };
        }
        return layer;
      }),
      newLayer,
    ];
    const newBoardData = {
      layers: newLayers,
    };
    
    this.doSave(newBoardData);
  }
  
  onDeleteLayer = (layerId) => {
    const { boardData } = this.props;
    const { layers, items } = boardData;

    const deletedLayer = layers.find(({id}) => id === layerId);
    
    const newLayers = layers
      .filter(({id}) => id !== layerId)
      .map((layer) => {
        if (layer.order >= deletedLayer.order) {
          // adjust order
          return {
            ...layer,
            order: layer.order - 1,
          };
        }
        return layer;
      });
    const newItems = items.filter(({layer}) => layer !== layerId);
    const newBoardData = {
      layers: newLayers,
      items: newItems,
    };
    
    this.doSave(newBoardData);
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


  doSave = (boardData) => {
    const { doSaveBoard, currentBoard } = this.props;
    doSaveBoard(currentBoard, boardData);
  }
  
  ////////////////////////////////////////////////////////////////////////////
  // BOARD INFO
  
  onItemClick = (id) => {
    // const item = this.getItem(id);
    const newItems = {
      [id]: true,
    };
    this.doUpdateInfo(newItems);
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
    const { timelineInfo, runTimeline } = this.props;
    if (!timelineInfo) {
      return null;
    }
    
    const { playing, position } = timelineInfo;
    
    return (
      <ButtonGroup>
        <Button
          disabled={runTimeline === null}
          bsSize="xsmall"
          onClick={this.onTimelineRewindClick}
        >
          <Glyphicon
            glyph="step-backward"
          />
        </Button>
        { !playing ? (
          <Button
            disabled={runTimeline === null}
            bsSize="xsmall"
            onClick={this.onTimelinePlayClick}
          >
            <Glyphicon
              glyph="play"
            />
          </Button>
        ) : (
          <Button
            disabled={runTimeline === null}
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

  renderBoardDisplay = (workingBoardData) => {
    const { boardInfo } = this.props;
    
    return (
      <Provider
        value={this.editorCallbacks}
      >
        <BoardDisplay
          {...workingBoardData}
        />
      </Provider>
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
            </ButtonToolbar>
          )
        }
      >
        { workingBoardData ? this.renderBoardDisplay(workingBoardData) : null }
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
