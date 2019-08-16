import React, { PureComponent } from 'react';
import { set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';

import SelectField from '../../forms/fields/SelectField';

class DeviceTableField extends PureComponent {
  state = {
    value: [],
  };
  
  constructor(props) {
    super(props);
    
    const { value } = props;
    if (value) {
      this.state = {
        value: value,
      };
    }
  }
  
  onDeviceChange = (fieldValue, deviceIndex) => {
    const { value } = this.state;
    
    const newValue = value.map((device, index) => {
      if (index === deviceIndex) {
        return {
          ...device,
          id: fieldValue,
        };
      }
      return device;
    });
    
    this.doChange(newValue);
  }
  
  onAddDeviceClick = () => {
    const { value } = this.state;
    
    const newValue = [
      ...(value || []),
      {
        id: null,
      },
    ];
    
    this.doChange(newValue);
  }
  
  onDeleteDeviceClick = (deviceIndex) => {
    const { value } = this.state;
    
    const newValue = value.filter((device, index) => index !== deviceIndex);

    this.doChange(newValue);
  }
  
  doChange = (value) => {
    this.setState({
      value,
    });
    
    const { onChange } = this.props;
    onChange(value);
  }
  
  render = () => {
    const { devices } = this.props;
    const { value } = this.state;
    
    return (
      <Table
        striped
        bordered
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Device</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {value.map(({ id }, index) => (
            <tr
              key={`item-${index}`}
            >
              <td>
                {index + 1}
              </td>
              <td>
                <SelectField
                  bsSize="small"
                  value={id}
                  onChange={(value) => this.onDeviceChange(value, index)}
                  options={devices.map(({id, name}) => ({
                    value: id,
                    label: name,
                  }))}
                />
              </td>
              <td>
                <Button
                  bsSize="xsmall"
                  bsStyle="danger"
                  onClick={(e) => this.onDeleteDeviceClick(index)}
                >
                  <Glyphicon
                    glyph="trash"
                  />
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="3"
            >
              <Button
                bsSize="xsmall"
                onClick={this.onAddDeviceClick}
              >
                <Glyphicon
                  glyph="plus"
                />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default DeviceTableField;