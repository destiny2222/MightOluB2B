import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Unifood Business to Business E-commerce",
  description: "Learn about Unifood, our mission, values, and leadership team. We revolutionize wholesale food procurement for commercial kitchens.",
};

const AboutPage = () => {
  return (
    <main>
      <About />
    </main>
  );
};

export default AboutPage;
