import { Suspense } from "react";
export default function Layout({ children }) {
  return (
    <>
      <Suspense fallback={<p style={{backgroundColor:'red',width:'200px'}}> I am loadin</p>}>
        <main>{children}</main>
      </Suspense>
    </>
  );
}
