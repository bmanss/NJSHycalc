"use server";
import { redirect } from "next/navigation";

export async function redirectDefault() {
  redirect(`/profile/`);
}
export async function redirectPlayer(playerName) {
  redirect(`/profile/${playerName}`);
}
