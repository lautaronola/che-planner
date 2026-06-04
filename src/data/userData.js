import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function registerUser({name, email, password}){
    const db = getDb();
    const existingUser = await db.collection("users").findOne({email});
    if(existingUser) {
        throw new Error("El email ya esta registrado");        
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
        name,
        email, 
        password: hashedPassword
    };

    const result = await db.collection("users").insertOne(newUser);
    return result;
}

export async function findByCredentials(email, password){
    const db = getDb();
    const user = await db.collection("users").findOne({email});
    if(!user){
        return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return null;
    }
    return user;
}
