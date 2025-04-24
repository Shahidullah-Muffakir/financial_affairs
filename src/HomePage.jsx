import React, { useState } from "react";
import "./Tables.css";
import "./HomePage.css";
import data from "./financial_data.json";
console.log("data123", data);

// Breadcrumbs Component
const Breadcrumbs = () => (
  <div className="breadcrumbs">
    <a href="../../../index.html" title=" ">
      Home
    </a>
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
    <nav
      className="pull-right utsa-social-circle-top"
      id="departmentalSocialNav"
    ></nav>
  </div>
);

// NavigationItem Component
const NavigationItem = ({ item }) => (
  <li className="nav-item">
    <a data-icon="" href={item.link} target={item.target || "_self"}>
      {item.title}
    </a>
    {item.children && (
      <ul data-test="childStringClause">
        {item.children.map((child, index) => (
          <li key={index}>
            <a data-icon="" href={child.link} target={child.target || "_self"}>
              {child.title}
            </a>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const Row = ({ item, index }) => {
  const [viewDetails, setViewDetails] = useState(false);
  return (
    <>
      <tr
        className={`${index % 2 === 0 ? "odd" : "even"} dt-hasChild shown `}
        key={index}
      >
        <td
          className={`dt-control sorting_1 ${viewDetails ? "expanded" : ""}`}
          onClick={() => setViewDetails(!viewDetails)}
        ></td>
        <td>{item?.GPO}</td>
        <td>{item?.PrimaryContractSupplier}</td>
        <td>{item?.ContractDescription}</td>
        <td>{item?.VendorHubType}</td>
      </tr>
      {viewDetails && (
        <tr>
          <td colSpan="5">
            <table
              cellPadding="5"
              cellSpacing="0"
              border="0"
              style={{ paddingLeft: "50px" }}
            >
              <tbody>
                <tr>
                  <td>
                    <strong>Vendor Contact Name:</strong>
                  </td>
                  <td>{item?.VendorContactName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vendor Address:</strong>
                  </td>
                  <td>{item?.VendorAddress}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vendor Phone:</strong>
                  </td>
                  <td>{item?.VendorPhone}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vendor Email:</strong>
                  </td>
                  <td>{item?.VendorEmail}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contract Number:</strong>
                  </td>
                  <td>{item?.ContractNumber}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Primary Contract Owner:</strong>
                  </td>
                  <td>{item?.PrimaryContractSupplier}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contract Link:</strong>
                  </td>
                  <td>{item?.ContractLink}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Expiration Date:</strong>
                  </td>
                  <td>{item?.ExpirationDate}</td>
                </tr>
                <tr>
                  <td>
                    <strong>GPO Contact Email:</strong>
                  </td>
                  <td>{item?.GPOContactEmail}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

// GroupContractsTable Component
const GroupContractsTable = () => {
  const [pageCount, setPageCount] = useState(0);
  const totalPages = Math.ceil(data.length / 10);

  const generatePagination = () => {
    const pages = [];
    const left = Math.max(2, pageCount); // Show up to two before current
    const right = Math.min(totalPages - 1, pageCount + 3); // Show up to two after current

    // Always show page 1
    pages.push(
      <a
        key={1}
        className={`paginate_button ${pageCount === 0 ? "current" : ""}`}
        onClick={() => setPageCount(0)}
      >
        1
      </a>
    );

    // Show left ellipsis if needed
    if (left > 2) {
      pages.push(
        <span key="left-ellipsis" className="ellipsis">
          …
        </span>
      );
    }

    // Middle page numbers
    for (let i = left; i <= right; i++) {
      pages.push(
        <a
          key={i}
          className={`paginate_button ${pageCount === i - 1 ? "current" : ""}`}
          onClick={() => setPageCount(i - 1)}
        >
          {i}
        </a>
      );
    }

    // Right ellipsis if needed
    if (right < totalPages - 1) {
      pages.push(
        <span key="right-ellipsis" className="ellipsis">
          …
        </span>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <a
          key={totalPages}
          className={`paginate_button ${
            pageCount === totalPages - 1 ? "current" : ""
          }`}
          onClick={() => setPageCount(totalPages - 1)}
        >
          {totalPages}
        </a>
      );
    }

    return pages;
  };

  return (
    <div className="container pt-2">
      <p>
        A Group Purchasing Organization (GPO) procures contracts on behalf of
        the members it serves. The{" "}
        <a
          className="herosection-link"
          href="https://nam11.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.utsystem.edu%2Foffices%2Fbusiness-affairs%2Fgroup-purchasing-organization-gpo-accreditation-program&amp;data=05%7C01%7Cjavier.martinez3%40utsa.edu%7C03bae5826bd9456d150408dabea0b2e8%7C3a228dfbc64744cb88357b20617fc906%7C0%7C0%7C638031894663217562%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=22E3EEmjCjaDXiiWSiL9EY8xDYQNOflBmUwuWQ0CnYs%3D&amp;reserved=0"
        >
          UT System GPO Accreditation Program
        </a>{" "}
        only recognizes/approves GPOs that satisfy UT System procurement
        standards. Therefore, you may use any UT System GPO contract without the
        need to do a formal solicitation.
      </p>
      <p>
        Available UT System GPO contracts can be found by entering a keyword in
        the "Basic Search" field. The search will look through the{" "}
        <strong>vendor, contract number, </strong>and{" "}
        <strong>contract description</strong> fields, and return contracts that
        match the keyword. You can also refine your search using the advanced
        filter. Clicking the green button expands the contract to display
        additional contract details.
      </p>
      <p>
        Use the vendor email address to obtain quotes. Use the GPO email address
        is provided below if you want to include the GPO in your communications
        with the vendor or need GPO contract guidance.
      </p>
      <p>
        If you have any questions about this tool, or if you would like
        additional information on any of the contracts listed below please email{" "}
        <a className="herosection-link" href="mailto:Purchasing@utsa.edu">
          Purchasing
        </a>
        .
      </p>
      <p>&nbsp;</p>
      <form className="form-inline ">
        <div className="form-group basicSearch">
          <label htmlFor="basic-search">Basic Search</label>
          <input
            className="form-control mx-sm-3"
            id="basic-search"
            type="basic-search"
          />
        </div>
      </form>
      <div
        id="gpo-contracts-table_wrapper"
        className="dataTables_wrapper no-footer"
      >
        <div className="dtsb-searchBuilder">
          <div className="dtsb-titleRow">
            <div className="dtsb-title">Custom Search Builder</div>
          </div>
          <div className="dtsb-group">
            <button className="dtsb-add dtsb-button" type="button">
              Add Condition
            </button>
          </div>
        </div>
        <table
          className="table table-striped table-bordered dataTable no-footer"
          id="gpo-contracts-table"
          width="100%"
          aria-describedby="gpo-contracts-table_info"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th style={{ width: "4px" }}></th>
              <th style={{ width: "85px" }}>GPO</th>
              <th style={{ width: "135px" }}>Vendor Name</th>
              <th style={{ width: "255px" }}>Description</th>
              <th style={{ width: "55px" }}>Vendor HUB Type</th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice(pageCount * 10, pageCount * 10 + 10)
              .map((item, index) => (
                <Row item={item} index={index} />
              ))}
          </tbody>
        </table>

        <div className="dataTables_info" role="status" aria-live="polite">
          Showing {pageCount * 10 + 1} to{" "}
          {Math.min((pageCount + 1) * 10, data.length)} of {data.length + 1}{" "}
          entries
        </div>

        <div className="dataTables_paginate paging_simple_numbers">
          <a
            className={`paginate_button previous ${
              pageCount === 0 ? "disabled" : ""
            }`}
            onClick={() => pageCount > 0 && setPageCount(pageCount - 1)}
          >
            Previous
          </a>

          <span>{generatePagination()}</span>

          <a
            className={`paginate_button next ${
              pageCount === totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() =>
              pageCount < totalPages - 1 && setPageCount(pageCount + 1)
            }
          >
            Next
          </a>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const GroupContractsSearch = () => {
  return (
    <section className="page-content" id="main-content">
      <section
        className="container pt-4"
        id="site-top"
        data-gtm-vis-first-on-screen12328767_185="1216250"
        data-gtm-vis-total-visible-time12328767_185="100"
        data-gtm-vis-has-fired12328767_185="1"
      >
        <div className="containerWrapper">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-sm-7">{/* <Breadcrumbs /> */}</div>
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

      <section
        className="container"
        id="site-banner"
        data-gtm-vis-first-on-screen12328767_185="1216222"
        data-gtm-vis-total-visible-time12328767_185="100"
        data-gtm-vis-has-fired12328767_185="1"
      >
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
              <section
                className="fade-in one"
                data-gtm-vis-first-on-screen12328767_185="1216228"
                data-gtm-vis-total-visible-time12328767_185="100"
                data-gtm-vis-has-fired12328767_185="1"
              >
                <h1 className="intro-title" data-count="1" id="toptext">
                  Group Contracts Search
                </h1>
              </section>
              <div className="row">
                <div className="col-sm-12">
                  <link
                    href="/financialaffairs/css/vendor/datatables.min.css"
                    rel="stylesheet"
                    type="text/css"
                  />
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
