import { RefObject, useEffect } from "react";

import "./Modal.css";
import CancelSVG from "./svg/CancelSVG";
import ExplorPageDataInfo from "./ExplorePageDataInfo";
import ComparePageDataInfo from "./ComparePageDataInfo";
import { NavLink } from "react-router";

export default function Modal({
  modalRef,
  location,
}: {
  modalRef: RefObject<HTMLDialogElement> | null;
  location: string;
}) {
  const pathToTitle: Record<string, string> = {
    "/": "Explore",
    "/compare": "Compare",
  };

  useEffect(() => {
    if (!modalRef?.current) return;

    modalRef.current.addEventListener("click", handleBackdropClick);

    function handleBackdropClick(event: MouseEvent) {
      if (!modalRef?.current) return;

      var rect = modalRef.current.getBoundingClientRect();
      var isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        modalRef.current.close();
      }
    }

    return () => {
      modalRef.current?.removeEventListener("click", handleBackdropClick);
    };
  }, [modalRef]);

  return (
    <dialog className="modal-container" ref={modalRef}>
      <div className="modal-header">
        <h2>{pathToTitle[location]} page data information</h2>
        <button
          className="modal-close"
          onClick={() => modalRef?.current?.close()}
          autoFocus
        >
          <CancelSVG width={30} height={30} />
        </button>
      </div>
      <p style={{ borderBottom: "1px solid #ccc" }}>
        Please read the “Data” section in{" "}
        <NavLink to={"/about#data"}>About page</NavLink> to learn more about the
        data sources.
      </p>
      <div className="modal-content">
        {location === "/" && <ExplorPageDataInfo />}
        {location === "/compare" && <ComparePageDataInfo />}
      </div>
    </dialog>
  );
}
