import { Client, TravelMode, TrafficModel, TravelRestriction, Language } from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface RouteData {
  route_id?: number;
  summary?: string;
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  duration_in_traffic?: {
    text: string;
    value: number; // in seconds
  };
  polyline: string;
  legs: Array<{
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_address: string;
    end_address: string;
    start_location: { lat: number; lng: number };
    end_location: { lat: number; lng: number };
    steps: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      html_instructions: string;
      start_location: { lat: number; lng: number };
      end_location: { lat: number; lng: number };
    }>;
  }>;
}

export interface TrafficData {
  current_conditions: string;
  delay_factor: number; // 1.0 = no delay, 1.5 = 50% delay
  alternative_routes: number;
}

class GoogleMapsService {
  private client: Client;

  constructor() {
    // Validate Google Maps API key
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured. Please set GOOGLE_MAPS_API_KEY in your .env file');
    }
    this.client = new Client({});
  }

  async getRoute(
    origin: string,
    destination: string,
    vehicleType: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER' = 'LCV'
  ): Promise<RouteData> {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY!,
          mode: TravelMode.driving,
          departure_time: 'now', // For real-time traffic
          traffic_model: TrafficModel.best_guess,
          avoid: vehicleType === 'HCV' ? [TravelRestriction.tolls] : [], // HCVs avoid tolls by default
          alternatives: true, // Get alternative routes
          region: 'in', // Focus on India
          language: Language.en
        }
      });

      if (response.data.status !== 'OK' || !response.data.routes.length) {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }

      const route = response.data.routes[0]; // Best route
      
      return {
        distance: route.legs[0].distance,
        duration: route.legs[0].duration,
        duration_in_traffic: route.legs[0].duration_in_traffic,
        polyline: route.overview_polyline.points,
        legs: route.legs.map(leg => ({
          distance: leg.distance,
          duration: leg.duration,
          start_address: leg.start_address,
          end_address: leg.end_address,
          start_location: leg.start_location,
          end_location: leg.end_location,
          steps: leg.steps.map(step => ({
            distance: step.distance,
            duration: step.duration,
            html_instructions: step.html_instructions,
            start_location: step.start_location,
            end_location: step.end_location
          }))
        }))
      };
    } catch (error) {
      console.error('Google Maps API error:', error);
      throw new Error('Failed to fetch route data from Google Maps');
    }
  }

  async getMultipleRoutes(
    origin: string,
    destination: string,
    vehicleType: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER' = 'LCV',
    optimizationWeights?: { emissionsWeight: number; timeWeight: number; costWeight: number }
  ): Promise<RouteData[]> {
    try {
      console.log('COST-OPTIMIZED: Fetching routes with minimal API calls');
      
      // STEP 1: Primary request with alternatives (most cost-efficient)
      const primaryResponse = await this.client.directions({
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY!,
          mode: TravelMode.driving,
          departure_time: 'now',
          traffic_model: TrafficModel.best_guess,
          alternatives: true, // This gives us multiple routes in one call
          region: 'in',
          language: Language.en
        }
      });

      if (primaryResponse.data.status !== 'OK' || !primaryResponse.data.routes.length) {
        throw new Error(`Google Maps API error: ${primaryResponse.data.status}`);
      }

      let allRoutes = [...primaryResponse.data.routes];
      console.log(`Primary request returned ${allRoutes.length} routes`);

      // STEP 2: ALWAYS request multiple diverse route types for better demo
      const additionalRequests = [];
      const weights = optimizationWeights || { emissionsWeight: 40, timeWeight: 35, costWeight: 25 };
      
      console.log(`Optimization weights: Time(${weights.timeWeight}%), Cost(${weights.costWeight}%), Emissions(${weights.emissionsWeight}%)`);
      
      // ALWAYS get these 3 different route types for variety
      
      // Route Type 1: Cost-optimized (avoid tolls)
      console.log('Adding toll-avoiding route for cost optimization');
      additionalRequests.push(
        this.client.directions({
          params: {
            origin,
            destination,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            mode: TravelMode.driving,
            avoid: [TravelRestriction.tolls],
            region: 'in',
            language: Language.en
          }
        })
      );
      
      // Route Type 2: Emissions-optimized (avoid highways)
      console.log('Adding highway-avoiding route for emissions optimization');
      additionalRequests.push(
        this.client.directions({
          params: {
            origin,
            destination,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            mode: TravelMode.driving,
            avoid: [TravelRestriction.highways],
            region: 'in',
            language: Language.en
          }
        })
      );
      
      // Route Type 3: Time-optimized (shortest time with traffic)
      console.log('Adding time-optimized route with current traffic');
      additionalRequests.push(
        this.client.directions({
          params: {
            origin,
            destination,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            mode: TravelMode.driving,
            departure_time: 'now',
            traffic_model: TrafficModel.optimistic,
            region: 'in',
            language: Language.en
          }
        })
      );

      // Execute additional requests only if needed
      if (additionalRequests.length > 0) {
        console.log(`Making ${additionalRequests.length} additional API calls`);
        const additionalResponses = await Promise.allSettled(additionalRequests);
        
        additionalResponses.forEach((response: any) => {
          if (response.status === 'fulfilled' && 
              response.value.data.status === 'OK' && 
              response.value.data.routes.length > 0) {
            response.value.data.routes.forEach((route: any) => {
              // Avoid duplicate routes by checking if we already have a similar route
              const isDuplicate = allRoutes.some(existingRoute => 
                Math.abs(existingRoute.legs[0].distance.value - route.legs[0].distance.value) < 1000 &&
                Math.abs(existingRoute.legs[0].duration.value - route.legs[0].duration.value) < 300
              );
              
              if (!isDuplicate) {
                allRoutes.push(route);
              }
            });
          }
        });
      }

      if (allRoutes.length === 0) {
        throw new Error('No routes found from Google Maps API');
      }

      // STEP 3: Sort routes by duration (fastest first)
      allRoutes.sort((a, b) => {
        const aDuration = a.legs[0].duration_in_traffic?.value || a.legs[0].duration.value;
        const bDuration = b.legs[0].duration_in_traffic?.value || b.legs[0].duration.value;
        return aDuration - bDuration;
      });

      // STEP 4: Limit to maximum 4 routes (1 primary + 3 alternatives)
      const limitedRoutes = allRoutes.slice(0, 4);

      console.log(`COST SUMMARY: Made ${1 + additionalRequests.length} API calls, returning ${limitedRoutes.length} routes`);

      return limitedRoutes.map((route, index) => ({
        route_id: index,
        distance: route.legs[0].distance,
        duration: route.legs[0].duration,
        duration_in_traffic: route.legs[0].duration_in_traffic,
        polyline: route.overview_polyline.points,
        summary: route.summary || `Route ${index + 1}`,
        legs: route.legs.map((leg: any) => ({
          distance: leg.distance,
          duration: leg.duration,
          start_address: leg.start_address,
          end_address: leg.end_address,
          start_location: leg.start_location,
          end_location: leg.end_location,
          steps: leg.steps.map((step: any) => ({
            distance: step.distance,
            duration: step.duration,
            html_instructions: step.html_instructions,
            start_location: step.start_location,
            end_location: step.end_location,
            maneuver: step.maneuver
          }))
        }))
      }));
    } catch (error) {
      console.error('Google Maps API error:', error);
      throw new Error('Failed to fetch multiple routes from Google Maps');
    }
  }

  async getTrafficData(
    origin: string,
    destination: string
  ): Promise<TrafficData> {
    try {
      // Get route with and without traffic to compare
      const [withTraffic, withoutTraffic] = await Promise.all([
        this.client.directions({
          params: {
            origin,
            destination,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            mode: TravelMode.driving,
            departure_time: 'now',
            traffic_model: TrafficModel.best_guess,
            region: 'in'
          }
        }),
        this.client.directions({
          params: {
            origin,
            destination,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            mode: TravelMode.driving,
            region: 'in'
          }
        })
      ]);

      const trafficDuration = withTraffic.data.routes[0]?.legs[0]?.duration_in_traffic?.value || 0;
      const normalDuration = withoutTraffic.data.routes[0]?.legs[0]?.duration?.value || 0;
      
      const delayFactor = normalDuration > 0 ? trafficDuration / normalDuration : 1.0;
      
      let conditions = 'LIGHT';
      if (delayFactor > 1.4) conditions = 'HEAVY';
      else if (delayFactor > 1.2) conditions = 'MODERATE';

      return {
        current_conditions: conditions,
        delay_factor: delayFactor,
        alternative_routes: withTraffic.data.routes.length
      };
    } catch (error) {
      console.error('Traffic data error:', error);
      return {
        current_conditions: 'UNKNOWN',
        delay_factor: 1.0,
        alternative_routes: 1
      };
    }
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY!,
          region: 'in'
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
}

export const googleMapsService = new GoogleMapsService();