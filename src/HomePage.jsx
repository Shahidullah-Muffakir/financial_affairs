import React from 'react';
import './Tables.css'
import './HomePage.css'

// Breadcrumbs Component
const Breadcrumbs = () => (
  <div className="breadcrumbs">
    <a href="../../../index.html" title=" ">Home</a>
   &nbsp;
    <a href="../../index.html">Services</a>
    <a href="../index.html">Purchasing</a>
    <a href="index.html">Faculty and Staff Resources</a>
    <a href="group-contracts-search.html">Group Contracts Search</a>
  </div>
);

// SocialNav Component
const SocialNav = () => (
  <div className="d-flex align-items-end flex-column">
    <nav className="pull-right utsa-social-circle-top" id="departmentalSocialNav"></nav>
  </div>
);

// NavigationItem Component
const NavigationItem = ({ item }) => (
  <li className="nav-item">
    <a data-icon="" href={item.link} target={item.target || '_self'}>
      {item.title}
    </a>
    {item.children && (
      <ul data-test="childStringClause">
        {item.children.map((child, index) => (
          <li key={index}>
            <a data-icon="" href={child.link} target={child.target || '_self'}>
              {child.title}
            </a>
          </li>
        ))}
      </ul>
    )}
  </li>
);

// Main Navigation Data
const navItems = [
  {
    title: "Home",
    link: "../../../index.html"
  },
  {
    title: "About",
    link: "../../../about/index.html",
    children: [
      { title: "About Financial Affairs", link: "../../../about/index.html" },
      { title: "Organizational Charts", link: "../../../about/organizational-charts.html" },
      { title: "Leadership Team", link: "../../../about/leadership-team.html" },
      { title: "Office of Financial Affairs", link: "../../../about/office-of-financial-affairs.html" },
      { title: "Customer Service Standards", link: "../../../about/customer-service-standards.html" },
      { title: "Fiscal Year-End", link: "../../../about/fiscal-year-end.html" },
      { title: "Annual Business Service Centers Training", link: "../../../about/annual-bsc-training.html" },
      { title: "Decision-Making Framework", link: "../../../about/decision-making-framework.html" }
    ]
  },
  {
    title: "Services",
    link: "../../index.html",
    children: [
      { title: "Accounting Services", link: "../../accounting/index.html" },
      { title: "Budget and Financial Planning", link: "https://www.utsa.edu/budget/", target: "_blank" },
      { title: "Business Contracts Office", link: "https://www.utsa.edu/bco/", target: "_blank" },
      { title: "Credit Card Administration", link: "../../credit-card-administration/index.html" },
      { title: "Distribution Services", link: "../../distribution-services/index.html" },
      { title: "Disbursements & Travel Services", link: "../../disbursements-travel/index.html" },
      { title: "Financial Services", link: "../../financial-services/index.html" },
      { title: "Fiscal Services", link: "../../fiscal-services/index.html" },
      { title: "Grants & Contracts Financial Services", link: "../../grants-contracts/index.html" },
      { title: "Inventory", link: "../../inventory/index.html" },
      { title: "Payroll Management Services", link: "../../payroll/index.html" },
      { title: "Purchasing", link: "../index.html" },
      { title: "Surplus", link: "../../surplus/index.html" }
    ]
  },
  {
    title: "Projects",
    link: "../../../projects/index.html"
  },
  {
    title: "Training",
    link: "../../../training/index.html",
    children: [
      { title: "Accounting Services", link: "../../../training/accounting-services.html" },
      { title: "Budget", link: "../../../training/budget.html" },
      { title: "Credit Card Administration", link: "../../../training/credit-card-administration.html" },
      { title: "Disbursements & Travel", link: "../../../training/disbursements-travel.html" },
      { title: "Financial Services", link: "../../../training/financial-services.html" },
      { title: "Inventory", link: "../../../training/inventory.html" },
      { title: "Payroll", link: "../../../training/payroll.html" },
      { title: "Purchasing", link: "../../../training/purchasing.html" },
      { title: "Queries", link: "../../../training/queries.html" },
      { title: "Which Training Is for Me?", link: "../../../training/which-training-for-me.html" }
    ]
  },
  {
    title: "Resources",
    link: "../../../resources/index.html",
    children: [
      { title: "Forms", link: "../../../resources/forms/index.html" },
      { title: "Financial Guidelines", link: "../../../resources/financial-guidelines/index.html" },
      { title: "Financial Area Representatives", link: "../../../resources/far/index.html" },
      { title: "Financial Reports & Presentations", link: "../../../resources/financial-reports/index.html" }
    ]
  }
];

