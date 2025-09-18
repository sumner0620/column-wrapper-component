'use client';
/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { upperFirst } from 'lodash';
import { jsx, css } from '@emotion/react';
import memoizeFn from '../../assets/scripts/helpers/memoizeFn';
import Components from '../components';
import { breakpoints } from '../../config/css-globals';
import { ctctColors } from '../../config/colors';
import {
    addCustomClasses,
    handleColorClass,
    throttleWindowResize,
} from '../../assets/scripts/helpers';
import { addColorToTextString } from '../../assets/scripts/helpers/color-utils';
import { CwContext } from '../column-wrapper/components/CwProvider';
import TextBlock from '../text-block';
import Image from '../image/image.view';
import Pill from '../pill';
import DynamicallySourcedImage from '../column-wrapper/components/DynamicallySourcedImage';
import IntroText from '../../assets/common/IntroText/intro-text';

import './content.scss';

const Content = (props) => {
    const {
        alignment,
        backgroundColor,
        backgroundOptionsExist = false,
        cssInJs,
        columnNumber,
        desktopImage,
        isLastColumn,
        large: largeImage,
        medium: mediumImage,
        tabletImage,
        mobileImage,
        horizontalAlignment,
        leadingIcon,
        introText,
        introTextTag,
        introTextTagStyle,
        className = '',
        pill,
        scrollingImage,
        text,
        contentful_id,
        _id,
        tfaFormData,
        textHeadingMapper = null,
        ...attributes
    } = props;

    const arr = props?.components || props?.componentsCollection?.items || [];

    const components = arr.reduce((acc, next) => {
        if (!next?.__typename.startsWith('Contentful')) {
            acc = acc.concat({
                ...next,
                __typename: next?.__typename
                    ? `Contentful${next.__typename}`
                    : next?.__type,
            });
        } else {
            acc = acc.concat({
                ...next,
                __typename: next?.__typename || next?.__type,
            });
        }
        return acc;
    }, []);

    const oneColumnBody = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const scaleValueStart = 1.8;
    const scaleValueEnd = 1;
    const [scale, setScale] = useState(scaleValueStart);
    const {
        shouldMakeHeadingDynamic,
        dynamicContent,
        setDynamicContent,
        shouldRenderDynamicImageInAccordionOnMobile,
        dynamicImageSource,
    } = useContext(CwContext) || {
        dynamicContent: null,
        setDynamicContent: () => {},
        dynamicImageSource: null,
        shouldMakeHeadingDynamic: false,
        shouldRenderDynamicImageInAccordionOnMobile: false,
    };
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : breakpoints.md
    );
    const backgroundColorClasses = [
        backgroundColor || backgroundOptionsExist ? 'background' : null,
        backgroundColor
            ? `background--${handleColorClass(backgroundColor)}`
            : null,
    ];
    const alignmentClasses = [
        alignment ? `va--${alignment?.toLowerCase()}` : null,
        horizontalAlignment
            ? `ha--${horizontalAlignment?.toLowerCase()}`
            : null,
    ];
    const [additionalClasses, setAdditionalClasses] = useState([className]);
    const emotionBackgroundColorAttribute = {};
    const flexAlignmentMap = {
        top: 'flex-start',
        center: 'center',
        bottom: 'flex-end',
        left: 'flex-start',
        right: 'flex-end',
    };
    const aos = {
        'data-aos': 'fade-up',
        'data-aos-easing': 'ease-in',
        'data-aos-duration': '500',
        'data-aos-delay': '150',
    };
    const imageObj = {
        altText: props?.altText,
        contentful_id,
        _id,
        desktopImage,
        large: largeImage,
        medium: mediumImage,
        tabletImage,
        mobileImage,
        aos,
    };
    const isDynamicallySourcedImage =
        attributes.__typename === 'ContentfulDynamicallySourcedImage' ||
        attributes._type === 'dynamicallySourcedImage';

    // If background options component exists, use it, otherwise use deprecated background color field.
    // If nothing exists, use transparent background
    !backgroundOptionsExist
        ? backgroundColor && backgroundColor.startsWith('#')
            ? (emotionBackgroundColorAttribute.css = css`
                  background-color: ${backgroundColor};
              `)
            : (emotionBackgroundColorAttribute.css = css`
                  background-color: transparent;
              `)
        : (emotionBackgroundColorAttribute.css = cssInJs);

    const generateCssPropertyValueFromMap = (map, value, defaultProperty) => {
        return map?.[value?.toLowerCase()]
            ? map[value?.toLowerCase()]
            : defaultProperty;
    };

    const renderComponents = memoizeFn((componentCollection) => {
        return componentCollection?.map((component, index) => {
            // TinyMCE was named kinda weirdly in the CMS, so we need to modify the name a tad. Otherwise, just remove "Contentful" from the component name to pass to our Components object.
            let componentName =
                component?.__typename === 'ContentfulTinyMceRichTextBlock'
                    ? 'TinyMCERichTextBlock'
                    : component?.__typename?.replace('Contentful', '');

            if (
                typeof window !== 'undefined' &&
                window?.location?.pathname?.match(/ctctfos-preview/) &&
                !componentName &&
                component?._type
            ) {
                componentName = upperFirst(component._type);
            }

            if (componentName === 'Image') {
                component.aos = aos;
            }

            const Component = Components?.[componentName];

            const additionalProps =
                componentName && componentName?.match(/tfaForm/gi)
                    ? {
                          tfaFormData: {
                              ...tfaFormData,
                          },
                      }
                    : {};

            return (
                <div
                    className="column-content__component"
                    key={`column-content__component-wrapper-${index}`}
                >
                    {Component && (
                        <Component
                            {...component}
                            {...additionalProps}
                            pathname={props?.pathname}
                            key={`column-content__component-wrapper-inner-${index}`}
                        />
                    )}
                </div>
            );
        });
    });

    const windowResizeHandler = () => {
        if (shouldMakeHeadingDynamic) {
            throttleWindowResize(setWindowWidth(window?.innerWidth), 400);
        }
    };

    const renderAllContent = () => {
        const hasInlinePill =
            text &&
            text?.references?.some(
                (ref) => ref?.__typename === 'ContentfulPill'
            );
        const shouldShowPill =
            pill && (!shouldMakeHeadingDynamic || !dynamicContent?.pill);
        const shouldShowIntroText =
            !pill &&
            (introText || leadingIcon) &&
            (!shouldMakeHeadingDynamic ||
                (!dynamicContent?.introText && !dynamicContent?.leadingIcon));

        return isDynamicallySourcedImage &&
            !shouldRenderDynamicImageInAccordionOnMobile &&
            dynamicImageSource ? (
            <DynamicallySourcedImage />
        ) : (
            <>
                {shouldShowPill && <Pill {...pill} />}
                {shouldShowIntroText ? (
                    <div className="column-content__eyebrow">
                        {leadingIcon?.icon?.file?.url &&
                            leadingIcon?.alternateText && (
                                <img
                                    src={leadingIcon.icon.file.url}
                                    className="leading-icon"
                                    alt={leadingIcon.alternateText}
                                    loading="lazy"
                                />
                            )}
                        {introText && (
                            <IntroText
                                introText={introText}
                                introTextTag={introTextTag}
                                introTextTagStyle={introTextTagStyle}
                            />
                        )}
                    </div>
                ) : null}
                
                {(desktopImage || components) && (
                    <div className="column-content__components-wrapper">
                        {desktopImage && <Image {...imageObj} />}
                        {renderComponents(components)}
                    </div>
                )}

                {text && (
                    <div
                        className={`column-content__text ${
                            hasInlinePill
                                ? 'column-content__has-inline-pill'
                                : ''
                        }`}
                    >
                        <TextBlock
                            {...text}
                            {...attributes}
                            dataQeId="content"
                            isColumnWrapperContent
                            textHeadingMapper={textHeadingMapper}
                        />
                    </div>
                )}
            </>
        );
    };

    useEffect(() => {
        setAdditionalClasses((prevState) => [
            ...prevState,
            ...backgroundColorClasses,
            ...alignmentClasses,
            imageObj?.desktopImage ||
            isDynamicallySourcedImage ||
            (Array.isArray(components) &&
                (components[0]?.__typename === 'ContentfulImage' ||
                    components[0]?._type === 'image'))
                ? 'is-image'
                : null,
        ]);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const stickyHeader = document?.querySelector('.header--sticky');
            const { height: stickyHeaderHeight } = stickyHeader
                ? stickyHeader.getBoundingClientRect()
                : { height: 0 };
            const oneColumnStop =
                oneColumnBody.current &&
                oneColumnBody.current.offsetTop - stickyHeaderHeight;

            const scrollY =
                document?.documentElement?.scrollTop ||
                document?.body?.scrollTop;
            const oneColumnTopOffset = 600;
            const oneColumnStart =
                scrollY - (oneColumnStop - oneColumnTopOffset);
            const oneColumnPercentage =
                (oneColumnStart / oneColumnTopOffset) * 100;

            if (oneColumnStart >= 0 && scrollY <= oneColumnStop) {
                setScale(
                    scaleValueStart -
                        (scaleValueStart - scaleValueEnd) *
                            (oneColumnPercentage / 100)
                );
                setPercentage(oneColumnPercentage);
            }

            if (oneColumnStart < 0) {
                setPercentage(0);
                setScale(scaleValueStart);
            }

            if (scrollY > oneColumnStop) {
                setPercentage(100);
                setScale(scaleValueEnd);
            }
        };

        if (scrollingImage !== null && typeof window !== 'undefined') {
            window.addEventListener('scroll', onScroll);
            window.addEventListener('resize', onScroll);
            return () => {
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onScroll);
            };
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (shouldMakeHeadingDynamic) {
            // if we're at mobile view, set the dynamic content
            if (windowWidth < breakpoints.md) {
                setDynamicContent((prevState) => {
                    return {
                        ...prevState,
                        introText: prevState.introText ?? introText,
                        pill: prevState.pill ?? pill,
                        leadingIcon: prevState.leadingIcon ?? leadingIcon,
                    };
                });
            } else {
                setDynamicContent({
                    title: null,
                    introText: null,
                    leadingIcon: null,
                    pill: null,
                });
            }
        }
    }, [windowWidth]);

    useEffect(() => {
        if (shouldMakeHeadingDynamic) {
            windowResizeHandler();

            if (typeof window !== 'undefined')
                window.addEventListener('resize', windowResizeHandler);
        }

        return () => {
            if (shouldMakeHeadingDynamic && typeof window !== 'undefined')
                window.removeEventListener('resize', windowResizeHandler);
        };
    }, []);

    return (
        <div
            className={`column-content ${addCustomClasses(
                'column-content__',
                additionalClasses
            )}`}
            css={css`
                justify-content: ${generateCssPropertyValueFromMap(
                    flexAlignmentMap,
                    alignment,
                    'initial'
                )};
                align-items: ${generateCssPropertyValueFromMap(
                    flexAlignmentMap,
                    horizontalAlignment,
                    'initial'
                )};
                text-align: ${horizontalAlignment
                    ? horizontalAlignment?.toLowerCase()
                    : 'left'};
                ${emotionBackgroundColorAttribute.css}
            `}
            ref={oneColumnBody}
        >
            {renderAllContent()}
        </div>
    );
};

Content.displayName = 'Content';

export default Content;
