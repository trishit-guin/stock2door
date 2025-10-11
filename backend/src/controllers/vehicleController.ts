import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle';

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedCluster');
    res.json({
      success: true,
      data: vehicles,
      count: vehicles.length
    });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch vehicles',
      message: 'Internal server error'
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedCluster');
    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found' 
      });
    }
    res.json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch vehicle',
      message: 'Internal server error'
    });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      data: vehicle,
      message: 'Vehicle created successfully'
    });
  } catch (err) {
    console.error('Error creating vehicle:', err);
    res.status(400).json({ 
      success: false, 
      error: 'Failed to create vehicle', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('assignedCluster');
    
    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found' 
      });
    }
    
    res.json({
      success: true,
      data: vehicle,
      message: 'Vehicle updated successfully'
    });
  } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(400).json({ 
      success: false, 
      error: 'Failed to update vehicle', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Vehicle deleted successfully',
      data: vehicle
    });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(400).json({ 
      success: false, 
      error: 'Failed to delete vehicle', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}; 