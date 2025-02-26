// Collection item definition
export interface Collection {
    id: string;
    agency: string;
    product: string;
    measurement_inst: string;
    methodology: string;
    sitecode: string;
    country: string;
    gas: string;
    time_period: string;
    title: string;
    links: Link[];
}

// Feature item definition
export interface FeatureItem {
    id: string;
    type: string;
    geometry: Geometry;
    properties: FeatureProperties;
    links: Link[];
}

// Feature properties definition
export interface FeatureProperties {
    datetime: DateTime;
    ogc_fid: number;
    site_country: string;
    site_elevation: string;
    site_elevation_unit: string;
    site_name: string;
    value: string;
}

// helpers

export type DateTime = string;
export type Lon = number;
export type Lat = number;
export type Coordinates = [Lon, Lat];

export interface Link {
    title?: string;
    href: string;
    rel?: string;
    type?: string;
}

export interface Geometry {
    type: string;
    coordinates: Coordinates;
}
