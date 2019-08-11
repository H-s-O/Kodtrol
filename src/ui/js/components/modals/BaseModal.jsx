import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';
import { GithubPicker } from 'react-color';

import TextField from '../forms/fields/TextField';
import NumberField from '../forms/fields/NumberField';
import SelectField from '../forms/fields/SelectField';
import ColorField from '../forms/fields/ColorField';
import FileField from '../forms/fields/FileField';
import StaticField from '../forms/fields/StaticField';
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
  valueFilter: PropTypes.func,
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
  valueFilter: null,
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

  onFieldChange = (fieldName, fieldValue) => {
    const { value } = this.state;
    const newValue = {
      ...value,
      [fieldName]: fieldValue,
    };

    const { valueFilter } = this.props;
    if (isFunction(valueFilter)) {
      valueFilter(newValue, this.afterValueFilter);
    } else {
      this.setState({
        value: newValue,
      });
    }
  }

  afterValueFilter = (data) => {
    this.setState({
      value: data,
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
          {label}
        </Col>
        <Col
          sm={9}
        >
          {this.renderFieldContent(fieldInfo)}
        </Col>
      </FormGroup>
    );
  }

  renderFieldContent = (fieldInfo) => {
    const { initialValue, relatedData } = this.props;
    const { value: formValue } = this.state;
    const { field, type, from, readOnly } = fieldInfo;
    const fieldValue = get(formValue, field, get(initialValue, field));

    if (type === 'select') {
      const fieldRelatedData = get(relatedData, from || field, []);

      return (
        <SelectField
          value={fieldValue}
          onChange={(value) => this.onFieldChange(field, value)}
          options={fieldRelatedData}
          disabled={readOnly}
        />
      );
    }

    if (type === 'color') {
      return (
        <ColorField
          value={fieldValue}
          onChange={(value) => this.onFieldChange(field, value)}
          disabled={readOnly}
        />
      );
    }

    if (type === 'file') {
      return (
        <FileField
          value={fieldValue}
          onChange={(value) => this.onFieldChange(field, value)}
          disabled={readOnly}
        />
      );
    }

    if (type === 'number') {
      return (
        <NumberField
          value={fieldValue}
          onChange={(value) => this.onFieldChange(field, value)}
          disabled={readOnly}
        />
      );
    }

    if (type === 'text') {
      return (
        <TextField
          value={fieldValue}
          onChange={(value) => this.onFieldChange(field, value)}
          disabled={readOnly}
        />
      );
    }

    if (type === 'static') {
      return (
        <StaticField
          value={fieldValue}
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
        value={fieldValue}
        onChange={(value) => this.onFieldChange(field, value)}
        disabled={readOnly}
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
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            horizontal
          >
            {fields.map(this.renderFieldGroup)}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onCancelClick}
          >
            {cancelLabel}
          </Button>
          <Button
            bsStyle="success"
            onClick={this.onSaveClick}
          >
            {successLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

BaseModal.propTypes = propTypes;
BaseModal.defaultProps = defaultProps;

export default BaseModal;
