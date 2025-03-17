import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromFeaturesAPI } from '../../services/api';
import {
  dataTransformationStation,
  dataTransformCollection,
  dataTransformationFeatureItems,
  mapDatasetsToStations,
} from './helper/dataTransform';
import { getMockStationData } from '../../utils/datahelpers';
import { transform } from 'typescript';

const REACT_APP_FEATURES_API_URL = process.env.REACT_APP_FEATURES_API_URL || '';

export function DashboardContainer() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationUrl = 'https://dev.ghg.center/api/features/collections/public.station_metadata/items';
        const collectionUrl = 'https://dev.ghg.center/api/features/collections';

        let transformedStationData, transformedCollectionData;

        // Fetch and process station data
        const stationApiResponse = fetchAllFromFeaturesAPI(stationUrl);
        stationApiResponse.then((data) => {
          transformedStationData = dataTransformationStation(data);

          // Fetch and process collection data after station data
          const collectionApiResponse = fetchAllFromFeaturesAPI(collectionUrl);
          collectionApiResponse.then((data) => {
            transformedCollectionData = dataTransformCollection(data);

            // Now map the datasets to stations once both data are ready
            mapDatasetsToStations(transformedCollectionData, transformedStationData);
            console.log('transformedStationData', transformedStationData);

            // Feature Items
            const featureItemsUrl = transformedStationData[`ABP`].datasets[0].url;
            const featureItemsApiResponse = fetchAllFromFeaturesAPI(featureItemsUrl);
            featureItemsApiResponse.then((data) => {
              const transformedFeatureItems = dataTransformationFeatureItems(data);
              console.log('transformedFeatureItems', transformedFeatureItems);
            });
          });
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().catch(console.error);
  }, []); // only on initial mount

  // return (
  //   <Dashboard
  //     data={collectionItems}
  //     zoomLocation={zoomLocation}
  //     zoomLevel={zoomLevel}
  //     setZoomLocation={setZoomLocation}
  //     setZoomLevel={setZoomLevel}
  //     collectionMeta={collectionMeta}
  //     dataTree={dataTree}
  //     metaDataTree={metaDataTree}
  //     vizItemMetaData={vizItemMetaData}
  //     collectionId={collectionId}
  //     loadingData={loadingData}
  //   />
  // );

  return (
    <h3>NOAA Dataset</h3>
  );
}