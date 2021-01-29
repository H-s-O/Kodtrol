import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Color from 'color';
import uniqid from 'uniqid';

import percentString from '../../../lib/percentString';
import { ITEM_TRIGGER, ITEM_SCRIPT, ITEM_MEDIA, ITEM_CURVE } from '../../../../../common/js/constants/items';
import AudioSVGWaveform from '../../../lib/AudioSVGWaveform';
import parseCurve from '../../../../../common/js/lib/parseCurve';
import { getContainerCoords } from '../../../lib/mouseEvents';

const StyledBlockLabel = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  margin: 0px 2px;
`;

const StyledBlockAnchor = styled.div`
  cursor: col-resize;

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
  padding: 2px 0px;
  width: 100%;
  font-size: 0.75em;
  border-bottom-color: inherit;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  overflow: hidden;
  cursor: ew-resize;
`;

const StyledBlockBody = styled.div`
  flex-grow: 1;
`;

const StyledBlockContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 3px;
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
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`;

const StyledPointContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: ${({ color }) => color};
  overflow-x: hidden;
  color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  cursor: col-resize;

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

const StyledCurveContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

const StyledCurve = styled.svg`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;

  polyline {
    fill: none;
    stroke: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  }
`;

const StyledCurvePoint = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 4px;
  background-color: ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
  cursor: initial;

  &:hover {
    outline: 1px solid ${({ color }) => Color(color).isDark() ? '#FFF' : '#000'};
    outline-offset: 1px;
  }
`;

const TimelineScript = ({ script, scriptsNames, onDrag, onChange, ...otherProps }) => {
  const { color, name, script: scriptId } = script;
  const container = useRef();

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader
        onMouseDown={(e) => onDrag(e, container.current, 'inOutTime')}
      >
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name || scriptsNames[scriptId]}</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
    </StyledBlockContainer>
  );
};

const TimelineTrigger = ({ trigger, onDrag, onChange, ...otherProps }) => {
  const { color, name } = trigger;
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

const TimelineCurve = ({ curve, onDrag, onChange, ...otherProps }) => {
  const { color, name, curve: curveData } = curve;
  const container = useRef();

  const parsedCurve = useMemo(() => parseCurve(curveData), [curveData]);
  const realCount = useMemo(() => parsedCurve.filter(({ extra }) => !extra).length, [parsedCurve]);

  const containerDoubleClickHandler = useCallback((e) => {
    // Prevent a timeline position change
    e.stopPropagation();
  });
  const containerClickHandler = useCallback((e) => {
    e.stopPropagation();

    const coords = getContainerCoords(e);
    const newPoint = {
      ...coords,
      id: uniqid(),
    };
    const newCurve = [
      ...(curveData || []),
      newPoint,
    ];
    onChange({ ...curve, curve: newCurve });
  }, [onChange, curveData]);
  const pointClickHandler = useCallback((e, id) => {
    e.stopPropagation();

    const newCurve = curveData.filter((point) => point.id !== id);
    onChange({ ...curve, curve: newCurve });
  }, [onChange, curveData]);

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader
        onMouseDown={(e) => onDrag(e, container.current, 'inOutTime')}
      >
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name} [{realCount === 0 ? 'empty curve' : `${realCount} point${realCount > 1 ? 's' : ''}`}]</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
      <StyledBlockBody>
        <StyledCurveContainer
          onClick={containerClickHandler}
          onDoubleClick={containerDoubleClickHandler}
        >
          {(parsedCurve.length > 0) && (
            <>
              <StyledCurve
                color={color}
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
              >
                <polyline
                  points={parsedCurve.map(({ x, y }) => `${x},${(1 - y)}`).join(' ')}
                  vectorEffect="non-scaling-stroke"
                  strokeWidth="2"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="0"
                />
              </StyledCurve>
              {parsedCurve.map(({ x, y, id, extra }) => {
                if (extra) {
                  return null;
                }

                return (
                  <StyledCurvePoint
                    key={id}
                    color={color}
                    style={{
                      left: percentString(x),
                      top: percentString(1 - y),
                    }}
                    onClick={(e) => pointClickHandler(e, id)}
                  />
                );
              })}
            </>
          )}
        </StyledCurveContainer>
      </StyledBlockBody>
    </StyledBlockContainer>
  );
};

const TimelineMedia = ({ media, mediasNames, onDrag, onChange, ...otherProps }) => {
  const { color, name, media: mediaId, volume } = media;
  const file = mediasNames[mediaId].file;

  const [loading, setLoading] = useState(false);
  const [waveformWidth, setWaveformWidth] = useState(null);
  const [waveformData, setWaveformData] = useState(null);
  const [waveformFile, setWaveformFile] = useState(null);

  const instance = useRef();

  useEffect(() => {
    if ((!!file && file !== waveformFile) && !loading) {
      setLoading(true);
      setWaveformFile(file);

      instance.current = new AudioSVGWaveform(`file://${file}`);
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
  }, [instance, file, waveformFile, loading]);

  const container = useRef();

  return (
    <StyledBlockContainer
      ref={container}
      color={color}
      {...otherProps}
    >
      <StyledBlockHeader
        onMouseDown={(e) => onDrag(e, container.current, 'inOutTime')}
      >
        <StyledBlockAnchor
          left
          onMouseDown={(e) => onDrag(e, container.current, 'inTime')}
        />
        <StyledBlockLabel>{name || mediasNames[mediaId].name} [volume: {percentString(volume)}]</StyledBlockLabel>
        <StyledBlockAnchor
          right
          onMouseDown={(e) => onDrag(e, container.current, 'outTime')}
        />
      </StyledBlockHeader>
      <StyledBlockBody>
        {((waveformData && waveformWidth) && !loading) && (
          <StyledWaveform
            viewBox={`0 -1 ${waveformWidth} 2`}
            preserveAspectRatio="none"
            color={color}
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
