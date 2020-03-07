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
`;

const StyledBlockHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px;
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
  
  &:hover {
    overflow-x: visible;
    z-index: 10;
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

const TimelineScript = ({ script: { color, name, script }, scriptsNames, ...otherProps }) => {
  return (
    <StyledBlockContainer
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockLabel>{name || scriptsNames[script]}</StyledBlockLabel>
      </StyledBlockHeader>
    </StyledBlockContainer>
  );
};

const TimelineTrigger = ({ trigger: { color, name }, ...otherProps }) => {
  return (
    <StyledPointContainer
      color={color}
      {...otherProps}
    >
      <StyledPointLabel>{name}</StyledPointLabel>
    </StyledPointContainer>
  );
};

const TimelineCurve = ({ curve: { color, name, curve }, ...otherProps }) => {
  return (
    <StyledBlockContainer
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockLabel>{name}</StyledBlockLabel>
      </StyledBlockHeader>
    </StyledBlockContainer>
  );
};

const TimelineMedia = ({ media: { color, name, media }, mediasNames, ...otherProps }) => {
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

  return (
    <StyledBlockContainer
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader>
        <StyledBlockLabel>{name || mediasNames[media].name}</StyledBlockLabel>
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
