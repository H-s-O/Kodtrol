import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Color from 'color';

import percentString from '../../../lib/percentString';
import { ITEM_TRIGGER, ITEM_SCRIPT, ITEM_MEDIA, ITEM_CURVE } from '../../../../../common/js/constants/items';
import AudioSVGWaveform from '../../../lib/AudioSVGWaveform';

const StyledBlockLabel = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  margin: 0px 2px;
`;

const StyledBlockAnchor = styled.div`
  ${({ left }) => left && `
    border-right-width: 10px;
    border-right-style: solid;
    border-right-color: inherit;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;

    &:hover {
      border-right-color: #AAA;
    }
  `}

  ${({ right }) => right && `
    border-left-width: 10px;
    border-left-style: solid;
    border-left-color: inherit;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;

    &:hover {
      border-left-color: #AAA;
    }
  `}
`;

const StyledBlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0px;
  width: 100%;
  font-size: 0.75em;
  border-bottom-color: inherit;
  border-bottom-style: solid;
  border-bottom-width: 1px;
`;

const StyledBlockBody = styled.div`
  flex-grow: 1;
`;

const StyledBlockContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 4px;
  color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  background-color: ${({ color }) => color};
  border-color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};

  &:hover, &.active {
    background-color: ${({ color }) => Color(color).lighten(0.1).rgb().string()};
  }
`;

const StyledPointLabel = styled.div`
  position: absolute;
  padding: 4px;
  font-size: 0.75em;
  background-color: inherit;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const StyledPointContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: ${({ color }) => color};
  overflow-x: hidden;
  color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};

  &:hover, &.active {
    overflow-x: visible;
    z-index: 5;
    background-color: ${({ color }) => Color(color).lighten(0.1).rgb().string()};
  }
`;

const StyledWaveform = styled.svg`
  position: relative;
  width: 100%;
  height: 100%;
  
  path {
    stroke: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  }
`;

const TimelineScript = ({ script: { color, name, script }, scriptsNames, onDrag, ...otherProps }) => {
  const container = useRef();

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name || scriptsNames[script]}</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
    </StyledBlockContainer>
  );
};

const TimelineTrigger = ({ trigger: { color, name }, onDrag, ...otherProps }) => {
  const container = useRef();

  return (
    <StyledPointContainer
      ref={container}
      color={color}
      onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
      {...otherProps}
    >
      <StyledPointLabel>{name}</StyledPointLabel>
    </StyledPointContainer>
  );
};

const TimelineCurve = ({ curve: { color, name, curve }, onDrag, ...otherProps }) => {
  const container = useRef();

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name}</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
    </StyledBlockContainer>
  );
};

const TimelineMedia = ({ media: { color, name, media }, mediasNames, onDrag, ...otherProps }) => {
  const file = mediasNames[media].file;

  const [loading, setLoading] = useState(false);
  const [waveformWidth, setWaveformWidth] = useState(null);
  const [waveformData, setWaveformData] = useState(null);

  const instance = useRef(new AudioSVGWaveform(`file://${file}`));
  useEffect(() => {
    if (!waveformData && !loading) {
      setLoading(true);

      console.log(instance)
      instance.current.loadFromUrl().then(() => {
        const waveform = instance.current.getPath();

        // Parse the last "moveto" command of the waveform path to
        // find the waveform width
        const lastM = waveform.lastIndexOf('M');
        const mComma = waveform.indexOf(',', lastM);
        const waveformWidth = Number(waveform.slice(lastM + 1, mComma)) + 1; // include the last line

        setWaveformData(waveform);
        setWaveformWidth(waveformWidth);
        setLoading(false);
      })
    }
  }, [instance, loading, waveformData]);

  const container = useRef();

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name || mediasNames[media].name}</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
      <StyledBlockBody>
        {(waveformData && waveformWidth) && (
          <StyledWaveform
            viewBox={`0 -1 ${waveformWidth} 2`}
            preserveAspectRatio="none"
          >
            <path
              d={waveformData}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </StyledWaveform>
        )}
      </StyledBlockBody>
    </StyledBlockContainer>
  );
};

export default function TimelineItem({ item, scriptsNames, mediasNames, timelineDuration, ...otherProps }) {
  const type = item.type;
  const left = percentString(item.inTime / timelineDuration);

  if (type === ITEM_TRIGGER) {
    return (
      <TimelineTrigger
        trigger={item}
        style={{ left }}
        {...otherProps}
      />
    );
  }

  const width = percentString((item.outTime - item.inTime) / timelineDuration);

  if (type === ITEM_SCRIPT) {
    return (
      <TimelineScript
        script={item}
        style={{ left, width }}
        scriptsNames={scriptsNames}
        {...otherProps}
      />
    );
  }

  if (type === ITEM_CURVE) {
    return (
      <TimelineCurve
        curve={item}
        style={{ left, width }}
        {...otherProps}
      />
    );
  }

  if (type === ITEM_MEDIA) {
    return (
      <TimelineMedia
        media={item}
        style={{ left, width }}
        mediasNames={mediasNames}
        {...otherProps}
      />
    );
  }

  return null;
};