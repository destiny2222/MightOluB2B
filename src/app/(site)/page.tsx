import Home from "@/components/Home";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "B2B  | B2B E-commerce",
  description: "This is Home for B2B  Template",
  // other metadata
};

export default function HomePage() {
  return (
    <>
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
      <Home />
    </>
  );
}
