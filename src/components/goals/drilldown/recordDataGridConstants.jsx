
import { formatGlobalDate, formatGlobalDateWithTime } from "@utils/dateUtil.js";

import { Flex, Tag } from "antd";
import { LuSquareKanban } from "react-icons/lu";

import {  getLocalizedDateString } from "@utils/dateUtil.js";

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

const getAttendeeField = (params, type, field) => {
  const attendee = params.data.attendees?.find(attendee => attendee.type === type);
  return attendee ? attendee[field] : "";
};
const viewRecord = (params, recordType) => {
  if (params.data && params.data._id) {
    window.COOLUTIL.viewRecordPopupByType(recordType, params.data._id);
  }
};
const renderClickableField = (params, fieldName) => {
  if (!params.data) return ""; // Return an empty string if data is missing

  const isClickable = !!params.data._id; // Check if the record is clickable

  return (
    <span
      style={{
        color: "#0057FF",
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      {fieldName }
    </span>
  );
};


const fetchOpportunitiesColumns = () => [
  {
    field: "reference",
    headerName: "#REF",
    cellRenderer: (params) => (
      <>
        {renderClickableField(params, params.data.reference)}
      </>
    ),
    onCellClicked: (params) => viewRecord(params, "OPPORTUNITIES"),
  },


  {
    field: "name",
    headerName: "Name",
    cellRenderer: (params) => (
      <>
        {renderClickableField(params, `${params.data.name} `)}
      </>
    ),
    onCellClicked: (params) => viewRecord(params, "OPPORTUNITIES"),
  },


  { field: "bid.value", headerName: "Value" },
  { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
  { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
  {
    field: "state",
    headerName: "Pipeline",
    sortable: false,
    cellRenderer: function (params) {
      const { state } = params.data;
      if (!state || !state.pipeline) {
        return null;
      }


      let tagColor;
      if (["WON", "CONVERTED"].includes(state.name)) {
        tagColor = "green";
      } else if (["LOST", "SUSPENDED", "ABANDONED"].includes(state.name)) {
        tagColor = "red";
      } else {
        tagColor = "default";
      }

      return (
        <Flex direction="row" align="center" justify="start" gap="small">
          <LuSquareKanban />
          <span>{state.pipeline.name}</span>
          <Tag color={tagColor}>{state.name}</Tag>
        </Flex>
      );
    },
  },
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
  },
];

export const activityColumnMap = {
  LEADS_CREATED: [
    {
      field: "reference",
      headerName: "#REF",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data?.reference)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "LEAD"),
    },
    {
      field: "firstName",
      headerName: "Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, `${params.data.firstName} ${params.data.surname}`)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "LEAD"),
    },

    { field: "email", headerName: "Email" },
    { field: "mobile", headerName: "Mobile" },
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

  OPPORTUNITIES_CREATED:fetchOpportunitiesColumns(),

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
    { field: "placementValue", headerName: "Value" },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  CANDIDATES_CREATED: [

    {
      field: "reference",
      headerName: "#REF",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.reference)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },

    {
      field: "firstName",
      headerName: "Name",
      valueGetter: nameGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, `${params.data.firstName} `)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },
    { field: "email", headerName: "Email" },
    { field: "mobile", headerName: "Mobile" },
    { field: "owner.label", headerName: "Recruiter" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  CONTACTS_CREATED: [

    {
      field: "reference",
      headerName: "#REF",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.reference)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CONTACT"),
    },

    {
      field: "firstName",
      headerName: "Name",
      valueGetter: nameGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, `${params.data.firstName} `)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CONTACT"),
    },
    { field: "email", headerName: "Email" },
    { field: "mobile", headerName: "Mobile" },
    { field: "owner.label", headerName: "Contact Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.createdOn);
      }
    }
  ],
  JOBS_ADVERTISED:[
    { field: "job.label", headerName: "Job" },
    { field: "advert.posterUserName", headerName: "Posting Account" },
    { field: "lookupJobBoard.name", headerName: "Job board" },
    { field: "job.ownerName", headerName: "Publisher" },
  ],

  OPEN_JOBS_VALUE:[
    {
      field: "reference",
      headerName: "#REF",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data?.reference)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "JOB"),
    },
    { field: "title", headerName: "Title" },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data?.company.label)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "JOB"),
    },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data?.contact.label)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "JOB"),
    },
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
  SPEC_CVSHARE:[
    { field: "shareName", headerName: "Title" },
    { field: "candidateOwner", headerName: "Candidate Owner" },
    {
      field: "shareDate", headerName: "Shared On", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return formatGlobalDate(params.data.shareDate);
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
  EVENTS_SCHEDULED:[
    { field: "title", headerName: "Title" },
    { field: "type", headerName: "Type" },
    { field: "notes", headerName: "Notes" },
    {
      field: "attendees.label",
      headerName: "Attendees",
      valueGetter: (params) => {
        let attendees = "";

        if (params.data.attendees && params.data.attendees.length > 0) {

          params.data.attendees.forEach((attendee, index) => {
            if (index === 0) {
              attendees = attendee.label;
            } else {
              attendees += ", " + attendee.label;
            }
          });
        }


        return attendees || "";
      },
      cellRenderer: (params) => {
        const attendees = params.data.attendees;

        if (!attendees || attendees.length === 0) {
          return <div></div>;
        }

        return (
          <>
            {attendees.map((attendee, index) => (
              <div key={`${attendee.label}-${index}`}>
                {attendee.type === "USER" || attendee.type === "UNRECORDED" ? (
                  <span>{attendee.label}</span>
                ) : (
                  renderClickableField(params, attendee.label)
                )}
              </div>
            ))}
          </>
        );
      },
      onCellClicked: (params) => {
        const attendees = params.data.attendees;

        attendees?.forEach((attendee) => {
          if (attendee.type !== "USER" && attendee.type !== "UNRECORDED") {
            viewRecord(params, attendee.type);
          }
        });
      },
    },

    {
      field: "attendees.label",
      headerName: "Attendees",
      valueGetter: (params) => {
        let attendees = "";

        if (params.data.attendees && params.data.attendees.length > 0) {

          params.data.attendees.forEach((attendee, index) => {
            if (index === 0) {
              attendees = attendee.label;
            } else {
              attendees += ", " + attendee.label;
            }
          });
        }


        return attendees || "";
      },
    },










    { field: "organiser.label", headerName: "Organiser" },
    {
      field: "eventStartDate",
      headerName: "Event Start Date",
      type: "date",
      dateFormat: "dd/MM/yy HH:mm",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
      }
    },

    {
      field: "eventEndDate",
      headerName: "Event End Date",
      type: "date",
      dateFormat: "dd/MM/yy HH:mm",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
      }
    },



    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";

      }
    },
  ],

  EMAILS_SENT:[
    { field: "fromName", headerName: "FromName" },
    { field: "fromEmail", headerName: "FromEmail" },
    { field: "subject", headerName: "Subject" },
    { field: "toList", headerName: "ToList",
      valueGetter: (params) => {
        return params.data.toList?.map(data => data.label).join(", ") || "N/A";
      },
    },
    {
      field: "createdOn",
      headerName: "Time Sent",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        const timestamp = params.data.createdOn;
        if (!timestamp) {
          return null;
        }
        return getLocalizedDateString(timestamp, "DD/MM/YYYY HH:mm:ss");
      }
    }
  ],
  LEADS_CLOSED:[
    {
      field: "reference",
      headerName: "#REF",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.reference)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "LEAD"),
    },


    {
      field: "firstName",
      headerName: "Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, `${params.data.firstName} ${params.data.surname}`)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "LEAD"),
    },


    { field: "email", headerName: "Email" },
    { field: "mobile", headerName: "Mobile" },
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
      field: "status",
      headerName: "Status",
      valueGetter: (params) => params.data.statusLog?.[0]?.current?.name || ''
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
    },
    {
      field: "addedOn",
      headerName: "Closing Date",
      type: "date",
      valueGetter: (params) => formatGlobalDate(params.data.statusLog?.[0]?.addedOn)
    }
  ],
  CAMPAIGNS_SENT:[
    { field: "name", headerName: "Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data?.name)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "EMAIL_CAMPAIGN"),
    },
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
      field: "createdOn",
      headerName: "Created At",
      type: "date",
      dateFormat: "dd/MM/yy",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    }
  ]
};
