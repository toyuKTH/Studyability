import { ReactElement, RefObject, useEffect, useRef } from "react";
import PageNav from "./PageNav";
import "./PageLayout.css";
import InfoSVG from "./svg/InfoSVG";
import Modal from "./Modal";
import { useLocation } from "react-router";

function PageLayout({ children }: Readonly<{ children: ReactElement }>) {
  const location = useLocation().pathname;
  const modalRef = useRef<HTMLDialogElement>(null);

  function toggleModal() {
    if (modalRef && modalRef.current) {
      if (modalRef.current.open) {
        modalRef.current.close();
      }
      modalRef.current.showModal();
    }
  }

  useEffect(() => {
    return () => {
      if (modalRef && modalRef.current) {
        modalRef.current.close();
      }
    };
  }, [location]);

  return (
    <div className="App">
      <div className="page-header">
        <div className="logo-group">
          <img
            className="logo-icon"
            src="/logo-dark.svg"
            alt="studyability logo"
          />
          <h1 className="logo-name">Studyability</h1>
        </div>
        <PageNav />

        <button
          onClick={toggleModal}
          disabled={location === "/about"}
          style={{ cursor: location === "/about" ? "default" : "pointer" }}
        >
          <InfoSVG
            width={30}
            height={30}
            fill={location === "/about" ? "transparent" : "white"}
          />
        </button>
      </div>
      <div style={{ height: "95%", overflowY: "auto" }}>{children}</div>
      <Modal modalRef={modalRef} location={location} />
    </div>
  );
}

export default PageLayout;
