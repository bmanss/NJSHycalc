import { Suspense } from "react";
import LoadingTemp from "./LoadingTemp";
export default function Layout({ children }) {
  return (
    <>
      <Suspense fallback={<LoadingTemp />}>
        <main>{children}</main>
      </Suspense>
    </>
  );
}
