'use client';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-array-index-key */
/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState, useMemo } from 'react';
import { jsx, css } from '@emotion/react';
import { CwProvider } from './components/CwProvider';
import Content from '../content';
import DynamicallyPlacedContent from './components/DynamicallyPlacedContent';
import { KebabCase, addCustomClasses } from '../../assets/scripts/helpers';
import {
    buildGridRowRuleFromFractionalWidths,
    generateHorizontalPositioningCss,
} from '../../assets/scripts/helpers/helpers-grid';
import { breakpoints } from '../../config/css-globals';

import './column-wrapper.scss';

const ColumnWrapper = (props) => {
    const {
        columns,
        columnHorizontalAlignment = 'left',
        columnWidths = '50 / 50',
        customClasses,
        roundedCorners = false,
        stackColumnsOnTablet = true,
        verticalAlignment = 'top',
        wrapperWidth = 'Fill Width',
        columnWidthValues,
        mobileMedia,
        section,
        tfaFormData,
    } = props;

    const potentialClasses = [
        roundedCorners ? 'rounded-corners' : null,
        stackColumnsOnTablet ? 'stack-columns' : null,
        wrapperWidth ? `wrapper-width--${KebabCase(wrapperWidth)}` : null,
        mobileMedia ? 'mobile-media' : null,
    ];
    const hasDynamicallySourcedImage = columns?.some(
        (column) =>
            column?.__typename === 'ContentfulDynamicallySourcedImage' ||
            column?._type === 'dynamicallySourcedImage'
    );
    const [additionalClasses, setAdditionalClasses] = useState([]);
    const [dynamicImageSource, setDynamicImageSource] = useState(false);
    const [dynamicContent, setDynamicContent] = useState({
        title: null,
        introText: null,
        leadingIcon: null,
        pill: null,
    });
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : breakpoints.md
    );
    const shouldMakeHeadingDynamic = columns?.some(
        (column) =>
            column?.__typename === 'ContentfulImage' ||
            column?._type === 'image' ||
            column?.__typename === 'ContentfulVideo' ||
            column?._type === 'video' ||
            column?.components?.some(
                (component) =>
                    component?.__typename === 'ContentfulImage' ||
                    component?._type === 'image' ||
                    component?.__typename === 'ContentfulVideo' ||
                    component?._type === 'video'
            )
    );
    const shouldRenderDynamicImageInAccordionOnMobile =
        hasDynamicallySourcedImage && windowWidth < breakpoints.md;

    const sharedCwContextData = useMemo(() => ({
        dynamicImageSource,
        setDynamicImageSource,
        dynamicContent,
        setDynamicContent,
        shouldMakeHeadingDynamic,
        shouldRenderDynamicImageInAccordionOnMobile,
    }));

    useEffect(() => {
        setAdditionalClasses(
            customClasses
                ? [...customClasses, ...potentialClasses]
                : potentialClasses
        );
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <CwProvider value={sharedCwContextData}>
            <div
                className={`column-wrapper ${addCustomClasses(
                    'column-wrapper__',
                    additionalClasses
                )}`}
            >
                <div
                    className="column-wrapper__inner-grid"
                    css={css`
                        grid-template-columns: ${buildGridRowRuleFromFractionalWidths(
                            columnWidthValues || columnWidths,
                            columns?.length
                        )};
                        ${generateHorizontalPositioningCss(
                            wrapperWidth,
                            columnHorizontalAlignment
                        )}
                        @media (max-width: ${breakpoints.sm}px) {
                            grid-template-columns: ${buildGridRowRuleFromFractionalWidths(
                                columnWidthValues || columnWidths,
                                columns?.length,
                                true
                            )};
                        }
                        @media (max-width: ${breakpoints.xs}px) {
                            grid-template-columns: 1fr;
                            grid-column-start: 1;
                            grid-column-end: end;
                        }
                    `}
                >
                    {dynamicContent?.title && (
                        <DynamicallyPlacedContent content={dynamicContent} />
                    )}
                    {columns?.map((column, index) => {
                        return (
                            <Content
                                {...column}
                                pathname={props?.pathname}
                                alignment={verticalAlignment?.toLowerCase()}
                                className={`column__${index}--${columns.length}`}
                                key={`column-content__component-wrapper-outer-${index}`}
                                columnNumber={index}
                                isLastColumn={index === columns.length - 1}
                                section={section}
                                tfaFormData={tfaFormData}
                            />
                        );
                    })}
                </div>
            </div>
        </CwProvider>
    );
};

ColumnWrapper.displayName = 'ColumnWrapper';

export default ColumnWrapper;
