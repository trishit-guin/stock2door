import { Request, Response } from 'express';
import Delivery from '../models/Delivery';

export const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create delivery', details: err });
  }
};

export const updateDelivery = async (req: Request, res: Response) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update delivery', details: err });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete delivery', details: err });
  }
}; 