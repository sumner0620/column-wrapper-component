import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { CwContext } from './CwProvider';
import { getStringifiedWysiwygContent } from '../../../assets/scripts/helpers';
import {
    addColorToTextString,
    colorizeMarkup,
} from '../../../assets/scripts/helpers/color-utils';
import { ctctColors } from '../../../config/colors';
import Pill from '../../pill';

const DynamicallyPlacedContent = () => {
    const { dynamicContent } = useContext(CwContext);
    const { leadingIcon, introText } = dynamicContent;
    const getFirstAndLastChar = (str) => {
        try {
            if (!str || typeof str !== 'string' || str.length === 0) return '';
            return str[0] + str[str.length - 1];
        } catch (err) {
            return str;
        }
    };

    const renderContent = (content) => {
        if (!content || typeof content !== 'object') return null;

        const { key, value: contentValue } = content;
        if (!contentValue) return null;

        try {
            switch (key) {
                case 'title':
                    return colorizeMarkup(
                        getStringifiedWysiwygContent(
                            contentValue,
                            Array.isArray(contentValue?.content) &&
                                contentValue?.content[0]?.value
                                ? contentValue.content[0].value
                                : ''
                        ),
                        getFirstAndLastChar(contentValue?.nodeType || '')
                    );

                case 'introText':
                    return (
                        <div className="column-content__eyebrow">
                            {leadingIcon &&
                                leadingIcon?.icon?.file?.url &&
                                leadingIcon?.alternateText && (
                                    <img
                                        src={leadingIcon.icon.file.url}
                                        className="leading-icon"
                                        alt={leadingIcon.alternateText}
                                        loading="lazy"
                                    />
                                )}
                            <p
                                className="column-content__intro-text"
                                css={css`
                                    color: ${ctctColors?.color13 || 'inherit'};
                                `}
                            >
                                {addColorToTextString(
                                    contentValue,
                                    true,
                                    false
                                )}
                            </p>
                        </div>
                    );
                case 'leadingIcon':
                    return !introText &&
                        leadingIcon &&
                        leadingIcon?.icon?.file?.url &&
                        leadingIcon?.alternateText ? (
                        <img
                            src={leadingIcon.icon.file.url}
                            className="leading-icon"
                            alt={leadingIcon.alternateText}
                            loading="lazy"
                        />
                    ) : null;

                case 'pill':
                    return <Pill {...contentValue} />;

                default:
                    return null;
            }
        } catch (err) {
            return null;
        }
    };
    const renderOrder = ['leadingIcon', 'introText', 'pill', 'title'];

    return (
        <div className="column-wrapper__dynamicContent">
            {dynamicContent && typeof dynamicContent === 'object'
                ? renderOrder.map(
                      (key) =>
                          dynamicContent[key] && (
                              <div key={key}>
                                  {renderContent({
                                      key,
                                      value: dynamicContent[key],
                                  })}
                              </div>
                          )
                  )
                : null}
        </div>
    );
};

export default DynamicallyPlacedContent;
