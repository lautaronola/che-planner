import { ObjectId } from "mongodb";

import {
  createTrip,
  getTripById,
  getTripByUser,
  addMemberByEmail,
  closeTrip,
} from "../data/tripData.js";

import { getUserByEmail } from "../data/userData.js";

import {
  TRIP_INVALID_NAME,
  TRIP_CLOSED_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_ALREADY_IN_TRIP,
  TRIP_NOT_FOUND_ERROR,
} from "../constants/index.js";

export async function createNewTrip(name, userId) {
  if (!name || name.trim() === "" || name.trim().length > 20) {
    throw new Error(TRIP_INVALID_NAME);
  }

  return await createTrip(name.trim(), userId);
}

export async function getTrip(id) {
  return await getTripById(id);
}

export async function getUserTrips(userId) {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error(USER_NOT_FOUND_ERROR);
  }

  return await getTripByUser(userId);
}

export async function getDestinationTrips(destination) {
  if (!destination || destination.trim() === "") {
    throw new Error(TRIP_NOT_FOUND_ERROR);
  }

  return await getTripByDestination(destination);
}

export async function addMember(email, tripId) {
  const trip = await getTripById(tripId);

  if (!trip) {
    throw new Error(TRIP_NOT_FOUND_ERROR);
  }

  if (!trip.status) {
    throw new Error(TRIP_CLOSED_ERROR);
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error(USER_NOT_FOUND_ERROR);
  }

  const userId = user._id.toString();

  const isAlreadyMember = trip.members.some(
    (memberId) => memberId.toString() === userId,
  );

  if (isAlreadyMember || trip.createdBy.toString() === userId) {
    throw new Error(USER_ALREADY_IN_TRIP);
  }

  return await addMemberByEmail(email, tripId);
}

export async function closeTripById(tripId) {
  const trip = await getTripById(tripId);

  if (!trip.status) {
    throw new Error(TRIP_CLOSED_ERROR);
  }

  return await closeTrip(tripId);
}
