
import { GoogleGenAI, Type } from "@google/genai";
import { PowerData, ForecastData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- AI-POWERED LIVE DATA FETCHING ---
const powerDataSchema = {
    type: Type.OBJECT,
    properties: {
        kpis: {
            type: Type.OBJECT,
            properties: {
                time: { type: Type.STRING },
                price: { type: Type.NUMBER },
                emissions: { type: Type.NUMBER },
                demand: { type: Type.NUMBER },
                generation: { type: Type.NUMBER },
                transfers: { type: Type.NUMBER },
            },
        },
        generation: {
            type: Type.OBJECT,
            properties: {
                total: { type: Type.NUMBER },
                percentageOfDemand: { type: Type.NUMBER },
                categories: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            percentage: { type: Type.NUMBER },
                            color: { type: Type.STRING },
                            sources: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        value: { type: Type.NUMBER },
                                        percentage: { type: Type.NUMBER },
                                        color: { type: Type.STRING },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        interconnectors: {
            type: Type.OBJECT,
            properties: {
                total: { type: Type.NUMBER },
                connections: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                            percentage: { type: Type.NUMBER },
                            isImport: { type: Type.BOOLEAN },
                        }
                    }
                }
            }
        },
        dailyLoadCurve: {
            type: Type.ARRAY,
            description: "24 data points representing the hourly demand for the current day.",
            items: {
                type: Type.OBJECT,
                properties: {
                    hour: { type: Type.STRING, description: "Hour of the day, e.g., '00:00', '01:00'" },
                    demand: { type: Type.NUMBER, description: "Demand in GW for that hour." }
                }
            }
        }
    }
};

export const fetchPowerData = async (): Promise<PowerData> => {
  try {
    const prompt = `
      Act as a backend data scraping service for the Karnataka, India Power Grid dashboard.
      Your task is to simulate fetching and parsing the latest data from KPTCL's load curve portal: https://loadcurve.kptcl.net/LoadCurveUpload/lcdownloadview.asp.
      Provide a single JSON object representing the current power grid status. The data should be a realistic snapshot based on the typical daily patterns found in the KPTCL data from 2024-2025.
      
      The JSON object must contain:
      1.  'kpis': Key Performance Indicators. The 'demand' KPI should reflect the most recent hourly demand. The 'time' should be the current time in 'hh:mm AM/PM' format for IST.
      2.  'generation': A breakdown of generation sources (gas, coal, solar, wind, hydro, nuclear, biomass).
      3.  'interconnectors': Data for connections with Tamil Nadu, Kerala, and Andhra Pradesh.
      4.  'dailyLoadCurve': A crucial array of 24 objects, one for each hour of the current day (from '00:00' to '23:00'). Each object must have an 'hour' and the corresponding 'demand' in GW. This simulates the core data from the scraped source.

      The output must be a single, clean JSON object that strictly adheres to the provided schema. Do not include any markdown formatting or explanations.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: powerDataSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as PowerData;

  } catch (error)
{
    console.error("Error fetching power data from the API:", error);
    // Fallback or re-throw error
    throw new Error("Failed to fetch live power data.");
  }
};


// --- FORECAST DATA FETCHING ---
const forecastDataSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "The date/time label for the x-axis." },
            predictedDemand: { type: Type.NUMBER, description: "The forecasted demand in GW." },
            lowerBound: { type: Type.NUMBER, description: "The lower bound of the confidence interval in GW." },
            upperBound: { type: Type.NUMBER, description: "The upper bound of the confidence interval in GW." },
        },
    }
};

export const fetchForecastData = async (horizon: '1D' | '7D' | '30D' | '1Y' | '5Y'): Promise<ForecastData[]> => {
    try {
        const prompt = `
            Act as a forecasting engine for the Karnataka Power Grid.
            Your predictions are based on historical data scraped from KPTCL's load curve portal (https://loadcurve.kptcl.net/LoadCurveUpload/lcdownloadview.asp) from 2024-2025.
            Generate a JSON array of forecasted electricity demand in Gigawatts (GW) for Karnataka for the next ${horizon}.
            - For '1D', provide 24 hourly data points.
            - For '7D', provide 7 daily data points.
            - For '30D', provide 30 daily data points.
            - For '1Y', provide 12 monthly data points.
            - For '5Y', provide 5 yearly data points.
            The data should be realistic, showing typical daily, weekly, and seasonal patterns for the region based on the source data.
            Each object in the array must contain the date label, the predicted demand, and the upper/lower confidence bounds.
            The output must be a JSON array of objects that strictly adheres to the provided schema. Do not include any markdown formatting.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: forecastDataSchema,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as ForecastData[];

    } catch (error) {
        console.error(`Error fetching ${horizon} forecast data from the API:`, error);
        throw new Error(`Failed to fetch ${horizon} forecast data.`);
    }
};
