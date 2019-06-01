import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get} from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';
import { GithubPicker } from 'react-color';

import TextField from '../forms/fields/TextField';
import NumberField from '../forms/fields/NumberField';
import SelectField from '../forms/fields/SelectField';
import ColorField from '../forms/fields/ColorField';
import FileField from '../forms/fields/FileField';
import isFunction from '../../lib/isFunction';

const propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  successLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({})),
  initialValue: PropTypes.shape({}),
  relatedData: PropTypes.shape({}),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

const defaultProps = {
  show: false,
  title: 'Base modal',
  successLabel: 'Save',
  cancelLabel: 'Cancel',
  initialValue: null,
  relatedData: null,
  onSuccess: null,
  onCancel: null,
};

class BaseModal extends Component {
  state = {
    value: {},
  };
  
  constructor(props) {
    super(props);
    
    const { initialValue } = props;
    if (initialValue) {
      this.state = {
        value: initialValue,
      }
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.initialValue != this.props.initialValue) {
      this.setState({
        value: nextProps.initialValue,
      });
    }
  }

  resetFields = () => {
    this.setState({
      value: {},
    });
  }

  onEnter = () => {
    const { initialValue } = this.props;
    if (initialValue === null) {
      this.resetFields();
    }
  }

  onFieldChange = (e) => {
    const fieldName = e.target.id;
    const fieldValue = e.target.value;
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        [fieldName]: fieldValue,
      },
    });
  }
  
  onCustomFieldChange = (fieldName, fieldValue) => {
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        [fieldName]: fieldValue,
      },
    })
  }

  onColorChange = (fieldName, fieldValue) => {
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        [fieldName]: fieldValue.hex,
      },
    });
  }

  onCancelClick = () => {
    const { onCancel } = this.props;
    if (isFunction(onCancel)) {
      onCancel();
    }
  }

  onSaveClick = () => {
    const { onSuccess } = this.props;
    if (isFunction(onSuccess)) {
      const { value } = this.state;
      onSuccess(value);
    }
  }
  
  renderFieldGroup = (fieldInfo, index) => {
    const { label, field } = fieldInfo;
    
    return (
      <FormGroup
        key={`formgroup-${index}`}
        controlId={field}
      >
        <Col
          componentClass={ControlLabel}
          sm={3}
        >
          { label }
        </Col>
        <Col
          sm={9}
        >
          { this.renderFieldContent(fieldInfo) }
        </Col>
      </FormGroup>
    );
  }
  
  renderFieldContent = (fieldInfo) => {
    const { initialValue, relatedData } = this.props;
    const { field, type, from } = fieldInfo;
    const fieldInitialValue = get(initialValue, field);
    
    if (type === 'select') {
      const fieldRelatedData = get(relatedData, from || field, []);
      
      return (
        <SelectField
          onChange={(value) => this.onCustomFieldChange(field, value)}
          defaultValue={fieldInitialValue}
          options={fieldRelatedData}
        />
      );
    }
    
    if (type === 'color') {
      return (
        <ColorField
          value={fieldInitialValue}
          onChange={(value) => this.onCustomFieldChange(field, value)}
        />
      );
    }
    
    if (type === 'file') {
      return (
        <FileField
          onChange={(value) => this.onCustomFieldChange(field, value)}
          defaultValue={fieldInitialValue}
        />
      );
    }
    
    if (type === 'number') {
      return (
        <NumberField
          onChange={(value) => this.onCustomFieldChange(field, value)}
          defaultValue={fieldInitialValue}
        />
      );
    }
    
    if (type === 'text') {
      return (
        <TextField
          onChange={(value) => this.onCustomFieldChange(field, value)}
          defaultValue={fieldInitialValue}
        />
      );
    }
    
    // Custom field node
    const CustomComponent = type;
    const related = {};
    if (from !== null) {
      related[from] = get(relatedData, from);
    }
    return (
      <CustomComponent
        onChange={(value) => this.onCustomFieldChange(field, value)}
        defaultValue={fieldInitialValue}
        {...related}
      />
    );
  } 

  render = () => {
    const { show, title, fields, successLabel, cancelLabel, onCancel, dialogClassName } = this.props;

    return (
      <Modal
        show={show}
        onEnter={this.onEnter}
        onHide={onCancel}
        backdrop="static"
        dialogClassName={dialogClassName}
        keyboard
      >
      <Modal.Header
        closeButton
      >
        <Modal.Title
        >
          { title }
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form
            horizontal
          >
           { fields.map(this.renderFieldGroup) }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onCancelClick}
          >
            { cancelLabel }
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onSaveClick}
          >
            { successLabel }
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

BaseModal.propTypes = propTypes;
BaseModal.defaultProps = defaultProps;

export default BaseModal;
