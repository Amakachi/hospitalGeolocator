import React from 'react';
import HomeOutlined from '@ant-design/icons';

const MapMarker = (({ name, key }:any) => {
    return (
        <div key={key}>
            <span className="brand-red">{name}</span>
            <HomeOutlined  />
        </div>
    );
});

export default MapMarker;