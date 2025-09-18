import React, { useContext } from 'react';
import { CwContext } from './CwProvider';
import Image from '../../image';

const DynamicallySourcedImage = (props) => {
    const { dynamicImageSource } = useContext(CwContext);

    return (
        <div className="dynamically-sourced-image">
            {dynamicImageSource && (
                <Image
                    key={dynamicImageSource?.contentful_id}
                    {...dynamicImageSource}
                />
            )}
        </div>
    );
};

export default DynamicallySourcedImage;
