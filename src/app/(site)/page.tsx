import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B  | B2B E-commerce",
  description: "This is Home for B2B  Template",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
