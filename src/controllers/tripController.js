import {
  createNewTrip,
  getTrip,
  getUserTrips,
  addMember,
  closeTripById,
  getDestinationTrips,
  getTripSummary
} from "../services/tripService.js";
import { TRIP_CLOSED_ERROR, TRIP_CLOSED_SUCCESS } from "../constants/index.js";

export async function createTripController(req, res) {
  const { name, destination } = req.body;
  const userId = req.user.id;

  try {
    const trip = await createNewTrip(name, userId, destination);
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getTripByIdController(req, res) {
  const { id } = req.params;

  try {
    const trip = await getTrip(id);
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function getUserTripsController(req, res) {
  const userId = req.user.id;

  try {
    const trips = await getUserTrips(userId);
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getDestinationTripsController(req, res) {
  const { destination } = req.params;

  try {
    const trips = await getDestinationTrips(destination);
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function closeTripController(req, res) {
  const { id } = req.params;

  try {
    await closeTripById(id);
    res.status(200).json({ message: TRIP_CLOSED_SUCCESS });
  } catch (error) {
    res.status(400).json({ message: TRIP_CLOSED_ERROR });
  }
}

export async function addMemberController(req, res) {
  const { email } = req.body;
  const { tripId } = req.params;

  try {
    const trip = await addMember(email, tripId);
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getTripSummaryController(req, res) {
  const { id } = req.params;

  try {
    const summary = await getTripSummary(id);
    res.status(200).json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}