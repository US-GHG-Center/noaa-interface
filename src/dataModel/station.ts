// Define the data model for a station
// StationProperties are the properties of the station including its position and elevation
// DatasetDetails are the details of the datasets available for the station


export interface Station {
    geometry: Geometry;
    properties: StationProperties;
    datasets?: DatasetDetails[];
}

export interface StationProperties {
    ogc_fid: number;
    site_code: string;
    site_country: string;
    site_elevation: string;
    site_elevation_unit: string;
    site_name: string;
}

export interface DatasetDetails {
    gas: string;
    gas_full_name: string;
    product: string;
    measurement_inst: string;
    methodology: string;
    time_period: string;
    url: string;
}

// helpers

export interface Geometry {
    type: string;
    coordinates: number[];
}