// Main Navigation Component
const MainNavigation = () => (
  <ul className="pl-1 pl-md-2 pl-lg-4 navbar-nav d-block ut" id="departmentalPageNav">
    {navItems.map((item, index) => (
      <NavigationItem key={index} item={item} />
    ))}
  </ul>
);

// GroupContractsTable Component
const GroupContractsTable = () => (
  <div className="container pt-2">
    <p>A Group Purchasing Organization (GPO) procures contracts on behalf of the members it serves. The <a className='herosection-link' href="https://nam11.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.utsystem.edu%2Foffices%2Fbusiness-affairs%2Fgroup-purchasing-organization-gpo-accreditation-program&amp;data=05%7C01%7Cjavier.martinez3%40utsa.edu%7C03bae5826bd9456d150408dabea0b2e8%7C3a228dfbc64744cb88357b20617fc906%7C0%7C0%7C638031894663217562%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=22E3EEmjCjaDXiiWSiL9EY8xDYQNOflBmUwuWQ0CnYs%3D&amp;reserved=0">UT System GPO Accreditation Program</a> only recognizes/approves GPOs that satisfy UT System procurement standards. Therefore, you may use any UT System GPO contract without the need to do a formal solicitation.</p>
    <p>Available UT System GPO contracts can be found by entering a keyword in the "Basic Search" field. The search will look through the <strong>vendor, contract number, </strong>and <strong>contract description</strong> fields, and return contracts that match the keyword. You can also refine your search using the advanced filter. Clicking the green button expands the contract to display additional contract details.</p>
    <p>Use the vendor email address to obtain quotes. Use the GPO email address is provided below if you want to include the GPO in your communications with the vendor or need GPO contract guidance.</p>
    <p>If you have any questions about this tool, or if you would like additional information on any of the contracts listed below please email <a className='herosection-link' href="mailto:Purchasing@utsa.edu">Purchasing</a>.</p>
    <p>&nbsp;</p>
    <form className="form-inline">
      <div className="form-group">
        <label htmlFor="basic-search">Basic Search</label>
        <input className="form-control mx-sm-3" id="basic-search" type="basic-search" />
      </div>
    </form>
    <div id="gpo-contracts-table_wrapper" className="dataTables_wrapper no-footer">
      <div className="dtsb-searchBuilder">
        <div className="dtsb-titleRow">
          <div className="dtsb-title">Custom Search Builder</div>
        </div>
        <div className="dtsb-group">
          <button className="dtsb-add dtsb-button" type="button">Add Condition</button>
        </div>
      </div>
      <table className="table table-striped table-bordered dataTable no-footer" id="gpo-contracts-table" width="100%" aria-describedby="gpo-contracts-table_info" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th className="dt-control sorting_disabled sorting_asc" rowSpan="1" colSpan="1" aria-label="" style={{ width: '4px' }}></th>
            <th className="sorting" tabIndex="0" aria-controls="gpo-contracts-table" rowSpan="1" colSpan="1" aria-label="GPO: activate to sort column ascending" style={{ width: '85px' }}>GPO</th>
            <th className="sorting" tabIndex="0" aria-controls="gpo-contracts-table" rowSpan="1" colSpan="1" aria-label="Vendor Name: activate to sort column ascending" style={{ width: '135px' }}>Vendor Name</th>
            <th className="sorting" tabIndex="0" aria-controls="gpo-contracts-table" rowSpan="1" colSpan="1" aria-label="Description: activate to sort column ascending" style={{ width: '255px' }}>Description</th>
            <th className="sorting" tabIndex="0" aria-controls="gpo-contracts-table" rowSpan="1" colSpan="1" aria-label="Vendor HUB Type: activate to sort column ascending" style={{ width: '55px' }}>Vendor HUB Type</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows would be dynamically generated in a real app */}
          <tr className="odd">
            <td className="dt-control sorting_1"></td>
            <td>UTSSCA</td>
            <td>3M Health Information Systems</td>
            <td>Computer Assisted Coding and Clinical Documentation </td>
            <td>No</td>
          </tr>
          {/* More rows would go here */}
        </tbody>
      </table>
      <div className="dataTables_info" id="gpo-contracts-table_info" role="status" aria-live="polite">Showing 1 to 10 of 10,200 entries</div>
      <div className="dataTables_paginate paging_simple_numbers" id="gpo-contracts-table_paginate">
        <a className="paginate_button previous disabled" aria-controls="gpo-contracts-table" data-dt-idx="0" tabIndex="-1" id="gpo-contracts-table_previous">Previous</a>
        <span>
          <a className="paginate_button current" aria-controls="gpo-contracts-table" data-dt-idx="1" tabIndex="0">1</a>
          <a className="paginate_button" aria-controls="gpo-contracts-table" data-dt-idx="2" tabIndex="0">2</a>
          <a className="paginate_button" aria-controls="gpo-contracts-table" data-dt-idx="3" tabIndex="0">3</a>
          <a className="paginate_button" aria-controls="gpo-contracts-table" data-dt-idx="4" tabIndex="0">4</a>
          <a className="paginate_button" aria-controls="gpo-contracts-table" data-dt-idx="5" tabIndex="0">5</a>
          <span className="ellipsis">…</span>
          <a className="paginate_button" aria-controls="gpo-contracts-table" data-dt-idx="6" tabIndex="0">1,020</a>
        </span>
        <a className="paginate_button next" aria-controls="gpo-contracts-table" data-dt-idx="7" tabIndex="0" id="gpo-contracts-table_next">Next</a>
      </div>
    </div>
  </div>
);

