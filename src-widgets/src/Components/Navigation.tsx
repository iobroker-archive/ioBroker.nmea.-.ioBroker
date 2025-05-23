import React, { useMemo } from 'react';
import { BigArrow, CenterText, Lines, Rudder, Ship, SvgContainer, RADIUS, useAngle } from './Elements';

import type { ThemeType } from '@iobroker/adapter-react-v5';

import Generic from '../Generic';

const styles: Record<string, React.CSSProperties> = {
    content: {
        display: 'grid',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        gridTemplateRows: 'min-content auto',
        position: 'absolute',
    },
    contentInner: {
        overflow: 'hidden',
        position: 'relative',
    },
    header: {
        textAlign: 'center',
    },
    ship: {
        transform: `translate(${RADIUS}px, ${RADIUS}px)`,
    },
    centerTextInner: {
        fontSize: RADIUS / 5,
    },
    centerTextBig: {
        fontSize: 20,
    },
};

function getCompassDirection(angle: number): {
    short: string;
    long: string;
} {
    if (angle === null || angle === undefined) {
        return { short: '--', long: '---' };
    }
    // Ensure the angle is between 0 and 360
    angle %= 360;
    if (angle < 0) {
        angle += 360;
    }

    const directions = [
        { short: 'N', long: 'North' },
        { short: 'NNE', long: 'North-Northeast' },
        { short: 'NE', long: 'Northeast' },
        { short: 'ENE', long: 'East-Northeast' },
        { short: 'E', long: 'East' },
        { short: 'ESE', long: 'East-Southeast' },
        { short: 'SE', long: 'Southeast' },
        { short: 'SSE', long: 'South-Southeast' },
        { short: 'S', long: 'South' },
        { short: 'SSW', long: 'South-Southwest' },
        { short: 'SW', long: 'Southwest' },
        { short: 'WSW', long: 'West-Southwest' },
        { short: 'W', long: 'West' },
        { short: 'WNW', long: 'West-Northwest' },
        { short: 'NW', long: 'Northwest' },
        { short: 'NNW', long: 'North-Northwest' },
    ];

    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
}

export default function Navigation(props: {
    cog: number;
    twd: number;
    themeType: ThemeType;
    rudder: number | false;
}): React.JSX.Element {
    const angle = useAngle(-props.cog - 90);
    const twdAngle = useAngle(angle + 90 + props.twd);

    const compass = useMemo(
        () => (
            <>
                <ellipse
                    fill={props.themeType === 'dark' ? '#000' : '#FFF'}
                    stroke={props.themeType === 'dark' ? '#FFF' : '#000'}
                    strokeWidth={2}
                    cx={RADIUS}
                    cy={RADIUS}
                    rx={RADIUS}
                    ry={RADIUS}
                />
                <Lines
                    color={props.themeType === 'dark' ? '#FFF' : '#000'}
                    textCallback={_angle => {
                        if (_angle === 0) {
                            return 'N';
                        }
                        if (_angle === 90) {
                            return 'O';
                        }
                        if (_angle === 180) {
                            return 'S';
                        }
                        if (_angle === 270) {
                            return 'W';
                        }
                        return _angle % 30 ? '' : _angle;
                    }}
                />
            </>
        ),
        [props.themeType],
    );

    const compassDirection = getCompassDirection(props.cog).short;

    return (
        <div style={styles.content}>
            <div style={styles.header}>{Generic.t('Navigation')}</div>
            <div style={styles.contentInner}>
                <SvgContainer
                    angle={0}
                    height={RADIUS + 30}
                >
                    <foreignObject
                        width={RADIUS * 2}
                        height={RADIUS * 2}
                    >
                        {props.twd !== null && props.twd !== undefined ? (
                            <BigArrow
                                angle={twdAngle}
                                zIndex={3}
                            />
                        ) : null}
                        <SvgContainer
                            angle={props.cog !== null && props.cog !== undefined ? angle : -90}
                            noAnimation={props.cog === null || props.cog === undefined}
                        >
                            {compass}
                        </SvgContainer>
                        <SvgContainer scale={2}>
                            <Ship style={styles.ship} />
                        </SvgContainer>
                        <CenterText>
                            <div style={styles.centerTextInner}>
                                {`${
                                    props.cog === null ||
                                    props.cog === undefined ||
                                    Number.isNaN(parseFloat(props.cog as unknown as string))
                                        ? '---'
                                        : Math.round(parseFloat(props.cog as unknown as string))
                                              .toString()
                                              .padStart(3, '0')
                                }°`}
                            </div>
                            <div style={styles.centerTextBig}>
                                {compassDirection !== '--'
                                    ? Generic.t(getCompassDirection(props.cog).short)
                                    : compassDirection}
                            </div>
                        </CenterText>
                    </foreignObject>
                    {props.rudder === false ? null : <Rudder rudder={props.rudder} />}
                </SvgContainer>
            </div>
        </div>
    );
}
