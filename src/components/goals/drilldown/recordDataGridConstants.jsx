import { formatGlobalDate } from "@utils/dateUtil.js";
import { Flex, Tag } from "antd";
import { LuSquareKanban } from "react-icons/lu";

const nameGetter = function(params) {
  return `${params.data.firstName || ""} ${params.data.surname || ""}`.trim();
};
const sysrecordCandidateGetter = function(params) {
  if (!params.data.candidate) {
    return "";
  }
  return `${params.data.candidate.label || ""}`.trim();
};

const sysrecordContactGetter = function(params) {
  if (!params.data.contact) {
    return "";
  }
  return `${params.data.contact.label || ""}`.trim();
};

const sysrecordCompanyGetter = function(params) {
  if (!params.data.company) {
    return "";
  }
  return `${params.data.company.label || ""}`.trim();
};

const fetchOpportunitiesColumns = () => [
  { field: "reference", headerName: "#REF" },
  { field: "name", headerName: "Name" },
  { field: "bid.value", headerName: "Value" },
  { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
  { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
  { field: "owner.label", headerName: "Owner" },
  {
    field: "createdOn",
    headerName: "Created At",
    type: "date",
    sort: "desc",
    sortedAt: 0,
    valueGetter: function(params) {
      return formatGlobalDate(params.data.createdOn);
    }
  }
];

export const activityColumnMap = {
  LEADS_CREATED: [
    { field: "reference", headerName: "#REF" },
    {
      field: "firstName",
      headerName: "Name",
      cellRenderer: (params) => {
        if (!params.data) {
          return ""; // Return an empty string if data is missing
        }
        return `${params.data.firstName} ${params.data.surname}`;
      },
      onCellClicked: (params) => {
        if (params.data && params.data._id) {
          window.COOLUTIL.viewRecordPopupByType("LEAD", params.data._id);
        }
      }
    },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "status", headerName: "Pipeline", sortable: false, cellRenderer: function(params) {
        const status = params.data.status;
        if (!status || !status.pipeline) {
          return null;
        }
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <LuSquareKanban />
            <span>{status.pipeline.name}</span>
            <Tag color={status.type.code === "CLOSED" ? "default" : "success"}>{status.name}</Tag>
          </Flex>
        );
      }
    },
    {
      field: "createdOn",
      headerName: "Created At",
      type: "date",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  OPPORTUNITIES_CREATED: fetchOpportunitiesColumns(),

  OPPORTUNITIES_VALUE: fetchOpportunitiesColumns(),

  OPPORTUNITIES_PIPELINE_VALUE: fetchOpportunitiesColumns(),

  PLACEMENTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  PLACEMENTS_VALUE: [
    { field: "reference", headerName: "#REF" },
    { field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  CANDIDATES_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name", valueGetter: nameGetter },
    { field: "owner.label", headerName: "Recruiter" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  CONTACTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name", valueGetter: nameGetter },
    { field: "owner.label", headerName: "Contact Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],

  OPEN_JOBS_VALUE:[
    { field: "reference", headerName: "#REF" },
    { field: "title", headerName: "Title" },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "commissionDetails", headerName: "Value",
      valueGetter: (params) => {
        const commissionAmount = params.data.commissionAmount;
        const commissionValue = params.data.commissionValue?.currency?.name;
        return `${commissionAmount} ${commissionValue}`;
      },
    },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],

  JOBS_CREATED :[
    { field: "reference", headerName: "#REF" },
    { field: "title", headerName: "Title" },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "status.name", headerName: "Status" },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],

  EMAILS_SENT:[
    { field: "fromName", headerName: "FromName" },
    { field: "fromEmail", headerName: "FromEmail" },
    { field: "subject", headerName: "Subject" },
    { field: "timeReceived", headerName: "TimeReceived" },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],

  CAMPAIGNS_SENT:[
    { field: "name", headerName: "Name" },
    { field: "subject", headerName: "Subject" },
    { field: "template.name", headerName: "Template" },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],

  DEFAULT: [
    { field: "reference", headerName: "#REF" },
    { field: "name", headerName: "Record" },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ]
};
