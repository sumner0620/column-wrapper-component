import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import ColumnWrapper from '../../components/column-wrapper';

// Mock data for columns
const columns = [
    {
        title: 'Column 1',
        content: 'This is the content for column 1.',
        introText: 'Eyebrow text',
        text: 'This is the text for column 1.',
    },
    {
        title: 'Column 2',
        content: 'This is the content for column 2.',
        introText: 'Eyebrow text',
        text: 'This is the text for column 2.',
    },
    {
        title: 'Column 3',
        content: 'This is the content for column 3.',
        introText: 'Eyebrow text',
        text: 'This is the text for column 3.',
    },
];

const meta: Meta<typeof ColumnWrapper> = {
    title: 'Components/Column Wrapper',
    component: ColumnWrapper,
    decorators: [
        (Story) => (
            // <RecoilRoot>
            <Story />
            // </RecoilRoot>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof ColumnWrapper>;

export const Primary: Story = {
    args: {
        columns,
        columnHorizontalAlignment: 'center',
        columnWidths: '33.33 / 33.33 / 33.33',
        customClasses: ['custom-class'],
        roundedCorners: true,
        stackColumnsOnTablet: true,
        verticalAlignment: 'top',
        wrapperWidth: 'Fill Width',
    },
};

export const StackedColumnsOnTablet: Story = {
    args: {
        columns,
        columnHorizontalAlignment: 'left',
        columnWidths: '50 / 50',
        customClasses: ['stacked-columns'],
        roundedCorners: false,
        stackColumnsOnTablet: true,
        verticalAlignment: 'center',
        wrapperWidth: 'Full Width',
    },
};

export const WithoutStackingOnTablet: Story = {
    args: {
        columns,
        columnHorizontalAlignment: 'right',
        columnWidths: '25 / 25 / 50',
        customClasses: ['no-stack-tablet'],
        roundedCorners: true,
        stackColumnsOnTablet: false,
        verticalAlignment: 'bottom',
        wrapperWidth: 'Full Width',
    },
};

export const DynamicContent: Story = {
    args: {
        columns,
        columnHorizontalAlignment: 'center',
        columnWidths: '50 / 50',
        customClasses: ['dynamic-content'],
        roundedCorners: true,
        stackColumnsOnTablet: true,
        verticalAlignment: 'top',
        wrapperWidth: 'Fill Width',
        dynamicContent:
            '<p>This is some dynamic content placed in the grid.</p>',
    },
};
