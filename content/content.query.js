/* eslint global-require: 0, import/extensions: 0 */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dynamicImageQuery = require('../image/dynamic.image.query.js');

const contentImageQuery = dynamicImageQuery();

const componentsQuery = `... on Node {
    ${require('../attribution/attribution.query.js')}
    ${require('../accordion/accordion-block.query.js')}
    ${require('../breadcrumbs/breadcrumbs.query.js')}
    ${require('../buy-flow/buy-flow.query.js')}
    ${require('../card/card.query.js')}
    ${require('../carousel/carousel.query.js')}
    ${require('../centered-cta/centered-cta.query.js')}
    ${require('../checkbox-text/checkbox-text.query.js')}
    ${require('../cta-button/cta-button.query.js')}
    ${require('../cta-button-wrapper/cta-button-wrapper.query.js')}
    ${require('../dynamic-feature-block/dynamic-feature-block.query.js')}
    ${require('../dynamic-feature-block-dropdown/dynamic-feature-block-dropdown.query.js')}
    ${require('../features-grid/features-grid.query.js')}
    ${require('../form/form.query.js')}
    ${require('../full-image-card/full-image-card.query.js')}
    ${require('../html/html.query.js')}
    ${contentImageQuery}
    ${require('../link/link.query.js')}
    ${require('../logo/logo.query.js')}
    ${require('../media-block/media-block.query.js')}
    ${require('../merch-tile/merch-tile.query.js')}
    ${require('../promotion-code-and-discounts/promotion-code-and-discounts.query.js')}
    ${require('../stat-card/stat-card.query.js')}
    ${require('../sub-features-block/sub-features-block.query.js')}
    ${require('../tabs/tabs.query.js')}
    ${require('../video-block/video-block.query.js')}
}`;

const referencesQuery = ` ... on Node {
    ${require('../attribution/attribution.query.js')}
    ${require('../accordion/accordion-block.query.js')}
    ${require('../buy-flow/buy-flow.query.js')}
    ${require('../buy-flow-progression-steps/buy-flow-progression-steps.query.js')}
    ${require('../byline/byline.query.js')}
    ${require('../card/card.query.js')}
    ${require('../checkbox-text/checkbox-text.query.js')}
    ${require('../cta-button/cta-button.query.js')}
    ${require('../cta-button-wrapper/cta-button-wrapper.query.js')}
    ${require('../form/form.query.js')}
    ${require('../full-image-card/full-image-card.query.js')}
    ${contentImageQuery}
    ${require('../link/link.query.js')}
    ${require('../logo/logo.query.js')}
    ${require('../media-block/media-block.query.js')}
    ${require('../pill/pill.query.js')}
    ${require('../sub-features-block/sub-features-block.query.js')}
    ${require('../video-block/video-block.query.js')}
}`;

module.exports = `
    ... on ContentfulContent {
        __typename
        id
        contentful_id
        ${require('../../assets/scripts/hocs/backgroundOptionsWrapper/backgroundOptions.query.js')}
        backgroundColor
        horizontalAlignment
        pill {
            __typename
            ... on Node {
                ${require('../pill/pill.query.js')}
            }
        }
        leadingIcon {
            alternateText
            icon {
                file {
                    url
                }
            }
        }
        introText
        scrollingImage {
            file {
                url
            }
            gatsbyImageData(
                quality: 90
                layout: CONSTRAINED
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
            )
        }
        text {
            raw
            references {
                ${referencesQuery}
            }
        }
        components {
            __typename
           ${componentsQuery}
        }
        alternateComponents {
            ... on Node {
                ... on ContentfulContent {
                    __typename
                    id
                    contentful_id
                    backgroundColor
                    horizontalAlignment
                    pill {
                        __typename
                        ... on Node {
                            ${require('../pill/pill.query.js')}
                        }
                    }
                    leadingIcon {
                        alternateText
                        icon {
                            file {
                                url
                            }
                        }
                    }
                    introText
                    scrollingImage {
                        file {
                            url
                        }
                        gatsbyImageData(
                            quality: 90
                            layout: CONSTRAINED
                            placeholder: BLURRED
                            formats: [AUTO, WEBP, AVIF]
                        )
                    }
                    text {
                        raw
                        references {
                            ${referencesQuery}
                        }
                    }
                    components {
                        __typename
                       ${componentsQuery}
                    }
                    ${require('../../assets/scripts/hocs/personalizationWrapper/audience.query.js')}
                }
            
            }
        }
        personalizationOn
    }
`;
