import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ButtonGroup, Button, Popover, Menu, Position, Icon } from '@blueprintjs/core';

import TimelineWrapper from '../../../../ui/js/components/timeline/TimelineWrapper';
import FullHeightCard from '../ui/FullHeightCard';
import { ICON_SCRIPT, ICON_MEDIA, ICON_CURVE, ICON_TRIGGER } from '../../../../common/js/constants/icons';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledTopRow = styled.div`
`;

const StyledBottomRow = styled.div`
  height: 100%;
`;

export default function TimelineEditorTab({ id }) {
  const editTimelines = useSelector((state) => state.editTimelines);
  const timeline = editTimelines.find((timeline) => timeline.id === id);

  return (
    <FullHeightCard>
      <StyledContainer>
        <StyledTopRow>
          <ButtonGroup>
            <Button
              small
              icon="step-backward"
            />
            <Button
              small
              icon="play"
            />
          </ButtonGroup>
          <ButtonGroup>
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  <Menu.Item
                    icon={ICON_SCRIPT}
                    text="Add Script Block"
                  />
                  <Menu.Item
                    icon={ICON_CURVE}
                    text="Add Curve Block"
                  />
                  <Menu.Item
                    icon={ICON_MEDIA}
                    text="Add Media Block"
                  />
                  <Menu.Item
                    icon={ICON_TRIGGER}
                    text="Add Trigger"
                  />
                </Menu>
              )}
            >
              <Button
                small
                icon="plus"
                rightIcon="caret-down"
              />
            </Popover>
          </ButtonGroup>
          <ButtonGroup>
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  <Menu.Item
                    text="100%"
                  />
                </Menu>
              )}
            >
              <Button
                small
                icon="search"
                rightIcon="caret-down"
              >
                <Icon
                  icon="arrows-vertical"
                />
              </Button>
            </Popover>
            <Popover
              minimal
              position={Position.BOTTOM}
              content={(
                <Menu>
                  <Menu.Item
                    text="100%"
                  />
                </Menu>
              )}
            >
              <Button
                small
                icon="search"
                rightIcon="caret-down"
              >
                <Icon
                  icon="arrows-horizontal"
                />
              </Button>
            </Popover>
          </ButtonGroup>
        </StyledTopRow>
        <StyledBottomRow>

        </StyledBottomRow>
      </StyledContainer>
    </FullHeightCard>
  )
}
