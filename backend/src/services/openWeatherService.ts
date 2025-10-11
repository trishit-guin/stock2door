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
    endLon: number
  ): Promise<{ start: WeatherData; end: WeatherData; midpoint?: WeatherData }> {
    try {
      // Calculate midpoint for long routes
      const midLat = (startLat + endLat) / 2;
      const midLon = (startLon + endLon) / 2;
      
      // Get distance to determine if we need midpoint weather
      const distance = this.calculateDistance(startLat, startLon, endLat, endLon);
      
      const promises = [
        this.getCurrentWeather(startLat, startLon),
        this.getCurrentWeather(endLat, endLon)
      ];

      // For routes > 500km, also get midpoint weather
      if (distance > 500) {
        promises.push(this.getCurrentWeather(midLat, midLon));
      }

      const results = await Promise.all(promises);
      
      return {
        start: results[0],
        end: results[1],
        midpoint: results[2] || undefined
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