// Main Page Component
const GroupContractsSearch = () => {
  return (
    <section className="page-content" id="main-content">
      <section className="container pt-4" id="site-top" data-gtm-vis-first-on-screen12328767_185="1216250" data-gtm-vis-total-visible-time12328767_185="100" data-gtm-vis-has-fired12328767_185="1">
        <div className="containerWrapper">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-sm-7">
                  <Breadcrumbs />
                </div>
                <div className="col-sm-5">
                  <SocialNav />
                </div>
              </div>
              <div className="site-top-Title">
                <a href="/financialaffairs/">Financial Affairs</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="site-navigation" data-gtm-vis-first-on-screen12328767_185="1216260" data-gtm-vis-total-visible-time12328767_185="100" data-gtm-vis-has-fired12328767_185="1">
        <div className="containerWrapper">
          <div className="row navbar-expand">
            <div className="col-12 navbar-nav-scroll">
              <MainNavigation />
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="site-banner" data-gtm-vis-first-on-screen12328767_185="1216222" data-gtm-vis-total-visible-time12328767_185="100" data-gtm-vis-has-fired12328767_185="1">
        <div className="containerWrapper">
          <div className="row">
            <div className="col-12 departmentalPageBanner">
              <img alt="" data-path="" src="" width="100%" />
            </div>
          </div>
        </div>
      </section>

      <section className="container" id="site-content">
        <div className="containerWrapper">
          <div className="row">
            <a name="page-content"></a>
            <div className="col-md-12">
              <section className="fade-in one" data-gtm-vis-first-on-screen12328767_185="1216228" data-gtm-vis-total-visible-time12328767_185="100" data-gtm-vis-has-fired12328767_185="1">
                <h1 className="intro-title" data-count="1" id="toptext">Group Contracts Search</h1>
              </section>
              <div className="row">
                <div className="col-sm-12">
                  <link href="/financialaffairs/css/vendor/datatables.min.css" rel="stylesheet" type="text/css" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <GroupContractsTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default GroupContractsSearch;