import { Inter } from "next/font/google";
import "./styles/globals.scss";
import forestImage from "../public/forest.png";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hycalc",
  description: "Hypixel Skyblock stat calculator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Image
          alt='Forest'
          src={forestImage}
          style={{ width: "100vw", height: "100vh", position: "fixed", objectFit: "cover", zIndex: "-10" }}
          placeholder='blur'
        />
        {children}
      </body>
    </html>
  );
}
