import { Request, Response } from 'express';
import { AttributeService } from '../services/attribute.service';

const attributeService = new AttributeService();

// Create new attribute
export const createAttribute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        // Check if attribute already exists
        const existingAttribute = await attributeService.getById(name);
        if (existingAttribute) {
            res.status(400).json({ success: false, message: "Attribute with this name already exists" });
            return;
        }

        const attribute = await attributeService.create(req.body);
        res.status(201).json({ success: true, message: "Attribute Created Successfully", data: attribute });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get all attributes
export const getAllAttributes = async (req: Request, res: Response): Promise<void> => {
    try {
        const attributes = await attributeService.getAll();
        res.status(200).json({ success: true, message: "Attributes Retrieved Successfully", data: attributes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get attribute by ID
export const getAttributeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const attribute = await attributeService.getById(Number(req.params.id));
        if (!attribute) {
            res.status(404).json({ success: false, message: "Attribute Not Found" });
        } else {
            res.status(200).json({ success: true, message: "Attribute Retrieved Successfully", data: attribute });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Update attribute
export const updateAttribute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const id = Number(req.params.id);

        const attribute = await attributeService.getById(id);
        if (!attribute) {
            res.status(404).json({ success: false, message: "Attribute Not Found" });
            return;
        }

        // Check if another attribute with the same name already exists
        if (name && name !== attribute.name) {
            const existingAttribute = await attributeService.getById(name);
            if (existingAttribute) {
                res.status(400).json({ success: false, message: "Attribute with this name already exists" });
                return;
            }
        }

        const updatedAttribute = await attributeService.update(id, req.body);
        res.status(200).json({ success: true, message: "Attribute Updated Successfully", data: updatedAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Delete attribute
export const deleteAttribute = async (req: Request, res: Response): Promise<void> => {
    try {
        const success = await attributeService.delete(Number(req.params.id));
        if (!success) {
            res.status(404).json({ success: false, message: "Attribute Not Found" });
        } else {
            res.status(200).json({ success: true, message: "Attribute Deleted Successfully" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
