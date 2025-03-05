import { ReactElement } from "react";
import PageNav from "./PageNav";
import "./PageLayout.css";

function PageLayout({ children }: Readonly<{ children: ReactElement }>) {
  return (
    <div className='App'>
      <div className='page-header'>
        <div className='logo-group'>
          <img
            className='logo-icon'
            src='/logo-white.svg'
            alt='studyability logo'
          />
          <div className='logo-name'>StudyAbility</div>
        </div>
        <PageNav />
      </div>
      <div className='page-content'>{children}</div>
    </div>
  );
}

export default PageLayout;
