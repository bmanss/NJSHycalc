import { Suspense } from "react";
import { ProfileProvider } from "@/app/context/ProfileContext";
export default function Layout({ children }) {
  return (
    <>
      <ProfileProvider>{children}</ProfileProvider>
    </>
  );
}
