import { Request, Response } from 'express';
import { googleMapsService } from '../services/googleMapsService';
import { openWeatherService } from '../services/openWeatherService';
import { staticDataService } from '../services/staticDataService';

interface OptimizeRouteRequest {
  source: string;
  destination: string;
  vehicleType?: 'LCV' | 'MCV' | 'HCV' | 'THREE_WHEELER';
  fuelType?: 'DIESEL' | 'PETROL' | 'CNG' | 'ELECTRIC';
  includeWeather?: boolean;
  includeAlternatives?: boolean;
}

export const optimizeRoute = async (req: Request, res: Response) => {
  try {
    const {
      source,
      destination,
      vehicleType = 'LCV',
      fuelType = 'DIESEL',
      includeWeather = true,
      includeAlternatives = false
    }: OptimizeRouteRequest = req.body;

    // Validate required fields
    if (!source || !destination) {
      return res.status(400).json({
        error: 'Source and destination are required'
      });
    }

    console.log(`Optimizing route from ${source} to ${destination} for ${vehicleType} vehicle`);

    // 1. Get route data from Google Maps (dynamic)
    const routePromise = includeAlternatives 
      ? googleMapsService.getMultipleRoutes(source, destination, vehicleType)
      : googleMapsService.getRoute(source, destination, vehicleType);

    // 2. Get traffic data (dynamic)
    const trafficPromise = googleMapsService.getTrafficData(source, destination);

    // Execute route and traffic calls in parallel
    const [routeData, trafficData] = await Promise.all([
      routePromise,
      trafficPromise
    ]);

    // Handle multiple routes or single route
    const primaryRoute = Array.isArray(routeData) ? routeData[0] : routeData;
    const alternativeRoutes = Array.isArray(routeData) ? routeData.slice(1) : [];

    // 3. Get weather data along route (dynamic) - optional
    let weatherData = null;
    if (includeWeather) {
      try {
        // Get coordinates from route start and end points
        const startCoords = await googleMapsService.geocodeAddress(source);
        const endCoords = await googleMapsService.geocodeAddress(destination);
        
        if (startCoords && endCoords) {
          weatherData = await openWeatherService.getWeatherAlongRoute(
            startCoords.lat,
            startCoords.lng,
            endCoords.lat,
            endCoords.lng
          );
        }
      } catch (weatherError) {
        console.warn('Weather data unavailable:', weatherError);
        // Continue without weather data
      }
    }

    // 4. Calculate fuel consumption and emissions (static data)
    const distanceKm = primaryRoute.distance.value / 1000; // Convert meters to km
    const fuelConsumption = staticDataService.calculateFuelConsumption(
      distanceKm,
      vehicleType,
      fuelType
    );

    // 5. Calculate additional metrics
    const environmentalScore = staticDataService.calculateEnvironmentalScore(
      fuelConsumption.co2Emissions,
      distanceKm
    );

    // 6. Determine route complexity
    const hasUrbanAreas = source.toLowerCase().includes('mumbai') || 
                         source.toLowerCase().includes('delhi') ||
                         destination.toLowerCase().includes('mumbai') ||
                         destination.toLowerCase().includes('delhi');
    
    const complexityFactor = staticDataService.getRouteComplexityFactor(distanceKm, hasUrbanAreas);

    // 7. Calculate adjusted travel time with weather and traffic
    let adjustedDuration = primaryRoute.duration_in_traffic?.value || primaryRoute.duration.value;
    
    // Apply weather adjustment if available
    if (weatherData?.start?.driving_conditions?.safety_score && weatherData.start.driving_conditions.safety_score < 70) {
      adjustedDuration *= 1.2; // 20% longer in poor weather
    }

    // 8. Build comprehensive response
    const optimizedRoute = {
      // Route Information
      source,
      destination,
      vehicleType,
      fuelType,
      
      // Distance & Time (Dynamic from Google Maps)
      distance: {
        value: primaryRoute.distance.value, // meters
        text: primaryRoute.distance.text,
        km: Math.round(distanceKm * 10) / 10
      },
      duration: {
        normal: {
          value: primaryRoute.duration.value, // seconds
          text: primaryRoute.duration.text,
          hours: Math.round(primaryRoute.duration.value / 3600 * 10) / 10
        },
        with_traffic: primaryRoute.duration_in_traffic ? {
          value: primaryRoute.duration_in_traffic.value,
          text: primaryRoute.duration_in_traffic.text,
          hours: Math.round(primaryRoute.duration_in_traffic.value / 3600 * 10) / 10
        } : null,
        adjusted: {
          value: Math.round(adjustedDuration),
          text: `${Math.round(adjustedDuration / 60)} mins`,
          hours: Math.round(adjustedDuration / 3600 * 10) / 10
        }
      },

      // Traffic Information (Dynamic from Google Maps)
      traffic: {
        current_conditions: trafficData.current_conditions,
        delay_factor: trafficData.delay_factor,
        alternative_routes_available: trafficData.alternative_routes,
        congestion_level: trafficData.delay_factor > 1.4 ? 'HIGH' : 
                         trafficData.delay_factor > 1.2 ? 'MEDIUM' : 'LOW'
      },

      // Weather Information (Dynamic from OpenWeather)
      weather: weatherData ? {
        start_location: {
          location: weatherData.start.location.name,
          temperature: weatherData.start.current.temperature,
          condition: weatherData.start.current.weather_condition,
          description: weatherData.start.current.weather_description,
          visibility: weatherData.start.current.visibility,
          wind_speed: weatherData.start.current.wind_speed,
          precipitation: weatherData.start.current.precipitation,
          driving_safety_score: weatherData.start.driving_conditions.safety_score,
          is_safe: weatherData.start.driving_conditions.is_safe_for_driving,
          recommendations: weatherData.start.driving_conditions.recommendations
        },
        end_location: {
          location: weatherData.end.location.name,
          temperature: weatherData.end.current.temperature,
          condition: weatherData.end.current.weather_condition,
          description: weatherData.end.current.weather_description,
          visibility: weatherData.end.current.visibility,
          wind_speed: weatherData.end.current.wind_speed,
          precipitation: weatherData.end.current.precipitation,
          driving_safety_score: weatherData.end.driving_conditions.safety_score,
          is_safe: weatherData.end.driving_conditions.is_safe_for_driving,
          recommendations: weatherData.end.driving_conditions.recommendations
        },
        overall_safety_score: Math.min(
          weatherData.start.driving_conditions.safety_score,
          weatherData.end.driving_conditions.safety_score
        )
      } : null,

      // Fuel & Emissions (Static calculations)
      fuel_consumption: {
        fuel_required: fuelConsumption.fuelRequired,
        fuel_cost: fuelConsumption.fuelCost,
        fuel_type: fuelConsumption.fuelType,
        efficiency: fuelConsumption.efficiency,
        unit: fuelType === 'ELECTRIC' ? 'kWh' : fuelType === 'CNG' ? 'kg' : 'liters'
      },
      
      emissions: {
        co2_emissions: fuelConsumption.co2Emissions,
        environmental_score: environmentalScore,
        unit: 'kg CO2'
      },

      // Route Analysis
      route_analysis: {
        complexity_factor: complexityFactor,
        estimated_cost: fuelConsumption.fuelCost,
        safety_rating: weatherData ? 
          Math.min(weatherData.start.driving_conditions.safety_score, weatherData.end.driving_conditions.safety_score) : 85,
        recommended_departure_time: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 mins from now
      },

      // Route Path (Dynamic from Google Maps)
      route_path: {
        polyline: primaryRoute.polyline,
        steps: primaryRoute.legs[0].steps.length,
        start_address: primaryRoute.legs[0].start_address,
        end_address: primaryRoute.legs[0].end_address
      },

      // Alternative Routes (if requested)
      alternatives: includeAlternatives ? alternativeRoutes.map((route, index) => ({
        route_id: index + 1,
        distance: route.distance,
        duration: route.duration,
        duration_with_traffic: route.duration_in_traffic,
        polyline: route.polyline
      })) : [],

      // Metadata
      optimized: true,
      calculation_time: new Date().toISOString(),
      data_sources: {
        route_data: 'Google Maps API',
        traffic_data: 'Google Maps API',
        weather_data: includeWeather ? 'OpenWeather API' : null,
        fuel_emissions: 'Static calculations'
      }
    };

    res.json(optimizedRoute);

  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({
      error: 'Route optimization failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}; 