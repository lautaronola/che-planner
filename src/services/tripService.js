import { ObjectId } from "mongodb";

import {
  createTrip,
  getTripById,
  getTripByUser,
  addMemberByEmail,
  closeTrip,
} from "../data/tripData.js";

import { getUserByEmail, getUserById } from "../data/userData.js";

import {
  TRIP_INVALID_NAME,
  TRIP_CLOSED_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_ALREADY_IN_TRIP,
  TRIP_NOT_FOUND_ERROR,
} from "../constants/index.js";

import { getExpensesByTrip } from "../data/expenseData.js"

import { calculateDebts } from "./paymentService.js";

export async function createNewTrip(name, userId, destination) {
  if (!name || name.trim() === "" || name.trim().length > 20) {
    throw new Error(TRIP_INVALID_NAME);
  }

return await createTrip(name.trim(), userId, destination);
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

export async function getTripSummary(tripId) {
  const [trip, expenses, debts] = await Promise.all([
    getTripById(tripId),
    getExpensesByTrip(tripId),
    calculateDebts(tripId)
  ]);

  const totalDebt = Math.round(
      expenses.reduce((sum, e) => sum + e.totalAmount, 0) * 100
    ) / 100;

  const members = await Promise.all(
    (trip.members || []).map(async (memberId) => {
      try {
        const user = await getUserById(memberId.toString());
        return { _id: user._id.toString(), name: user.name, email: user.email };
      } catch {
        return { _id: memberId.toString(), name: null, email: null };
      }
    })
  );

  return {
    trip: { ...trip, createdBy: trip.createdBy?.toString(), members },
    totalDebt,
    expenses,
    debts,
    totalDebtPending: debts.totalDebt,
  };
}
