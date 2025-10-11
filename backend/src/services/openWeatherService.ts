import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number; // Celsius
    feels_like: number;
    humidity: number; // %
    pressure: number; // hPa
    visibility: number; // meters
    uv_index: number;
    wind_speed: number; // m/s
    wind_direction: number; // degrees
    weather_condition: string;
    weather_description: string;
    weather_icon: string;
    precipitation: number; // mm
    cloud_cover: number; // %
  };
  forecast?: Array<{
    datetime: string;
    temperature: number;
    weather_condition: string;
    weather_description: string;
    precipitation_probability: number;
    precipitation_amount: number;
    wind_speed: number;
    visibility: number;
  }>;
  driving_conditions: {
    safety_score: number; // 0-100, 100 = perfect conditions
    recommendations: string[];
    risk_factors: string[];
    is_safe_for_driving: boolean;
  };
}

class OpenWeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY!;
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured. Please set OPENWEATHER_API_KEY in your .env file');
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      const data = response.data;
      
      // Calculate driving safety score based on weather conditions
      const drivingConditions = this.calculateDrivingConditions(data);

      return {
        location: {
          name: data.name,
          country: data.sys.country,
          lat: data.coord.lat,
          lon: data.coord.lon
        },
        current: {
          temperature: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          visibility: data.visibility || 10000, // Default to 10km if not provided
          uv_index: 0, // Not available in current weather API
          wind_speed: data.wind?.speed || 0,
          wind_direction: data.wind?.deg || 0,
          weather_condition: data.weather[0].main,
          weather_description: data.weather[0].description,
          weather_icon: data.weather[0].icon,
          precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
          cloud_cover: data.clouds.all
        },
        driving_conditions: drivingConditions
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherAlongRoute(
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number,
    routeDurationMinutes?: number,
    departureTime?: Date,
    routeSteps?: Array<{ start_location: { lat: number; lng: number }; end_location: { lat: number; lng: number }; duration: { value: number } }>
  ): Promise<{ waypoints: WeatherData[]; overall_safety_score: number; route_recommendations: string[]; total_waypoints: number }> {
    try {
      const waypoints: Array<{ lat: number; lon: number; estimatedArrivalTime: Date; distanceFromStart: number }> = [];
      
      // Set departure time (default to now if not provided)
      const startTime = departureTime || new Date();
      const totalDurationMinutes = routeDurationMinutes || 120; // Default 2 hours if not provided
      
      if (routeSteps && routeSteps.length > 0) {
        // Use actual route steps to generate waypoints
        let cumulativeTime = 0;
        let cumulativeDistance = 0;
        
        // Always include start point
        waypoints.push({ 
          lat: startLat, 
          lon: startLon, 
          estimatedArrivalTime: startTime, 
          distanceFromStart: 0 
        });
        
        // Add waypoints based on route steps at regular intervals (every ~100km or every 20-30 steps)
        const stepInterval = Math.max(1, Math.floor(routeSteps.length / 5)); // Divide route into ~5 segments
        
        for (let i = stepInterval; i < routeSteps.length; i += stepInterval) {
          const step = routeSteps[i];
          
          // Calculate cumulative time up to this step
          for (let j = Math.max(0, i - stepInterval); j <= i; j++) {
            cumulativeTime += routeSteps[j].duration.value; // in seconds
          }
          
          // Calculate distance from start using coordinate distance
          cumulativeDistance = this.calculateDistance(startLat, startLon, step.start_location.lat, step.start_location.lng);
          
          const estimatedArrivalTime = new Date(startTime.getTime() + cumulativeTime * 1000); // Convert seconds to milliseconds
          
          waypoints.push({ 
            lat: step.start_location.lat, 
            lon: step.start_location.lng, 
            estimatedArrivalTime, 
            distanceFromStart: cumulativeDistance 
          });
        }
        
        // Always include end point
        const totalTime = routeSteps.reduce((sum, step) => sum + step.duration.value, 0);
        const totalDistance = this.calculateDistance(startLat, startLon, endLat, endLon);
        const endTime = new Date(startTime.getTime() + totalTime * 1000);
        
        waypoints.push({ 
          lat: endLat, 
          lon: endLon, 
          estimatedArrivalTime: endTime, 
          distanceFromStart: totalDistance 
        });
      } else {
        // Fallback to straight-line waypoints if no route steps provided
        const totalDistance = this.calculateDistance(startLat, startLon, endLat, endLon);
        const intervalKm = 125; // 125km intervals
        const numIntervals = Math.ceil(totalDistance / intervalKm);
        
        // Always include start point
        waypoints.push({ 
          lat: startLat, 
          lon: startLon, 
          estimatedArrivalTime: startTime, 
          distanceFromStart: 0 
        });
        
        // Add intermediate waypoints for long routes
        if (numIntervals > 1) {
          for (let i = 1; i < numIntervals; i++) {
            const ratio = i / numIntervals;
            const lat = startLat + (endLat - startLat) * ratio;
            const lon = startLon + (endLon - startLon) * ratio;
            const distanceFromStart = totalDistance * ratio;
            
            const timeRatio = ratio;
            const estimatedArrivalMinutes = totalDurationMinutes * timeRatio;
            const estimatedArrivalTime = new Date(startTime.getTime() + estimatedArrivalMinutes * 60 * 1000);
            
            waypoints.push({ 
              lat, 
              lon, 
              estimatedArrivalTime, 
              distanceFromStart 
            });
          }
        }
        
        // Always include end point (unless it's the same as start)
        if (totalDistance > 10) {
          const endTime = new Date(startTime.getTime() + totalDurationMinutes * 60 * 1000);
          waypoints.push({ 
            lat: endLat, 
            lon: endLon, 
            estimatedArrivalTime: endTime, 
            distanceFromStart: totalDistance 
          });
        }
      }
      
      // Get forecast weather data for all waypoints based on arrival times
      const weatherPromises = waypoints.map(point => 
        this.getForecastAtTime(point.lat, point.lon, point.estimatedArrivalTime)
      );
      
      const weatherResults = await Promise.all(weatherPromises);
      
      // Add arrival time and sequence information to weather results
      const enrichedWeatherResults = weatherResults.map((weather: WeatherData, index: number) => ({
        ...weather,
        estimated_arrival_time: waypoints[index].estimatedArrivalTime.toISOString(),
        distance_from_start: Math.round(waypoints[index].distanceFromStart),
        sequence: index + 1
      }));
      
      // Calculate overall safety metrics
      const safetyScores = enrichedWeatherResults.map((w: any) => w.driving_conditions.safety_score);
      const overallSafetyScore = Math.min(...safetyScores);
      
      // Collect unique recommendations
      const allRecommendations = new Set<string>();
      enrichedWeatherResults.forEach((weather: any) => {
        weather.driving_conditions.recommendations.forEach((rec: string) => 
          allRecommendations.add(rec)
        );
      });
      
      return {
        waypoints: enrichedWeatherResults,
        overall_safety_score: overallSafetyScore,
        route_recommendations: Array.from(allRecommendations),
        total_waypoints: waypoints.length
      };
    } catch (error) {
      console.error('Route weather error:', error);
      throw new Error('Failed to fetch weather data along route');
    }
  }

  async getForecast(lat: number, lon: number, hours: number = 24): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      const current = await this.getCurrentWeather(lat, lon);
      
      // Get forecast data for the next 'hours' hours
      const forecastData = response.data.list.slice(0, Math.ceil(hours / 3)).map((item: any) => ({
        datetime: new Date(item.dt * 1000).toISOString(),
        temperature: Math.round(item.main.temp),
        weather_condition: item.weather[0].main,
        weather_description: item.weather[0].description,
        precipitation_probability: item.pop * 100,
        precipitation_amount: item.rain?.['3h'] || item.snow?.['3h'] || 0,
        wind_speed: item.wind?.speed || 0,
        visibility: item.visibility || 10000
      }));

      return {
        ...current,
        forecast: forecastData
      };
    } catch (error) {
      console.error('Weather forecast error:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Get weather forecast for a specific location at a specific time
   */
  async getForecastAtTime(lat: number, lon: number, targetTime: Date): Promise<WeatherData> {
    try {
      const now = new Date();
      const hoursFromNow = Math.max(0, (targetTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      // If the target time is more than 5 days in the future, use the last available forecast
      const maxForecastHours = 120; // 5 days * 24 hours
      const effectiveHours = Math.min(hoursFromNow, maxForecastHours);
      
      // If target time is in the past or very near future (< 1 hour), get current weather
      if (effectiveHours < 1) {
        return await this.getCurrentWeather(lat, lon);
      }
      
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      // Find the forecast entry closest to our target time
      const forecastList = response.data.list;
      let closestForecast = forecastList[0];
      let smallestTimeDiff = Math.abs(new Date(closestForecast.dt * 1000).getTime() - targetTime.getTime());
      
      for (const item of forecastList) {
        const forecastTime = new Date(item.dt * 1000);
        const timeDiff = Math.abs(forecastTime.getTime() - targetTime.getTime());
        
        if (timeDiff < smallestTimeDiff) {
          smallestTimeDiff = timeDiff;
          closestForecast = item;
        }
      }
      
      // Get location info from the response
      const locationData = response.data.city;
      
      // Transform the forecast data to match our WeatherData interface
      const weatherData: WeatherData = {
        location: {
          name: locationData.name,
          country: locationData.country,
          lat: locationData.coord.lat,
          lon: locationData.coord.lon
        },
        current: {
          temperature: Math.round(closestForecast.main.temp),
          feels_like: Math.round(closestForecast.main.feels_like),
          humidity: closestForecast.main.humidity,
          pressure: closestForecast.main.pressure,
          visibility: closestForecast.visibility || 10000,
          uv_index: 0, // Not available in forecast API
          wind_speed: closestForecast.wind?.speed || 0,
          wind_direction: closestForecast.wind?.deg || 0,
          weather_condition: closestForecast.weather[0].main,
          weather_description: closestForecast.weather[0].description,
          weather_icon: closestForecast.weather[0].icon,
          precipitation: (closestForecast.rain?.['3h'] || 0) + (closestForecast.snow?.['3h'] || 0),
          cloud_cover: closestForecast.clouds.all
        },
        driving_conditions: this.calculateDrivingConditions(closestForecast)
      };
      
      return weatherData;
    } catch (error) {
      console.error('Forecast at time error:', error);
      // Fallback to current weather if forecast fails
      return await this.getCurrentWeather(lat, lon);
    }
  }

  private calculateDrivingConditions(weatherData: any): WeatherData['driving_conditions'] {
    let safetyScore = 100;
    const recommendations: string[] = [];
    const riskFactors: string[] = [];

    const condition = weatherData.weather[0].main.toLowerCase();
    const visibility = weatherData.visibility || 10000;
    const windSpeed = weatherData.wind?.speed || 0;
    const precipitation = weatherData.rain?.['1h'] || weatherData.snow?.['1h'] || 0;

    // Weather condition penalties
    switch (condition) {
      case 'thunderstorm':
        safetyScore -= 40;
        riskFactors.push('Thunderstorm conditions');
        recommendations.push('Avoid driving if possible, find shelter');
        break;
      case 'rain':
        safetyScore -= precipitation > 5 ? 30 : 15;
        riskFactors.push('Wet roads, reduced traction');
        recommendations.push('Drive slowly, increase following distance');
        break;
      case 'snow':
        safetyScore -= 35;
        riskFactors.push('Snow conditions, very poor traction');
        recommendations.push('Use winter equipment, drive very slowly');
        break;
      case 'fog':
      case 'mist':
        safetyScore -= 25;
        riskFactors.push('Reduced visibility due to fog');
        recommendations.push('Use fog lights, reduce speed significantly');
        break;
      case 'haze':
      case 'smoke':
        safetyScore -= 15;
        riskFactors.push('Poor air quality, reduced visibility');
        recommendations.push('Use headlights, consider alternate routes');
        break;
    }

    // Visibility penalties
    if (visibility < 1000) {
      safetyScore -= 30;
      riskFactors.push('Very poor visibility (<1km)');
      recommendations.push('Extreme caution required, consider postponing trip');
    } else if (visibility < 5000) {
      safetyScore -= 15;
      riskFactors.push('Reduced visibility (<5km)');
      recommendations.push('Use headlights, reduce speed');
    }

    // Wind speed penalties
    if (windSpeed > 15) { // > 54 km/h
      safetyScore -= 20;
      riskFactors.push('Strong winds affecting vehicle stability');
      recommendations.push('Maintain firm grip on steering, beware of crosswinds');
    } else if (windSpeed > 10) { // > 36 km/h
      safetyScore -= 10;
      riskFactors.push('Moderate winds');
      recommendations.push('Extra caution with high-profile vehicles');
    }

    // Temperature considerations
    const temp = weatherData.main.temp;
    if (temp > 45) {
      safetyScore -= 10;
      riskFactors.push('Extreme heat affecting vehicle performance');
      recommendations.push('Check tire pressure, ensure adequate coolant');
    } else if (temp < 5) {
      safetyScore -= 10;
      riskFactors.push('Cold weather affecting vehicle performance');
      recommendations.push('Allow engine warm-up time, check battery');
    }

    // Ensure score doesn't go below 0
    safetyScore = Math.max(0, safetyScore);

    // Add general recommendations based on score
    if (safetyScore < 50) {
      recommendations.push('Consider postponing non-essential travel');
    } else if (safetyScore < 70) {
      recommendations.push('Exercise extreme caution while driving');
    } else if (safetyScore < 85) {
      recommendations.push('Drive with increased caution');
    }

    return {
      safety_score: safetyScore,
      recommendations,
      risk_factors: riskFactors,
      is_safe_for_driving: safetyScore >= 60
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const openWeatherService = new OpenWeatherService();