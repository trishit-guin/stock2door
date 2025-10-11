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
  optimizationWeights?: {
    emissionsWeight: number;
    timeWeight: number;
    costWeight: number;
  };
}

export const optimizeRoute = async (req: Request, res: Response) => {
  try {
    const {
      source,
      destination,
      vehicleType = 'LCV',
      fuelType = 'DIESEL',
      includeWeather = true,
      includeAlternatives = false,
      optimizationWeights = { emissionsWeight: 40, timeWeight: 35, costWeight: 25 }
    }: OptimizeRouteRequest = req.body;

    // Validate required fields
    if (!source || !destination) {
      return res.status(400).json({
        error: 'Source and destination are required'
      });
    }

    console.log(`Optimizing route from ${source} to ${destination} for ${vehicleType} vehicle`);

    // 1. Get route data from Google Maps (dynamic)
    const routeData = includeAlternatives 
      ? await googleMapsService.getMultipleRoutes(source, destination, vehicleType, optimizationWeights)
      : await googleMapsService.getRoute(source, destination, vehicleType);

    // Update references after potential reordering
    const primaryRoute = Array.isArray(routeData) ? routeData[0] : routeData;
    const alternativeRoutes = Array.isArray(routeData) ? routeData.slice(1) : [];
    
    // COST-OPTIMIZED: Get traffic data only if we don't have traffic info from route
    let trafficData = null;
    
    if (!primaryRoute.duration_in_traffic) {
      console.log('COST-OPTIMIZED: Making separate traffic call as route data lacks traffic info');
      trafficData = await googleMapsService.getTrafficData(source, destination);
    } else {
      console.log('COST-OPTIMIZED: Using traffic data from route response, saving API call');
      // Extract traffic data from route response
      trafficData = {
        current_conditions: primaryRoute.duration_in_traffic.value > primaryRoute.duration.value * 1.2 ? 'HEAVY' : 'MODERATE',
        delay_factor: (primaryRoute.duration_in_traffic.value / primaryRoute.duration.value),
        congestion_level: primaryRoute.duration_in_traffic.value > primaryRoute.duration.value * 1.3 ? 'HIGH' : 
                         primaryRoute.duration_in_traffic.value > primaryRoute.duration.value * 1.1 ? 'MEDIUM' : 'LOW',
        alternative_routes_available: Array.isArray(routeData) ? routeData.length - 1 : 0
      };
    }

    console.log(`Found ${Array.isArray(routeData) ? routeData.length : 1} routes`);

    // Score and reorder routes based on optimization weights - ENHANCED FOR DEMO
    if (includeAlternatives && Array.isArray(routeData) && routeData.length > 1) {
      console.log(`\n=== ROUTE SCORING SYSTEM ===`);
      console.log(`Weights: Time(${optimizationWeights.timeWeight}%), Cost(${optimizationWeights.costWeight}%), Emissions(${optimizationWeights.emissionsWeight}%)`);
      
      const scoredRoutes = routeData.map((route, index) => {
        const distanceKm = route.distance.value / 1000;
        const durationMinutes = (route.duration_in_traffic?.value || route.duration.value) / 60;
        
        // Calculate estimated fuel consumption and cost
        const fuelConsumption = staticDataService.calculateFuelConsumption(distanceKm, vehicleType, fuelType);
        
        // Enhanced scoring with more dramatic differences
        let timeScore = durationMinutes; // minutes
        let costScore = fuelConsumption.fuelCost;
        let emissionsScore = fuelConsumption.co2Emissions;
        
        // Apply route-type specific bonuses/penalties for more dramatic differences
        const routeSummary = route.summary || '';
        const hasHighways = routeSummary.toLowerCase().includes('highway') || routeSummary.toLowerCase().includes('nh-') || route.legs[0].duration.value < (route.legs[0].distance.value / 1000) * 60; // Speed > 60 km/h indicates highway
        const hasTolls = routeSummary.toLowerCase().includes('toll') || hasHighways; // Assume highways have tolls
        
        // DRAMATIC ADJUSTMENTS for demo purposes
        if (hasTolls) {
          costScore += 200; // Heavy penalty for toll routes in cost calculation
          timeScore -= 15; // Time bonus for highways (faster)
          console.log(`Route ${index + 1}: TOLL ROUTE - Cost penalty +₹200, Time bonus -15min`);
        }
        
        if (!hasHighways) {
          emissionsScore -= 5; // Emissions bonus for non-highway routes
          timeScore += 25; // Time penalty for local roads (slower)
          costScore -= 50; // Cost bonus for avoiding tolls
          console.log(`Route ${index + 1}: LOCAL ROUTE - Emissions bonus -5kg, Time penalty +25min, Cost bonus -₹50`);
        }
        
        // Amplify the weight effects for more dramatic differences
        const amplificationFactor = 3; // Make differences more pronounced
        
        const totalScore = (
          (optimizationWeights.timeWeight / 100) * timeScore * amplificationFactor +
          (optimizationWeights.costWeight / 100) * (costScore / 10) * amplificationFactor +
          (optimizationWeights.emissionsWeight / 100) * emissionsScore * amplificationFactor
        );
        
        console.log(`Route ${index + 1}: Distance(${distanceKm.toFixed(1)}km), Time(${(durationMinutes/60).toFixed(1)}h), Cost(₹${costScore}), Emissions(${emissionsScore}kg), Score(${totalScore.toFixed(2)})`);
        
        return { 
          route, 
          score: totalScore,
          metrics: { distanceKm, durationMinutes, costScore, emissionsScore, hasHighways, hasTolls }
        };
      });
      
      // Sort by score (lower is better) and extract routes
      const sortedRoutes = scoredRoutes.sort((a, b) => a.score - b.score);
      
      console.log(`\n=== ROUTE RANKING ===`);
      sortedRoutes.forEach((item, index) => {
        const { metrics } = item;
        console.log(`Rank ${index + 1}: ${metrics.hasHighways ? 'Highway' : 'Local'} route - Distance: ${metrics.distanceKm.toFixed(1)}km, Time: ${(metrics.durationMinutes/60).toFixed(1)}h, Cost: ₹${metrics.costScore}, Emissions: ${metrics.emissionsScore}kg, Score: ${item.score.toFixed(2)}`);
      });
      
      // Update route data with reordered routes
      const reorderedRoutes = sortedRoutes.map(item => item.route);
      routeData.length = 0;
      routeData.push(...reorderedRoutes);
      
      console.log(`Routes reordered successfully based on optimization weights!\n`);
    }

    // 3. Get weather data along route (dynamic) - optional
    let weatherData = null;
    if (includeWeather) {
      try {
        // COST-OPTIMIZED: Extract coordinates from route data instead of making separate geocoding calls
        const startCoords = {
          lat: primaryRoute.legs[0].start_location.lat,
          lng: primaryRoute.legs[0].start_location.lng
        };
        const endCoords = {
          lat: primaryRoute.legs[0].end_location.lat,
          lng: primaryRoute.legs[0].end_location.lng
        };
        
        console.log('COST-OPTIMIZED: Using route coordinates instead of geocoding calls');
        
        // Calculate route duration in minutes from the primary route
        const routeDurationMinutes = Math.ceil(
          (primaryRoute.duration_in_traffic?.value || primaryRoute.duration.value) / 60
        );
        const departureTime = new Date(); // Current time as departure time
        
        // Extract route steps for accurate waypoint calculation
        const routeSteps = primaryRoute.legs[0].steps.map((step: any) => ({
          start_location: step.start_location,
          end_location: step.end_location,
          duration: step.duration
        }));
        
        weatherData = await openWeatherService.getWeatherAlongRoute(
          startCoords.lat,
          startCoords.lng,
          endCoords.lat,
          endCoords.lng,
          routeDurationMinutes,
          departureTime,
          routeSteps
        );
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
    if (weatherData?.overall_safety_score && weatherData.overall_safety_score < 70) {
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

      // Weather Information (Dynamic from OpenWeather) - Enhanced with route waypoints
      weather: weatherData ? {
        waypoints: weatherData.waypoints.map((waypoint: any, index: number) => ({
          sequence: waypoint.sequence || (index + 1),
          location: waypoint.location,
          current: waypoint.current,
          driving_conditions: waypoint.driving_conditions,
          estimated_arrival_time: waypoint.estimated_arrival_time,
          distance_from_start: waypoint.distance_from_start,
          // Legacy fields for backward compatibility
          temperature: waypoint.current.temperature,
          feels_like: waypoint.current.feels_like,
          condition: waypoint.current.weather_condition,
          description: waypoint.current.weather_description,
          visibility: waypoint.current.visibility,
          humidity: waypoint.current.humidity,
          wind_speed: waypoint.current.wind_speed,
          wind_direction: waypoint.current.wind_direction,
          precipitation: waypoint.current.precipitation,
          cloud_cover: waypoint.current.cloud_cover,
          driving_safety_score: waypoint.driving_conditions.safety_score,
          is_safe: waypoint.driving_conditions.is_safe_for_driving,
          risk_factors: waypoint.driving_conditions.risk_factors,
          recommendations: waypoint.driving_conditions.recommendations
        })),
        overall_safety_score: weatherData.overall_safety_score,
        route_recommendations: weatherData.route_recommendations,
        total_waypoints: weatherData.total_waypoints || weatherData.waypoints.length
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
        safety_rating: weatherData ? weatherData.overall_safety_score : 85,
        recommended_departure_time: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 mins from now
      },

      // Determine main route characteristics
      main_route_summary: (() => {
        const routeSummary = primaryRoute.summary || '';
        const hasHighways = routeSummary.toLowerCase().includes('highway') || routeSummary.toLowerCase().includes('nh-') || primaryRoute.legs[0].duration.value < (primaryRoute.legs[0].distance.value / 1000) * 60;
        const hasTolls = routeSummary.toLowerCase().includes('toll') || hasHighways;
        
        let description = '';
        if (hasHighways && hasTolls) {
          description = 'Primary Route: Fast Highway (with tolls)';
        } else if (hasHighways && !hasTolls) {
          description = 'Primary Route: Highway (toll-free)';
        } else {
          description = 'Primary Route: Local Roads (scenic)';
        }
        
        // Add optimization focus
        const maxWeight = Math.max(optimizationWeights.timeWeight, optimizationWeights.costWeight, optimizationWeights.emissionsWeight);
        if (optimizationWeights.timeWeight === maxWeight) {
          description += ' - Time Optimized';
        } else if (optimizationWeights.costWeight === maxWeight) {
          description += ' - Cost Optimized';
        } else {
          description += ' - Eco Optimized';
        }
        
        return description;
      })(),

      // Route Path Details (Enhanced with Google Directions data)
      route_path: {
        polyline: primaryRoute.polyline,
        steps: primaryRoute.legs[0].steps.length,
        detailed_steps: primaryRoute.legs[0].steps.map((step: any, index: number) => ({
          step_number: index + 1,
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: {
            text: step.distance.text,
            value: step.distance.value
          },
          duration: {
            text: step.duration.text,
            value: step.duration.value
          },
          maneuver: step.maneuver || 'straight',
          start_location: step.start_location,
          end_location: step.end_location
        })),
        start_address: primaryRoute.legs[0].start_address,
        end_address: primaryRoute.legs[0].end_address
      },

      // Alternative Routes (if requested)
      alternatives: includeAlternatives ? alternativeRoutes.map((route, index) => {
        const altDistanceKm = route.distance.value / 1000;
        const altFuelConsumption = staticDataService.calculateFuelConsumption(
          altDistanceKm,
          vehicleType,
          fuelType
        );
        
        // Determine route characteristics for better descriptions
        const routeSummary = route.summary || '';
        const hasHighways = routeSummary.toLowerCase().includes('highway') || routeSummary.toLowerCase().includes('nh-') || route.legs[0].duration.value < (route.legs[0].distance.value / 1000) * 60;
        const hasTolls = routeSummary.toLowerCase().includes('toll') || hasHighways;
        
        let routeDescription = '';
        let routeType = '';
        
        if (hasHighways && hasTolls) {
          routeDescription = 'Fast Highway Route (with tolls)';
          routeType = 'highway_toll';
        } else if (hasHighways && !hasTolls) {
          routeDescription = 'Highway Route (toll-free)';
          routeType = 'highway_free';
        } else {
          routeDescription = 'Local Roads Route (scenic)';
          routeType = 'local_roads';
        }
        
        // Add optimization focus based on which weight is highest
        const maxWeight = Math.max(optimizationWeights.timeWeight, optimizationWeights.costWeight, optimizationWeights.emissionsWeight);
        if (optimizationWeights.timeWeight === maxWeight) {
          routeDescription += ' - Time Optimized';
        } else if (optimizationWeights.costWeight === maxWeight) {
          routeDescription += ' - Cost Optimized';
        } else {
          routeDescription += ' - Eco Optimized';
        }
        
        return {
          route_id: index + 1,
          summary: routeDescription,
          route_type: routeType,
          distance: {
            value: route.distance.value,
            text: route.distance.text,
            km: Math.round(altDistanceKm * 10) / 10
          },
          duration: {
            normal: route.duration,
            with_traffic: route.duration_in_traffic
          },
          fuel_cost: altFuelConsumption.fuelCost,
          co2_emissions: altFuelConsumption.co2Emissions,
          polyline: route.polyline,
          // Add route path details for alternative routes
          route_path: {
            polyline: route.polyline,
            steps: route.legs[0].steps.length,
            detailed_steps: route.legs[0].steps.map((step: any, stepIndex: number) => ({
              step_number: stepIndex + 1,
              instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
              distance: {
                text: step.distance.text,
                value: step.distance.value
              },
              duration: {
                text: step.duration.text,
                value: step.duration.value
              },
              maneuver: step.maneuver || 'straight',
              start_location: step.start_location,
              end_location: step.end_location
            })),
            start_address: route.legs[0].start_address,
            end_address: route.legs[0].end_address
          },
          // Store route coordinates for weather calculation
          coordinates: {
            start: route.legs[0].start_location,
            end: route.legs[0].end_location
          }
        };
      }) : [],

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

export const getAlternativeRouteWeather = async (req: Request, res: Response) => {
  try {
    const { routeIndex, startLat, startLng, endLat, endLng, duration, routeSteps } = req.body;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        error: 'Route coordinates are required'
      });
    }

    console.log(`Getting weather for alternative route ${routeIndex}`);

    // Calculate route duration in minutes 
    const routeDurationMinutes = duration ? Math.ceil(duration / 60) : 120; // Default 2 hours if not provided
    const departureTime = new Date(); // Current time as departure time
    
    const weatherData = await openWeatherService.getWeatherAlongRoute(
      startLat,
      startLng,
      endLat,
      endLng,
      routeDurationMinutes,
      departureTime,
      routeSteps
    );

    const formattedWeatherData = {
      waypoints: weatherData.waypoints.map((waypoint: any, index: number) => ({
        sequence: waypoint.sequence || (index + 1),
        location: waypoint.location,
        current: waypoint.current,
        driving_conditions: waypoint.driving_conditions,
        estimated_arrival_time: waypoint.estimated_arrival_time,
        distance_from_start: waypoint.distance_from_start,
        // Legacy fields for backward compatibility
        temperature: waypoint.current.temperature,
        feels_like: waypoint.current.feels_like,
        condition: waypoint.current.weather_condition,
        description: waypoint.current.weather_description,
        visibility: waypoint.current.visibility,
        humidity: waypoint.current.humidity,
        wind_speed: waypoint.current.wind_speed,
        wind_direction: waypoint.current.wind_direction,
        precipitation: waypoint.current.precipitation,
        cloud_cover: waypoint.current.cloud_cover,
        driving_safety_score: waypoint.driving_conditions.safety_score,
        is_safe: waypoint.driving_conditions.is_safe_for_driving,
        risk_factors: waypoint.driving_conditions.risk_factors,
        recommendations: waypoint.driving_conditions.recommendations
      })),
      overall_safety_score: weatherData.overall_safety_score,
      route_recommendations: weatherData.route_recommendations,
      total_waypoints: weatherData.total_waypoints || weatherData.waypoints.length
    };

    res.json(formattedWeatherData);

  } catch (error) {
    console.error('Alternative route weather error:', error);
    res.status(500).json({
      error: 'Failed to get weather for alternative route',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}; 