import Contact from "@/components/Contact";
import { ToastContainer } from "react-toastify";


import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Page | Business to Business E-commerce",
  description: "Contact the Unifood support desk. Reach out for corporate account setup help, direct farm contract supply, custom logistics routing, or bulk quote requests.",
  // other metadata
};

const ContactPage = () => {
  return (
    <main>
      <ToastContainer 
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="colored"
      />
      <Contact />
    </main>
  );
};

export default ContactPage;
