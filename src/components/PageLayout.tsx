import { ReactElement } from "react";
import PageNav from "./PageNav";
import "./PageLayout.css";

function PageLayout({ children }: Readonly<{ children: ReactElement }>) {
  return (
    <div className="App">
      <div className="page-header">
        <div className="logo-group">
          <img
            className="logo-icon"
            src="/logo-test.png"
            alt="studyability logo"
          />
          <div className="logo-name">Studyability</div>
        </div>
        <PageNav />
      </div>
      <div style={{ height: "90%" }}>{children}</div>
    </div>
  );
}

export default PageLayout;
