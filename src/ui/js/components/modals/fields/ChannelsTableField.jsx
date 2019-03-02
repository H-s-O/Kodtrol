import React, { PureComponent } from 'react';
import { set } from 'lodash';
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, Form, Col, Table } from 'react-bootstrap';

class ChannelsTableField extends PureComponent {
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
  
  onAddChannelClick = () => {
    const { value } = this.state;
    
    const newValue = [
      ...(value || []),
      {
        defaultValue: null,
        alias: null,
      },
    ];
    
    this.doChange(newValue);
  }
  
  onDeleteChannelClick = (channelIndex) => {
    const { value } = this.state;
    
    const newValue = value.filter((channel, index) => index !== channelIndex);

    this.doChange(newValue);
  }
  
  onChannelChange = (e, channelIndex, field) => {
    const { value } = this.state;
    const fieldValue = e.target.value;
    
    const newValue = value.map((channel, index) => {
      if (index === channelIndex) {
        return {
          ...channel,
          [field]: fieldValue,
        };
      }
      return channel;
    });
    
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
    const { value } = this.state;
    
    return (
      <Table
        striped
        bordered
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Default value</th>
            <th>Alias</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {value.map(({ defaultValue, alias }, index) => (
            <tr
              key={`channel-${index}`}
            >
              <td>
                {index + 1}
              </td>
              <td>
                <FormControl
                  type="number"
                  bsSize="small"
                  placeholder="0 - 255"
                  min="0"
                  max="255"
                  value={defaultValue || ""}
                  onChange={(e) => this.onChannelChange(e, index, 'defaultValue')}
                />
              </td>
              <td>
                <FormControl
                  type="text"
                  bsSize="small"
                  placeholder="(none)"
                  value={alias || ""}
                  onChange={(e) => this.onChannelChange(e, index, 'alias')}
                />
              </td>
              <td>
                <Button
                  bsSize="xsmall"
                  bsStyle="danger"
                  onClick={(e) => this.onDeleteChannelClick(index)}
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
              colSpan="4"
            >
              <Button
                bsSize="xsmall"
                onClick={this.onAddChannelClick}
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

export default ChannelsTableField;