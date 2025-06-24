import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSwipeActionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  // Get destinations by region
  app.get("/api/destinations/region/:region", async (req, res) => {
    try {
      const { region } = req.params;
      const destinations = await storage.getDestinationsByRegion(region);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations by region" });
    }
  });

  // Get destinations by category
  app.get("/api/destinations/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const destinations = await storage.getDestinationsByCategory(category);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations by category" });
    }
  });

  // Get random destination
  app.get("/api/destinations/random", async (req, res) => {
    try {
      const region = req.query.region as string;
      const destination = await storage.getRandomDestination(region);
      if (!destination) {
        return res.status(404).json({ message: "No destinations found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to get random destination" });
    }
  });

  // Get destination by ID
  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const destination = await storage.getDestinationById(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  // Create swipe action
  app.post("/api/swipe", async (req, res) => {
    try {
      const validatedData = insertSwipeActionSchema.parse(req.body);
      const swipeAction = await storage.createSwipeAction(validatedData);
      res.json(swipeAction);
    } catch (error) {
      res.status(400).json({ message: "Invalid swipe action data" });
    }
  });

  // Get liked destinations for session
  app.get("/api/liked/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const likedDestinations = await storage.getLikedDestinations(sessionId);
      res.json(likedDestinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch liked destinations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
