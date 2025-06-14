import React, { useState } from "react";
import "./Tables.css";
import "./HomePage.css";
import { useEffect } from "react";
import * as XLSX from "xlsx";

import CustomSearchBuilder from "./CustomSearchBuilder";
import axios from "axios";
import { FIELD_MAPPINGS } from './searchConfig';

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
                  <td> 
                    <a href={`mailto:${item?.VendorEmail}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                    {item?.VendorEmail}
                    </a>
                    </td>
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
                  <td>
                    <a href={`mailto:${item?.GPOContactEmail}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                    {item?.GPOContactEmail}
                    </a>
                    </td>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [rawData, setRawData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [searchConditions, setSearchConditions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const url1 = './iasg-gposourcedata-apr2025.xlsx'
      const url =
        "https://stagewww.utrgv.edu/it/_files/documents/iasg-gposourcedata-apr2025.xlsx";
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });
        console.log("reponse7777", response);

        const workbook = XLSX.read(response.data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setRawData(jsonData);

      } catch (error) {
        console.error("Error fetching or parsing Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 'asc' : 'desc';
  };

  const evaluateCondition = (item, condition) => {
    const fieldConfig = FIELD_MAPPINGS[condition.field];
    if (!fieldConfig) return false;

    // If the condition requires a value and value is empty, ignore this condition
    if (!['null', '!null'].includes(condition.condition) && !condition.value) {
      return true;
    }

    const value = item[fieldConfig.apiField];
    const conditionValue = condition.value;
    switch (condition.condition) {
      case '=':
        return String(value).toLowerCase() === String(conditionValue).toLowerCase();
      case '!=':
        return String(value).toLowerCase() !== String(conditionValue).toLowerCase();
      case 'starts':
        return String(value).toLowerCase().startsWith(String(conditionValue).toLowerCase());
      case '!starts':
        return !String(value).toLowerCase().startsWith(String(conditionValue).toLowerCase());
      case 'contains':
        return String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
      case '!contains':
        return !String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'ends':
        return String(value).toLowerCase().endsWith(String(conditionValue).toLowerCase());
      case '!ends':
        return !String(value).toLowerCase().endsWith(String(conditionValue).toLowerCase());
      case 'null':
        return value === null || value === undefined || value === '';
      case '!null':
        return value !== null && value !== undefined && value !== '';
      default:
        return false;
    }
  };

  const evaluateConditions = (item, conditions) => {
    if (!conditions || conditions.length === 0) return true;

    // Only apply conditions that have both field and condition selected
    const validConditions = conditions.filter(
      cond => cond.field && cond.condition
    );
    if (validConditions.length === 0) return true;

    return validConditions.reduce((result, condition, index) => {
      const conditionResult = evaluateCondition(item, condition);
      const subConditionsResult = condition.subConditions.length > 0
        ? evaluateConditions(item, condition.subConditions)
        : true;

      if (index === 0) return conditionResult && subConditionsResult;

      const prevCondition = validConditions[index - 1];
      return prevCondition.logic === 'AND'
        ? result && (conditionResult && subConditionsResult)
        : result || (conditionResult && subConditionsResult);
    }, true);
  };

  const filteredData = rawData.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    const basicSearch = (
      String(item?.GPO)?.toLowerCase().includes(keyword) ||
      String(item?.PrimaryContractSupplier)?.toLowerCase().includes(keyword) ||
      String(item?.ContractDescription)?.toLowerCase().includes(keyword) ||
      String(item?.VendorHubType)?.toLowerCase().includes(keyword) ||
      String(item?.ContractNumber)?.toLowerCase().includes(keyword) ||
      String(item?.["Vendor/Reseller"])?.toLowerCase().includes(keyword) ||
      String(item?.VendorContactName)?.toLowerCase().includes(keyword) ||
      String(item?.VendorEmail)?.toLowerCase().includes(keyword) ||
      String(item?.VendorPhone || "")?.toLowerCase().includes(keyword) ||
      String(item?.VendorAddress)?.toLowerCase().includes(keyword) ||
      String(item?.ContractLink)?.toLowerCase().includes(keyword) ||
      String(item?.ExpirationDate)?.toLowerCase().includes(keyword) ||
      String(item?.GPOContactEmail)?.toLowerCase().includes(keyword)
    );

    const advancedSearch = evaluateConditions(item, searchConditions);

    return basicSearch && advancedSearch;
  });

  const sortedData = getSortedData(filteredData);
  const totalPages = Math.ceil(sortedData.length / entriesPerPage);

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

  // Build availableValues from rawData
  const availableValues = React.useMemo(() => {
    const values = {};
    Object.entries(FIELD_MAPPINGS).forEach(([field, config]) => {
      values[field] = Array.from(new Set(rawData.map(item => item[config.apiField]).filter(Boolean))).sort();
    });
    return values;
  }, [rawData]);

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
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageCount(0);
            }}
          />
        </div>
        <div
          className="form-group ml-3 "
          style={{ width: "100px", margin: "10px 0px" }}
        >
          <label htmlFor="entriesPerPage" style={{ marginRight: "5px" }}>
            Show
          </label>
          <select
            id="entriesPerPage"
            className="form-control"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(
                e.target.value === "All"
                  ? sortedData.length
                  : parseInt(e.target.value)
              );
              setPageCount(0);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={sortedData.length}>All</option>
          </select>
          <span style={{ marginLeft: "5px" }}>entries</span>
        </div>
      </form>
      <div
        id="gpo-contracts-table_wrapper"
        className="dataTables_wrapper no-footer"
      >
        <div className="dtsb-searchBuilder">
          {/* <div className="dtsb-titleRow">
            <div className="dtsb-title">Custom Search Builder</div>
          </div> */}
          <CustomSearchBuilder onSearchChange={setSearchConditions} availableValues={availableValues} />
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
              <th style={{ width: "4px" }}>Expand</th>
              <th 
                style={{ width: "85px", cursor: "pointer" }} 
                onClick={() => requestSort('GPO')}
                data-sort={getSortIcon('GPO')}
              >
                GPO
              </th>
              <th 
                style={{ width: "135px", cursor: "pointer" }} 
                onClick={() => requestSort('PrimaryContractSupplier')}
                data-sort={getSortIcon('PrimaryContractSupplier')}
              >
                Vendor Name
              </th>
              <th 
                style={{ width: "255px", cursor: "pointer" }} 
                onClick={() => requestSort('ContractDescription')}
                data-sort={getSortIcon('ContractDescription')}
              >
                Description
              </th>
              <th 
                style={{ width: "55px", cursor: "pointer" }} 
                onClick={() => requestSort('VendorHubType')}
                data-sort={getSortIcon('VendorHubType')}
              >
                Vendor HUB Type
              </th>
            </tr>
          </thead>
          <tbody>
            {rawData?.length === 0 ? (
              <tr className="odd">
                <td colSpan="100%" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              sortedData
                .slice(
                  pageCount * entriesPerPage,
                  pageCount * entriesPerPage + entriesPerPage
                )
                .map((item, index) => (
                  <Row item={item} index={index} key={index} />
                ))
            )}
          </tbody>
        </table>

        <div
          className="dataTables_info"
          role="status"
          aria-live="polite"
          style={{ display: "flex", alignContent: "center" }}
        >
          Showing{" "}
          {Math.min(sortedData.length, pageCount * entriesPerPage + 1)} to{" "}
          {Math.min((pageCount + 1) * entriesPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
          {!!searchTerm && (
            <span
              style={{ paddingTop: 0, paddingLeft: 4 }}
              className="dataTables_info"
              role="status"
              aria-live="polite"
            >
              (filtered from {rawData.length} total entries)
            </span>
          )}
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
              <img alt="" data-path="" width="100%" />
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
              {/* <div className="row">
                <div className="col-sm-12">
                  <link
                    href="/financialaffairs/css/vendor/datatables.min.css"
                    rel="stylesheet"
                    type="text/css"
                  />
                </div>
              </div> */}
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
