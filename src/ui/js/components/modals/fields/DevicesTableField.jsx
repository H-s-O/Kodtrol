import React, { PureComponent } from 'react';
import { set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';

class DeviceTableField extends PureComponent {
  state = {
    value: [],
  };
  
  constructor(props) {
    super(props);
    
    const { defaultValue } = props;
    if (defaultValue) {
      this.state = {
        value: defaultValue,
      };
    }
  }
  
  onDeviceChange = (e, index) => {
    const { value } = this.state;
    const fieldValue = e.target.value;
    const newValue = set(value, `[${index}].id`, fieldValue);
    
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
  
  onDeleteDeviceClick = (index) => {
    const { value } = this.state;
    value.splice(index, 1);

    this.doChange(value);
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
                <FormControl
                  componentClass="select"
                  bsSize="small"
                  onChange={(e) => this.onDeviceChange(e, index)}
                  defaultValue={id}
                >
                  <option
                    value=""
                  >
                    --
                  </option>
                  {devices.map(({id, name}, index) => (
                    <option
                      key={`device-${index}`}
                      value={id}
                    >
                      { name }
                    </option>
                  ))}
                </FormControl>
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