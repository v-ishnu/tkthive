import { prisma } from "../../../config/prisma.js";

export const getEventLocations = async (req, res) => {
    try {
        // Fetch all events with venue information
        // Optimization: In real app, consider raw aggregation or caching
        const events = await prisma.event.findMany({
            where: {
                isPrivate: false,
                isDiscoverable: true,
                evType: "PUBLIC"
            },
            select: {
                venue: true
            }
        });

        // Extract and normalize cities
        const cities = new Set();
        events.forEach(event => {
            if (event.venue && event.venue.city) {
                cities.add(event.venue.city.trim());
            }
        });

        const sortedCities = Array.from(cities).sort();

        return res.status(200).json({
            message: "LOCATIONS_FETCHED",
            locations: sortedCities
        });
    } catch (error) {
        console.error("Fetch Locations Error:", error);
        return res.status(500).json({ message: "FETCH_LOCATIONS_FAILED" });
    }
};
