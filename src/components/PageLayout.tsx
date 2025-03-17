import { ReactElement } from "react";
import PageNav from "./PageNav";
import "./PageLayout.css";
import InfoSVG from "./svg/InfoSVG";

function PageLayout({ children }: Readonly<{ children: ReactElement }>) {
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
        <button>
          <InfoSVG width={30} height={30} />
        </button>
      </div>
      <div style={{ height: "95%", overflowY: "auto" }}>{children}</div>
    </div>
  );
}

export default PageLayout;
