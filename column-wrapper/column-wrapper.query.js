/* eslint global-require: 0, import/extensions: 0 */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dynamicImageQuery = require('../image/dynamic.image.query.js');

const cwImageQuery = dynamicImageQuery();

module.exports = `
    ... on ContentfulColumnWrapper {
        __typename
        wrapperWidth
        columnHorizontalAlignment
        columnWidths
        verticalAlignment
        stackColumnsOnTablet
        roundedCorners
        customClasses
        columnWidthValues
        columns {
            __typename
            ... on Node {
                ${cwImageQuery}
                ${require('../content/content.query.js')}
                ... on ContentfulDynamicallySourcedImage {
                    __typename
                    contentful_id
                    title
                }
            }
        }
        mobileMedia
    }
`;
