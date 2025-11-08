import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFieldSchema, insertLivestockSchema, type User } from "@shared/schema";
import { z } from "zod";

// TODO: Replace with proper authentication from Replit Auth
let tempUserId: string | null = null;

async function getTempUserId(): Promise<string> {
  if (tempUserId) {
    return tempUserId;
  }
  
  // Try to find existing demo user
  let user = await storage.getUserByUsername("demo-user");
  if (!user) {
    // Create demo user
    user = await storage.createUser({
      username: "demo-user",
      password: "not-used",
    });
  }
  tempUserId = user.id;
  return tempUserId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Fields routes
  app.get("/api/fields", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const fields = await storage.getFieldsByUserId(userId);
      res.json(fields);
    } catch (error) {
      console.error("Error fetching fields:", error);
      res.status(500).json({ error: "Failed to fetch fields" });
    }
  });

  app.post("/api/fields", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const validatedData = insertFieldSchema.parse({
        ...req.body,
        userId,
      });
      const field = await storage.createField(validatedData);
      res.status(201).json(field);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating field:", error);
      res.status(500).json({ error: "Failed to create field" });
    }
  });

  app.patch("/api/fields/:id", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const field = await storage.getField(req.params.id);
      if (!field || field.userId !== userId) {
        return res.status(404).json({ error: "Field not found" });
      }
      const validatedData = insertFieldSchema.omit({ userId: true }).partial().parse(req.body);
      const updated = await storage.updateField(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating field:", error);
      res.status(500).json({ error: "Failed to update field" });
    }
  });

  app.delete("/api/fields/:id", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const field = await storage.getField(req.params.id);
      if (!field || field.userId !== userId) {
        return res.status(404).json({ error: "Field not found" });
      }
      await storage.deleteField(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting field:", error);
      res.status(500).json({ error: "Failed to delete field" });
    }
  });

  // Livestock routes
  app.get("/api/livestock", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const livestockData = await storage.getLivestockByUserId(userId);
      res.json(livestockData);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      res.status(500).json({ error: "Failed to fetch livestock" });
    }
  });

  app.post("/api/livestock", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const validatedData = insertLivestockSchema.parse({
        ...req.body,
        userId,
      });
      const livestockItem = await storage.createLivestock(validatedData);
      res.status(201).json(livestockItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating livestock:", error);
      res.status(500).json({ error: "Failed to create livestock" });
    }
  });

  app.patch("/api/livestock/:id", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const livestockItem = await storage.getLivestock(req.params.id);
      if (!livestockItem || livestockItem.userId !== userId) {
        return res.status(404).json({ error: "Livestock not found" });
      }
      const validatedData = insertLivestockSchema.omit({ userId: true }).partial().parse(req.body);
      const updated = await storage.updateLivestock(req.params.id, validatedData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating livestock:", error);
      res.status(500).json({ error: "Failed to update livestock" });
    }
  });

  app.delete("/api/livestock/:id", async (req, res) => {
    try {
      const userId = await getTempUserId();
      const livestockItem = await storage.getLivestock(req.params.id);
      if (!livestockItem || livestockItem.userId !== userId) {
        return res.status(404).json({ error: "Livestock not found" });
      }
      await storage.deleteLivestock(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting livestock:", error);
      res.status(500).json({ error: "Failed to delete livestock" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
