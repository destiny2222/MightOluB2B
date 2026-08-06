import Contact from "@/components/Contact";
import { ToastContainer } from "react-toastify";


import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Page | B2B  B2B E-commerce",
  description: "This is Contact Page for B2B  Template",
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
