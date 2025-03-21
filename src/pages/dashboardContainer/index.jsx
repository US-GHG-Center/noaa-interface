import React, { useEffect, useState } from 'react';
import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromFeaturesAPI } from '../../services/api';
import {
  dataTransformationStation,
  dataTransformCollection,
  updateCollectionItemValues,
} from './helper/dataTransform';
import { useSearchParams } from 'react-router-dom';
import { zoom } from 'chartjs-plugin-zoom';

const FEATURES_API_URL = process.env.REACT_APP_FEATURES_API_URL || '';
const stationUrl = `${FEATURES_API_URL}/collections/public.station_metadata/items`;
const collectionUrl = `${FEATURES_API_URL}/collections`;

export function DashboardContainer() {
  const [selectedStationId, setSelectedStationId] = useState("");
  const [stations, setStations] = useState({});
  const [loading, setLoading] = useState(true);

  // get the query params
  const [ searchParams ] = useSearchParams();
  const [ agency ] = useState(searchParams.get('agency') || "noaa"); // nist, noaa, or nasa
  const [ ghg, setSelectedGHG ] = useState(searchParams.get('ghg') || "co2"); // co2 or ch4
  const [ stationCode ] = useState(searchParams.get('station-code') || ""); // buc, smt, etc
  const [ zoomLevel, setZoomLevel ] = useState (searchParams.get('zoom-level')); // let default zoom level controlled by map component
  const [zoomLocation, setZoomLocation] = useState(
    searchParams.get('zoom-location') || []
  ); // let default zoom location be controlled by map component
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch and transform station metadata
        const stationApiResponse = await fetchAllFromFeaturesAPI(stationUrl);
        const transformedStationData = dataTransformationStation(stationApiResponse);
        setStations(transformedStationData);

        // Fetch and transform collection data
        const collectionApiResponse = await fetchAllFromFeaturesAPI(collectionUrl);
        dataTransformCollection(collectionApiResponse, transformedStationData, agency);
        setStations(transformedStationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Dashboard
      stationData={stations}
      setStationData={setStations}
      selectedStationId={selectedStationId}
      setSelectedStationId={setSelectedStationId}
      ghg={ghg}
      zoomLevel={zoomLevel}
      setZoomLevel={setZoomLevel}
      zoomLocation={zoomLocation}
      setZoomLocation={setZoomLocation}
      loadingData={loading}
    />
  );
}
