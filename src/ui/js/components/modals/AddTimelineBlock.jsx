import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { isFunction, set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';
import { GithubPicker } from 'react-color';
import uniqid from 'uniqid';

const propTypes = {
  initialValue: PropTypes.shape({}),
  mode: PropTypes.string,
  scripts: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
};

const defaultProps = {
  initialValue: null,
  mode: 'add',
  scripts: [],
  layers: [],
};

class AddTimelineBlock extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      id: '',
      name: '',
      script: '',
      layer: '',
      inTime: 0,
      outTime: 0,
      color: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue != this.props.initialValue) {
      // this.resetFields();
      this.setState({...nextProps.initialValue});
    }
  }

  resetFields() {
    this.setState({
      id: '',
      name: '',
      script: '',
      layer: '',
      inTime: 0,
      outTime: 0,
      color: '',
    });
  }

  onEnter() {
    const { initialValue } = this.props;
    if (initialValue === null) {
      this.resetFields();
    }
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onScriptChange(e) {
    this.setState({
      script: e.target.value,
    });
  }

  onLayerChange(e) {
    this.setState({
      layer: e.target.value,
    });
  }

  onInTimeChange(e) {
    this.setState({
      inTime: Number(e.target.value),
    });
  }

  onOutTimeChange(e) {
    this.setState({
      outTime: Number(e.target.value),
    });
  }

  onColorChange(color) {
    this.setState({
      color: color.hex,
    });
  }

  onCancelClick() {
    const { onCancel } = this.props;
    if (isFunction(onCancel)) {
      onCancel();
    }
  }

  onSaveClick() {
    const { onSuccess } = this.props;
    if (isFunction(onSuccess)) {
      onSuccess({
        id: uniqid(),
        ...this.state,
      });
    }
  }

  render() {
    const { show, scripts, layers, initialValue } = this.props;
    const { color, name, inTime, outTime, script, layer } = this.state;

    return (
      <Modal
        show={show}
        onEnter={this.onEnter}
        keyboard
      >
      <Modal.Header
      >
        <Modal.Title
        >
          { initialValue ? "Edit" : "Add" } block
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form
            horizontal
          >
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Name
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="text"
                  value={name}
                  onChange={this.onNameChange}
                />
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Script
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  componentClass="select"
                  onChange={this.onScriptChange}
                  defaultValue={script}
                >
                  <option
                    value=""
                    disabled
                  >
                    --
                  </option>
                  {scripts.map((it, index) => (
                    <option
                      key={`script-${index}`}
                      value={it.id}
                    >
                      { it.label }
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Layer
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  componentClass="select"
                  onChange={this.onLayerChange}
                  defaultValue={layer}
                >
                  <option
                    value=""
                    disabled
                  >
                    --
                  </option>
                  {layers.map((it, index) => (
                    <option
                      key={`layer-${index}`}
                      value={index}
                    >
                      { index + 1 }
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                In time
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="number"
                  value={inTime}
                  onChange={this.onInTimeChange}
                />
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Out time
              </Col>
              <Col
                sm={9}
              >
                <FormControl
                  type="number"
                  value={outTime}
                  onChange={this.onOutTimeChange}
                />
              </Col>
            </FormGroup>
            <FormGroup
            >
              <Col
                componentClass={ControlLabel}
                sm={3}
              >
                Color
              </Col>
              <Col
                sm={9}
              >
                <GithubPicker
                  color={color}
                  triangle="hide"
                  width="100%"
                  onChangeComplete={this.onColorChange}
                />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onCancelClick}
          >
            Cancel
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onSaveClick}
          >
            { initialValue ? "Edit" : "Add" }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddTimelineBlock.propTypes = propTypes;
AddTimelineBlock.defaultProps = defaultProps;

export default AddTimelineBlock;
