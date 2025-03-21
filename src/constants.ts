// Enum for Instrument Types
export enum InstrumentType {
    FLASK = "flask",
    PFP = "pfp",
    IN_SITU = "insitu"
  }
  
  // Enum for Greenhouse Gases
  export enum GreenhouseGas {
    METHANE = "ch4",
    CARBON_DIOXIDE = "co2"
  }
  
  // Enum for Measurement Mediums
  export enum MeasurementMedium {
    SURFACE = "surface",
    TOWER = "tower",
    AIRCRAFT = "aircraft"
  }
  
  // Enum for Data Frequency
  export enum DataFrequency {
    CONTINUOUS = "continuous",
    NON_CONTINUOUS = "non-continuous"
  }
  
  // Type for Greenhouse Gas Properties
  type GasProperties = {
    short: string;
    fullName: string;
    unit: string;
  };
  
  // Greenhouse Gas Details
  export const greenhouseGases: Record<GreenhouseGas, GasProperties> = {
    [GreenhouseGas.METHANE]: { short: "CH₄", fullName: "Methane", unit: "ppb" },
    [GreenhouseGas.CARBON_DIOXIDE]: { short: "CO₂", fullName: "Carbon Dioxide", unit: "ppm" }
  };
  
  // Type for Instrument Properties
  type InstrumentProperties = {
    short: string;
    fullName: string;
  };
  
  // Instrument Types Mapping
  export const measurementInstruments: Record<InstrumentType, InstrumentProperties> = {
    [InstrumentType.FLASK]: { short: "Flask", fullName: "Flask" },
    [InstrumentType.PFP]: { short: "PFP", fullName: "PFP" },
    [InstrumentType.IN_SITU]: { short: "In-situ", fullName: "In-situ" }
  };

  export const timePeriodMapping: Record<string, string> = {
    "hourly": "Hourly",
    "daily": "Daily",
    "weekly": "Weekly",
    "monthly": "Monthly",
    "quarterly": "Quarterly",
    "yearly": "Yearly",
  };
  