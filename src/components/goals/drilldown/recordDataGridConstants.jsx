import {Flex, Tag} from "antd";
import {LuSquareKanban} from "react-icons/lu";

import {formatGlobalDate, formatGlobalDateWithTime, getLocalizedDateString} from "@utils/dateUtil.js";

const nameGetter = function (params) {
    return `${params.data.firstName || ""} ${params.data.surname || ""}`.trim();
};
const sysrecordCandidateGetter = function (params) {
    if (!params.data.candidate) {
        return "";
    }
    return `${params.data.candidate.label || ""}`.trim();
};

const sysrecordContactGetter = function (params) {
    if (!params.data.contact) {
        return "";
    }
    return `${params.data.contact.label || ""}`.trim();
};

const sysrecordCompanyGetter = function (params) {
    if (!params.data.company) {
        return "";
    }
    return `${params.data.company.label || ""}`.trim();
};

const getAttendeeField = (params, type, field) => {
    const attendee = params.data.attendees?.find((attendee) => attendee.type === type);
    return attendee ? attendee[field] : "";
};
const viewRecord = (params, recordType) => {
    if (params.data && params.data._id) {
        window.COOLUTIL.viewRecordPopupByType(recordType, params.data._id);
    }
};
const renderClickableField = (params, fieldName) => {
    if (!params.data) return "";

    const isClickable = !!params.data._id;

    return (
        <span
            style={{
                color: "#0057FF",
                cursor: isClickable ? "pointer" : "default",
            }}
        >
      {fieldName}
    </span>
    );
};

export const activityColumnMap = {
    LEADS_CREATED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "LEAD"),
        },
        {
            field: "firstName",
            headerName: "Name",
            cellRenderer: (params) => <>{renderClickableField(params, `${params.data.firstName} ${params.data.surname}`)}</>,
            onCellClicked: (params) => viewRecord(params, "LEAD"),
        },

        {field: "email", headerName: "Email"},
        {field: "mobile", headerName: "Mobile"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "status",
            headerName: "Pipeline",
            sortable: false,
            cellRenderer: function (params) {
                const status = params.data.status;
                if (!status || !status.pipeline) {
                    return null;
                }
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <LuSquareKanban/>
                        <span>{status.pipeline.name}</span>
                        <Tag color={status.type.code === "CLOSED" ? "default" : "success"}>{status.name}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return formatGlobalDate(params.data.createdOn);
            },
        },
        {field: "companyName", headerName: "Company Name"},
    ],

    OPPORTUNITIES_CREATED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "OPPORTUNITY"),
        },
        {
            field: "name",
            headerName: "Title",
        },
        {field: "", headerName: "Pulse"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return formatGlobalDate(params.data.createdOn);
            },
        },
        {
            field: "state",
            headerName: "Pipeline",
            sortable: false,
            cellRenderer: function (params) {
                const {state} = params.data;
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
                        <LuSquareKanban/>
                        <span>{state.pipeline.name}</span>
                        <Tag color={tagColor}>{state.name}</Tag>
                    </Flex>
                );
            },
        },
        {field: "bid.value", headerName: "Deal Value"},
        {field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter},
        {field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter},
    ],

    OPPORTUNITIES_VALUE: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "OPPORTUNITY"),
        },
        {
            field: "name",
            headerName: "Title",
        },
        {field: "", headerName: "Pulse"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return formatGlobalDate(params.data.createdOn);
            },
        },
        {
            field: "state",
            headerName: "Pipeline",
            sortable: false,
            cellRenderer: function (params) {
                const {state} = params.data;
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
                        <LuSquareKanban/>
                        <span>{state.pipeline.name}</span>
                        <Tag color={tagColor}>{state.name}</Tag>
                    </Flex>
                );
            },
        },
        {field: "bid.value", headerName: "Deal Value"},
        {field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter},
        {field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter},
    ],

    OPPORTUNITIES_PIPELINE_VALUE: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "OPPORTUNITY"),
        },
        {
            field: "name",
            headerName: "Title",
        },
        {field: "", headerName: "Pulse"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return formatGlobalDate(params.data.createdOn);
            },
        },
        {
            field: "state",
            headerName: "Pipeline",
            sortable: false,
            cellRenderer: function (params) {
                const {state} = params.data;
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
                        <LuSquareKanban/>
                        <span>{state.pipeline.name}</span>
                        <Tag color={tagColor}>{state.name}</Tag>
                    </Flex>
                );
            },
        },
        {field: "bid.value", headerName: "Deal Value"},
        {field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter},
        {field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter},
    ],

    PLACEMENTS_CREATED: [
        {field: "reference", headerName: "#REF"},
        {field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter},
        {field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter},
        {field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    PLACEMENTS_VALUE: [
        {field: "reference", headerName: "#REF"},
        {field: "job.label", headerName: "Title"},
        {field: "employmentType.name", headerName: "Type"},
        {field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter},
        {field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter},
        {field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter},
        {field: "placementValue", headerName: "Billing Amount"},
        {
            field: "placementDate",
            headerName: "Placement Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            valueGetter: function (params) {
                return formatGlobalDate(params.data.placementDate);
            },
        },
        {
            field: "startDate",
            headerName: "Start Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            valueGetter: function (params) {
                return formatGlobalDate(params.data.startDate);
            },
        },
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    CANDIDATES_CREATED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
        },

  PLACEMENTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "owner.label", headerName: "Owner" },
    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    }
  ],
  JOBS_ADVERTISED:[
    { field: "job.label", headerName: "Job" },
    { field: "advert.postingAccount", headerName: "Posting Account" },
    { field: "lookupJobBoard.name", headerName: "Job Board" },
    { field: "userName", headerName: "Publisher" },
    {
      field: "createdOn",
      headerName: "Posting Date",
      valueGetter: function(params) {
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    },
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    }
  ],
  SPEC_CVSHARE:[
    { field: "shareName", headerName: "Title" },
    { field: "candidateOwner", headerName: "Candidate Owner" },
    {
      field: "shareDate", headerName: "Shared On", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return params.data.shareDate ? formatGlobalDate(params.data.shareDate) : "";
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    }
  ],
  EVENTS_SCHEDULED:[
    { field: "title",
      headerName: "Title" ,
      cellRenderer: (params) => {
        const title = params.data?.title || "";
        const type = params.data?.type || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small" >
            <span>{title}</span>
            <Tag >{type}</Tag>
          </Flex>
        );
      },
    },
    {
      field: "attendees.label",
      headerName: "Attendees",
      valueGetter: (params) => {
        let attendees = [];

        if (params.data.attendees && params.data.attendees.length > 0) {
          params.data.attendees.forEach((attendee) => {
            if (attendee.type !== "USER" && attendee.type !== "UNRECORDED") {
              attendees.push(attendee.label);
            }
          });
        }

        return attendees.join(", ") || "";
      },
      cellRenderer: (params) => {
        const attendees = params.data.attendees || [];

        const attendeeElements = attendees.map((attendee, index) => {
          if (attendee.type === "USER" || attendee.type === "UNRECORDED") {
            return <span key={index}>{attendee.label}</span>;
          }

          return (
            <span
              key={index}
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                const candidateId = attendee._id;
                console.log("candidateId", candidateId);
                if (candidateId) {
                  window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                }
              }}
            >
          {attendee.label}
        </span>
          );
        });


        return attendeeElements.length > 0
          ? attendeeElements.reduce((prev, curr) => [prev, ", ", curr])
          : null;
      },
    },


    {
      field: "notes",
      headerName: "Notes",
      valueGetter: (params) => {

        const notes = params.data?.notes || "";
        return notes.replace(/<\/?[^>]+(>|$)/g, "");
      }
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
  INTERVIEWS_SCHEDULED : [
    {
      field: "title",
      headerName: "Title",
      cellRenderer: (params) => {
        const title = params.data?.title || "";
        const type = params.data?.type || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{title}</span>
            <Tag>{type}</Tag>
          </Flex>
        );
      },
    },
    {
      field: "label",
      headerName: "Candidate",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, getAttendeeField(params, 'CANDIDATE', 'label'))}
        </>
      ),
      onCellClicked: (params) => {
        const candidateId = getAttendeeField(params, 'CANDIDATE', '_id');
        console.log("candidateId",candidateId);
        if (candidateId) {
          window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
        }
      },
    },
    {
      field: "label",
      headerName: "Contact Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, getAttendeeField(params, 'CONTACT', 'reference'))}
          {" "}
          {renderClickableField(params, getAttendeeField(params, 'CONTACT', 'label'))}
        </>
      ),
      onCellClicked: (params) => {
        const contactId = getAttendeeField(params, 'CONTACT', '_id');
        console.log("contactId",contactId);
        if (contactId) {
          window.COOLUTIL.viewRecordPopupByType("CONTACT", contactId);
        }
      },
    },
    {
      field: "companyName",
      headerName: "Company",
      valueGetter: (params) => {
        const contact = params.data.attendees?.find(attendee => attendee.type === 'CONTACT');
        return contact ? contact.params.companyName : "";
      }
    },
    {
      field: "mobile",
      headerName: "Contact Mobile",
      valueGetter: (params) => getAttendeeField(params, 'CONTACT', 'mobile')
    },
    {
      field:"eventStartDate",headerName: "Interview StartDate",type: "date",
      dateFormat: "dd/MM/yy HH:mm",
      valueGetter: function(params) {
        return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
      }
    },
    {
      field:"eventEndDate",headerName: "Interview EndDate",type: "date",  dateFormat: "dd/MM/yy HH:mm",
      valueGetter: function(params) {
        return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
      }
    }
  ],
  INTERVIEW_SCHEDULED_VALUE : [

    {
      field: "job.reference",
      headerName: "Job Reference",},
    {
      field: "title",
      headerName: "Title",
      cellRenderer: (params) => {
        const title = params.data?.title || "";
        const type = params.data?.type || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{title}</span>
            <Tag>{type}</Tag>
          </Flex>
        );
      },
    },
    {
      field: "owner.label",
      headerName: "PipeCard Owner"},

    {
      field: "label",
      headerName: "Candidate",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, getAttendeeField(params, 'CANDIDATE', 'label'))}
        </>
      ),
      onCellClicked: (params) => {
        const candidateId = getAttendeeField(params, 'CANDIDATE', '_id');
        console.log("candidateId",candidateId);
        if (candidateId) {
          window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
        }
      },
    },
    {
      field: "companyName",
      headerName: "Company",
      valueGetter: (params) => {
        const contact = params.data.attendees?.find(attendee => attendee.type === 'CONTACT');
        return contact ? contact.params.companyName : "";
      }
    },
    {
      field: "label",
      headerName: "Contact Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, getAttendeeField(params, 'CONTACT', 'reference'))}
          {" "}
          {renderClickableField(params, getAttendeeField(params, 'CONTACT', 'label'))}
        </>
      ),
      onCellClicked: (params) => {
        const contactId = getAttendeeField(params, 'CONTACT', '_id');
        console.log("contactId",contactId);
        if (contactId) {
          window.COOLUTIL.viewRecordPopupByType("CONTACT", contactId);
        }
      },
    },


    {
      field:"eventStartDate",headerName: "Interview StartDate",type: "date",
      dateFormat: "dd/MM/yy HH:mm",
      valueGetter: function(params) {
        return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
      }
    },
    {
      field:"eventEndDate",headerName: "Interview EndDate",type: "date",  dateFormat: "dd/MM/yy HH:mm",
      valueGetter: function(params) {
        return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
      }
    },
    {
      field:"location.cityName",headerName: "Interview Location",

    },
    {
      field:"interviewPipeline.state.name",headerName: "Interview Stage",

    },
    {
      field: "interviewPipeline.rejected",
      headerName: "Rejected Flag",
      valueGetter: (params) => {
        const rejected = params.data?.interviewPipeline?.rejected;
        if (rejected) {
          return params.data?.interviewPipeline?.rejectInfo?.reason?.name || "";
        }
        return "";
      },
      cellRenderer: (params) => {
        const rejected = params.data?.interviewPipeline?.rejected;
        const rejectionReason = params.data?.interviewPipeline?.rejectInfo?.reason?.name || "";

        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{rejectionReason}</span>
            {rejected && <Tag color="red">Rejected</Tag>}
          </Flex>
        );
      },
    },


  ],
  EMAILS_SENT:[
    { field: "fromName", headerName: "FromName" },
    { field: "fromEmail", headerName: "FromEmail" },
    { field: "subject", headerName: "Subject" },
    {
      field: "toList",
      headerName: "ToList",
      valueGetter: (params) => {
        return params.data.toList?.map(data => data.label).join(", ") || "N/A";
      },
      cellRenderer: (params) => {
        const toList = params.data.toList || [];

        const toListElements = toList.map((data, index) => {
          if (data.type === "USER" || data.type === "UNRECORDED") {
            return <span key={index}>{data.label}</span>;
          }

          return (
            <span
              key={index}
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                const candidateId = data._id;
                console.log("candidateId", candidateId);
                if (candidateId) {
                  window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                }
              }}
            >
          {data.label}
        </span>
          );
        });

        return toListElements.length > 0
          ? toListElements.reduce((prev, curr) => [prev, ", ", curr])
          : null;
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
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
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    }
  ],
  CANDIDATES_SHORTLISTED : [
    {
      field: "statusName",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusName = params.data?.statusName || "";
        const subStateName = params.data?.subStateName || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{statusName}</span>
            <Tag>{subStateName}</Tag>
          </Flex>
        );
      },
    },
    { field: "candidateLabel", headerName: "Candidate",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.candidateLabel)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },
    { field: "candidateEmail", headerName: "Email" },
    { field: "contactName", headerName: "Contact Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.contactName)}
        </>
      ),
      onCellClicked: (params) => {
        if (params.data && params.data.contactRef) {
          window.COOLUTIL.viewRecordPopupByType("CONTACT", params.data.contactRef);
        }
      },
    },
    { field: "jobCommissionValue", headerName: "Value",
      valueGetter: (params) => {
        const value = params.data.jobCommissionValue?.value;
        const currencyName  = params.data.jobCommissionValue?.currency?.name;
        return `${value} ${currencyName }`;
      },
    },
    { field: "companyLabel", headerName: "Company"},
    { field: "jobTitle", headerName: "Job" },
    {
      field: "shortlistDate",
      headerName: "ShortlistDate",
      type: "date",
      dateFormat: "dd/MM/yy",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.shortlistDate ? formatGlobalDate(params.data.shortlistDate) : "";
      }
    }
  ],
  PIPELINE_CVSENT : [
    {
      field: "statusName",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusName = params.data?.statusName || "";
        const subStateName = params.data?.subStateName || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{statusName}</span>
            <Tag>{subStateName}</Tag>
          </Flex>
        );
      },
    },
    { field: "candidateLabel", headerName: "Candidate",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.candidateLabel)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },
    { field: "candidateEmail", headerName: "Email" },
    { field: "contactName", headerName: "Contact Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.contactName)}
        </>
      ),
      onCellClicked: (params) => {
        if (params.data && params.data._id) {
          window.COOLUTIL.viewRecordPopupByType("CONTACT", params.contactRef);
        }
      },
    },
    { field: "jobCommissionValue", headerName: "Value",
      valueGetter: (params) => {
        const value = params.data.jobCommissionValue?.value;
        const currencyName  = params.data.jobCommissionValue?.currency?.name;
        return `${value} ${currencyName }`;
      },
    },
    { field: "companyLabel", headerName: "Company"},
    { field: "jobTitle", headerName: "Job" },
    {
      field: "cvSentDate",
      headerName: "CVSentDate",
      type: "date",
      dateFormat: "dd/MM/yy",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.cvSentDate ? formatGlobalDate(params.data.cvSentDate) : "";
      }
    }
  ],
  PIPELINE_OFFER : [
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusName = params.data?.statusName || "";
        const subStateName = params.data?.subStateName || "";
        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{statusName}</span>
            <Tag>{subStateName}</Tag>
          </Flex>
        );
      },
    },
    { field: "candidateLabel", headerName: "Candidate",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.candidateLabel)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },
    { field: "candidateEmail", headerName: "Email" },
    { field: "contactName", headerName: "Contact Name",
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.contactName)}
        </>
      ),
      onCellClicked: (params) => {
        if (params.data && params.data._id) {
          window.COOLUTIL.viewRecordPopupByType("CONTACT", params.contactRef);
        }
      },
    },
    { field: "jobCommissionValue", headerName: "Value",
      valueGetter: (params) => {
        const value = params.data.jobCommissionValue?.value;
        const currencyName  = params.data.jobCommissionValue?.currency?.name;
        return `${value} ${currencyName }`;
      },
    },
    { field: "companyLabel", headerName: "Company"},
    { field: "jobTitle", headerName: "Job" },
    {
      field: "offerDate",
      headerName: "OfferDate",
      type: "date",
      dateFormat: "dd/MM/yy",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.offerDate ? formatGlobalDate(params.data.offerDate) : "";
      }
    }
  ],
  PIPELINE_VALUE : [


    {
      field: "candidate._id",
      headerName: "Candidate",
      valueGetter: sysrecordCandidateGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.candidate.label)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
    },
    {
      field: "company._id",
      headerName: "Company",
      valueGetter: sysrecordCompanyGetter,
      cellRenderer: (params) => (
        <>
          {renderClickableField(params, params.data.company.label)}
        </>
      ),
      onCellClicked: (params) => viewRecord(params, "COMPANY"),
    },

    { field: "owner.label", headerName: "Owner" },

    {
      field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0,
      valueGetter: function(params) {
        return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
      }
    },
    { field: "status.name", headerName: "Pipeline Status" },
    { field: "state.name", headerName: "Pipeline SubStatus" },
    {
      field: "rejected",
      headerName: "Rejected Flag",
      valueGetter: (params) => {
        const rejected = params.data?.rejected;
        if (rejected) {
          return params.data?.rejectInfo?.reason?.name || "";
        }
        return "";
      },
      cellRenderer: (params) => {
        const rejected = params.data?.rejected;
        const rejectionReason = params.data?.rejectInfo?.reason?.name || "";

        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{rejectionReason}</span>
            {rejected && <Tag color="red">Rejected</Tag>}
          </Flex>
        );
      },
    },



  ],
  JOURNAL : [
    {field: "journalFrom.label", headerName: "User" },
    {
      field: "journalActivityLabel",
      headerName: "Activity Type",
      cellRenderer: function(params) {
        const { journalActivityLabel, journalActivityType } = params.data;

        if (!journalActivityLabel || !journalActivityType) {
          return null;
        }


        const tagColor = journalActivityType === "SPECIFIC_TYPE" ? "default" : "success";

        return (
          <Flex direction="row" align="center" justify="start" gap="small">
            <span>{journalActivityLabel}</span>
            <Tag color={tagColor}>{journalActivityType}</Tag>
          </Flex>
        );
      }
    },


    {
      field: "journalMessage",
      headerName: "Message",
      valueGetter: (params) => {
        const message = params.data?.journalMessage || "";
        return message.replace(/<\/?[^>]+(>|$)/g, "");
      }
    },
    {
      field: "journalLinkedTo.label",
      headerName: "JournalLinked Records",
      valueGetter: (params) => {
        let journalLinkedTo = [];

        if (params.data.journalLinkedTo && params.data.journalLinkedTo.length > 0) {
          params.data.journalLinkedTo.forEach((journalLinkedTos) => {
            if (journalLinkedTos.type !== "USER" && journalLinkedTos.type !== "UNRECORDED") {
              journalLinkedTo.push(journalLinkedTos.label);
            }
          });
        }

        return journalLinkedTo.join(", ") || "";
      },
      cellRenderer: (params) => {
        const journalLinkedTo = params.data.journalLinkedTo || [];

        const journalLinkedTosElements = journalLinkedTo.map((journalLinkedTos, index) => {
          if (journalLinkedTos.type === "USER" || journalLinkedTos.type === "UNRECORDED") {
            return <span key={index}>{journalLinkedTos.label}</span>;
          }

          return (
            <span
              key={index}
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                const candidateId = journalLinkedTos._id;
                console.log("candidateId", candidateId);
                if (candidateId) {
                  window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                }
              }}
            >
          {journalLinkedTos.label}
        </span>
          );
        });


        return journalLinkedTosElements.length > 0
          ? journalLinkedTosElements.reduce((prev, curr) => [prev, ", ", curr])
          : null;
      },
    },

    {
      field: "journalDate",
      headerName: "Activity Date",
      type: "date",
      dateFormat: "dd/MM/yy",
      sort: "desc",
      sortedAt: 0,
      valueGetter: function(params) {
        return params.data.journalDate ? formatGlobalDate(params.data.journalDate) : "";
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
=======
        {
            field: "firstName",
            headerName: "Name",
            valueGetter: nameGetter,
            cellRenderer: (params) => <>{renderClickableField(params, `${params.data.firstName} `)}</>,
            onCellClicked: (params) => viewRecord(params, "CANDIDATE"),
        },
        {field: "email", headerName: "Email"},
        {field: "mobile", headerName: "Mobile"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    CONTACTS_CREATED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "CONTACT"),
        },

        {
            field: "firstName",
            headerName: "Name",
            valueGetter: nameGetter,
            cellRenderer: (params) => <>{renderClickableField(params, `${params.data.firstName} `)}</>,
            onCellClicked: (params) => viewRecord(params, "CONTACT"),
        },
        {field: "email", headerName: "Email"},
        {field: "mobile", headerName: "Mobile"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    JOBS_ADVERTISED: [
        {field: "job.label", headerName: "Job"},
        {field: "advert.postingAccount", headerName: "Posting Account"},
        {field: "lookupJobBoard.name", headerName: "Job Board"},
        {field: "userName", headerName: "Publisher"},
        {
            field: "createdOn",
            headerName: "Posting Date",
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],

    OPEN_JOBS_VALUE: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
        {field: "title", headerName: "Title"},
        {field: "", headerName: "Pulse"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
        {
            field: "commissionDetails",
            headerName: "Fees",
            valueGetter: (params) => {
                const commissionAmount = params.data.commission;
                const commissionValue = params.data.commissionValue?.currency?.name;
                return `${commissionAmount} ${commissionValue}`;
            },
        },
        {
            field: "company._id",
            headerName: "Company",
            valueGetter: sysrecordCompanyGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.company.label)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
        {
            field: "contact._id",
            headerName: "Contact",
            valueGetter: sysrecordContactGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.contact.label)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
    ],
    SPEC_CVSHARE: [
        {field: "shareName", headerName: "Title"},
        {field: "candidateOwner", headerName: "Candidate Owner"},
        {
            field: "shareDate",
            headerName: "Shared On",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.shareDate ? formatGlobalDate(params.data.shareDate) : "";
            },
        },
    ],

    JOBS_CREATED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
        {field: "title", headerName: "Title"},
        {
            field: "commissionDetails",
            headerName: "Fees",
            valueGetter: (params) => {
                const commissionAmount = params.data.commissionAmount;
                const commissionValue = params.data.commissionValue?.currency?.name;
                return `${commissionAmount} ${commissionValue}`;
            },
        },
        {
            field: "company._id",
            headerName: "Company",
            valueGetter: sysrecordCompanyGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.company.label)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
        {
            field: "contact._id",
            headerName: "Contact",
            valueGetter: sysrecordContactGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.contact.label)}</>,
            onCellClicked: (params) => viewRecord(params, "JOB"),
        },
        {field: "status.name", headerName: "Status"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    EVENTS_SCHEDULED: [
        {
            field: "title",
            headerName: "Title",
            cellRenderer: (params) => {
                const title = params.data?.title || "";
                const type = params.data?.type || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{title}</span>
                        <Tag>{type}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "attendees.label",
            headerName: "Attendees",
            valueGetter: (params) => {

                let attendees = [];

                if (params.data.attendees && params.data.attendees.length > 0) {
                    params.data.attendees.forEach((attendee) => {


                            if (attendee.type !== "USER" && attendee.type !== "UNRECORDED") {
                                attendees.push(attendee.label);
                            }
                        });
                    }


                    return attendees.join(", ") || "";
                },
                cellRenderer: (params) => {
                    const attendees = params.data.attendees || [];

                    const attendeeElements = attendees.map((attendee, index) => {
                        if (attendee.type === "USER" || attendee.type === "UNRECORDED") {
                            return <span key={index}>{attendee.label}</span>;
                        }

                        return (
                          <span
                            key={index}
                            style={{ color: "blue", cursor: "pointer"}}
                            onClick={() => {
                                const candidateId = attendee._id;
                                console.log("candidateId", candidateId);
                                if (candidateId) {
                                    window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                                }
                            }}
                          >
          {attendee.label}
        </span>
                        );
                    });


                    return attendeeElements.length > 0
                      ? attendeeElements.reduce((prev, curr) => [prev, ", ", curr])
                      : null;
                },
            },
        {
            field: "notes",
            headerName: "Notes",
            valueGetter: (params) => {
                const notes = params.data?.notes || "";
                return notes.replace(/<\/?[^>]+(>|$)/g, "");
            },
        },
        {field: "organiser.label", headerName: "Organiser"},
        {
            field: "eventStartDate",
            headerName: "Event Start Date",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
            },
        },
        {
            field: "eventEndDate",
            headerName: "Event End Date",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
            },
        },
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    INTERVIEWS_SCHEDULED: [
        {
            field: "title",
            headerName: "Title",
            cellRenderer: (params) => {
                const title = params.data?.title || "";
                const type = params.data?.type || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{title}</span>
                        <Tag>{type}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "label",
            headerName: "Candidate",
            cellRenderer: (params) => <>{renderClickableField(params, getAttendeeField(params, "CANDIDATE", "label"))}</>,
            onCellClicked: (params) => {
                const candidateId = getAttendeeField(params, "CANDIDATE", "_id");
                console.log("candidateId", candidateId);
                if (candidateId) {
                    window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                }
            },
        },
        {
            field: "label",
            headerName: "Contact Name",
            cellRenderer: (params) => (
                <>
                    {renderClickableField(params, getAttendeeField(params, "CONTACT", "reference"))} {renderClickableField(params, getAttendeeField(params, "CONTACT", "label"))}
                </>
            ),
            onCellClicked: (params) => {
                const contactId = getAttendeeField(params, "CONTACT", "_id");
                console.log("contactId", contactId);
                if (contactId) {
                    window.COOLUTIL.viewRecordPopupByType("CONTACT", contactId);
                }
            },
        },
        {
            field: "companyName",
            headerName: "Company",
            valueGetter: (params) => {
                const contact = params.data.attendees?.find((attendee) => attendee.type === "CONTACT");
                return contact ? contact.params.companyName : "";
            },
        },
        {
            field: "mobile",
            headerName: "Contact Mobile",
            valueGetter: (params) => getAttendeeField(params, "CONTACT", "mobile"),
        },
        {
            field: "eventStartDate",
            headerName: "Interview StartDate",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            valueGetter: function (params) {
                return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
            },
        },
        {
            field: "eventEndDate",
            headerName: "Interview EndDate",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            valueGetter: function (params) {
                return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
            },
        },
    ],
    INTERVIEW_SCHEDULED_VALUE: [
        {
            field: "job.reference",
            headerName: "Job Reference",
        },
        {
            field: "title",
            headerName: "Title",
            cellRenderer: (params) => {
                const title = params.data?.title || "";
                const type = params.data?.type || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{title}</span>
                        <Tag>{type}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "owner.label",
            headerName: "PipeCard Owner",
        },

        {
            field: "label",
            headerName: "Candidate",
            cellRenderer: (params) => <>{renderClickableField(params, getAttendeeField(params, "CANDIDATE", "label"))}</>,
            onCellClicked: (params) => {
                const candidateId = getAttendeeField(params, "CANDIDATE", "_id");
                console.log("candidateId", candidateId);
                if (candidateId) {
                    window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                }
            },
        },
        {
            field: "companyName",
            headerName: "Company",
            valueGetter: (params) => {
                const contact = params.data.attendees?.find((attendee) => attendee.type === "CONTACT");
                return contact ? contact.params.companyName : "";
            },
        },
        {
            field: "label",
            headerName: "Contact Name",
            cellRenderer: (params) => (
                <>
                    {renderClickableField(params, getAttendeeField(params, "CONTACT", "reference"))} {renderClickableField(params, getAttendeeField(params, "CONTACT", "label"))}
                </>
            ),
            onCellClicked: (params) => {
                const contactId = getAttendeeField(params, "CONTACT", "_id");
                console.log("contactId", contactId);
                if (contactId) {
                    window.COOLUTIL.viewRecordPopupByType("CONTACT", contactId);
                }
            },
        },

        {
            field: "eventStartDate",
            headerName: "Interview StartDate",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            valueGetter: function (params) {
                return params.data.eventStartDate ? formatGlobalDateWithTime(params.data.eventStartDate) : "";
            },
        },
        {
            field: "eventEndDate",
            headerName: "Interview EndDate",
            type: "date",
            dateFormat: "dd/MM/yy HH:mm",
            valueGetter: function (params) {
                return params.data.eventEndDate ? formatGlobalDateWithTime(params.data.eventEndDate) : "";
            },
        },
        {
            field: "location.cityName",
            headerName: "Interview Location",
        },
        {
            field: "interviewPipeline.state.name",
            headerName: "Interview Stage",
        },
        {
            field: "interviewPipeline.rejected",
            headerName: "Rejected Flag",
            valueGetter: (params) => {
                const rejected = params.data?.interviewPipeline?.rejected;
                if (rejected) {
                    return params.data?.interviewPipeline?.rejectInfo?.reason?.name || "";
                }
                return "";
            },
            cellRenderer: (params) => {
                const rejected = params.data?.interviewPipeline?.rejected;
                const rejectionReason = params.data?.interviewPipeline?.rejectInfo?.reason?.name || "";

                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{rejectionReason}</span>
                        {rejected && <Tag color="red">Rejected</Tag>}
                    </Flex>
                );
            },
        },
    ],
    EMAILS_SENT: [
        {field: "fromName", headerName: "FromName"},
        {field: "fromEmail", headerName: "FromEmail"},
        {field: "subject", headerName: "Subject"},
        {
            field: "toList",
            headerName: "ToList",
            valueGetter: (params) => {
                return params.data.toList?.map(data => data.label).join(", ") || "N/A";
            },
            cellRenderer: (params) => {
                const toList = params.data.toList || [];

                const toListElements = toList.map((data, index) => {
                    if (data.type === "USER" || data.type === "UNRECORDED") {
                        return <span key={index}>{data.label}</span>;
                    }

                    return (
                      <span
                        key={index}
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => {
                            const candidateId = data._id;
                            console.log("candidateId", candidateId);
                            if (candidateId) {
                                window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                            }
                        }}
                      >
          {data.label}
        </span>
                    );
                });

                return toListElements.length > 0
                  ? toListElements.reduce((prev, curr) => [prev, ", ", curr])
                  : null;
            },
        },
        {
            field: "createdOn",
            headerName: "Time Sent",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                const timestamp = params.data.createdOn;
                if (!timestamp) {
                    return null;
                }
                return getLocalizedDateString(timestamp, "DD/MM/YYYY HH:mm:ss");
            },
        },
    ],
    LEADS_CLOSED: [
        {
            field: "reference",
            headerName: "#REF",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.reference)}</>,
            onCellClicked: (params) => viewRecord(params, "LEAD"),
        },
        {
            field: "firstName",
            headerName: "Name",
            cellRenderer: (params) => <>{renderClickableField(params, `${params.data.firstName} ${params.data.surname}`)}</>,
            onCellClicked: (params) => viewRecord(params, "LEAD"),
        },
        {field: "email", headerName: "Email"},
        {field: "mobile", headerName: "Mobile"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "status",
            headerName: "Pipeline",
            sortable: false,
            cellRenderer: function (params) {
                const status = params.data.status;
                if (!status || !status.pipeline) {
                    return null;
                }
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <LuSquareKanban/>
                        <span>{status.pipeline.name}</span>
                        <Tag color={status.type.code === "CLOSED" ? "default" : "success"}>{status.name}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            valueGetter: (params) => params.data.statusLog?.[0]?.current?.name || "",
        },
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
        {
            field: "addedOn",
            headerName: "Closing Date",
            type: "date",
            valueGetter: (params) => formatGlobalDate(params.data.statusLog?.[0]?.addedOn),
        },
    ],
    CAMPAIGNS_SENT: [
        {
            field: "name",
            headerName: "Name",
            cellRenderer: (params) => <>{renderClickableField(params, params.data?.name)}</>,
            onCellClicked: (params) => viewRecord(params, "EMAIL_CAMPAIGN"),
        },
        {field: "subject", headerName: "Subject"},
        {field: "template.name", headerName: "Template"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    CANDIDATES_SHORTLISTED: [
        {field: "candidateRef", headerName: "Candidate Ref"},
        {
            field: "statusName",
            headerName: "Status",
            cellRenderer: (params) => {
                const statusName = params.data?.statusName || "";
                const subStateName = params.data?.subStateName || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{statusName}</span>
                        <Tag>{subStateName}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "candidateLabel",
            headerName: "Candidate",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.candidateLabel)}</>,
            onCellClicked: (params) => {
              if (params.data && params.data.candidateId) {
                 window.COOLUTIL.viewRecordPopupByType("CANDIDATE", params.data.candidateId);
              }
            },
        },
        {field: "candidateEmail", headerName: "Email"},
        {field: "candidateMobile", headerName: "Mobile"},
        {field: "ownerName", headerName: "Owner"},
        {field: "jobRef", headerName: "Job Ref"},
        {field: "jobTitle", headerName: "Job Title"},
        {
            field: "jobCommissionValue",
            headerName: "Value",
            valueGetter: (params) => {
                const value = params.data.jobCommissionValue?.value;
                const currencyName = params.data.jobCommissionValue?.currency?.name;
                return `${value} ${currencyName}`;
            },
        },
        {field: "companyLabel", headerName: "Company"},
        {
            field: "contactName",
            headerName: "Contact Name",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.contactName)}</>,
            onCellClicked: (params) => {
                if (params.data && params.data.contactRef) {
                    window.COOLUTIL.viewRecordPopupByType("CONTACT", params.data.contactRef);
                }
            },
        },
        {
            field: "shortlistDate",
            headerName: "ShortlistDate",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.shortlistDate ? formatGlobalDate(params.data.shortlistDate) : "";
            },
        },
        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
    PIPELINE_CVSENT: [
        {
            field: "statusName",
            headerName: "Status",
            cellRenderer: (params) => {
                const statusName = params.data?.statusName || "";
                const subStateName = params.data?.subStateName || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{statusName}</span>
                        <Tag>{subStateName}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "candidateLabel",
            headerName: "Candidate",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.candidateLabel)}</>,
            onCellClicked: (params) => {
              if (params.data && params.data.candidateId) {
                window.COOLUTIL.viewRecordPopupByType("CANDIDATE", params.data.candidateId);
              }
            },
        },
        {field: "candidateEmail", headerName: "Email"},
        {
            field: "contactName",
            headerName: "Contact Name",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.contactName)}</>,
            onCellClicked: (params) => {
                if (params.data && params.data.contactRef) {
                    window.COOLUTIL.viewRecordPopupByType("CONTACT", params.data.contactRef);
                }
            },
        },
        {
            field: "jobCommissionValue",
            headerName: "Value",
            valueGetter: (params) => {
                const value = params.data.jobCommissionValue?.value;
                const currencyName = params.data.jobCommissionValue?.currency?.name;
                return `${value} ${currencyName}`;
            },
        },
        {field: "companyLabel", headerName: "Company"},
        {field: "jobTitle", headerName: "Job"},
        {
            field: "cvSentDate",
            headerName: "CVSentDate",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.cvSentDate ? formatGlobalDate(params.data.cvSentDate) : "";
            },
        },
    ],
    PIPELINE_OFFER: [
        {
            field: "status",
            headerName: "Status",
            cellRenderer: (params) => {
                const statusName = params.data?.statusName || "";
                const subStateName = params.data?.subStateName || "";
                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{statusName}</span>
                        <Tag>{subStateName}</Tag>
                    </Flex>
                );
            },
        },
        {
            field: "candidateLabel",
            headerName: "Candidate",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.candidateLabel)}</>,
            onCellClicked: (params) => {
              if (params.data && params.data.candidateId) {
                window.COOLUTIL.viewRecordPopupByType("CANDIDATE", params.data.candidateId);
              }
            },
        },
        {field: "candidateEmail", headerName: "Email"},
        {
            field: "contactName",
            headerName: "Contact Name",
            cellRenderer: (params) => <>{renderClickableField(params, params.data.contactName)}</>,
            onCellClicked: (params) => {
                if (params.data && params.data.contactRef) {
                    window.COOLUTIL.viewRecordPopupByType("CONTACT", params.data.contactRef);
                }
            },
        },
        {
            field: "jobCommissionValue",
            headerName: "Value",
            valueGetter: (params) => {
                const value = params.data.jobCommissionValue?.value;
                const currencyName = params.data.jobCommissionValue?.currency?.name;
                return `${value} ${currencyName}`;
            },
        },
        {field: "companyLabel", headerName: "Company"},
        {field: "jobTitle", headerName: "Job"},
        {
            field: "offerDate",
            headerName: "OfferDate",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.offerDate ? formatGlobalDate(params.data.offerDate) : "";
            },
        },
    ],
    PIPELINE_VALUE: [
        {
            field: "candidate._id",
            headerName: "Candidate",
            valueGetter: sysrecordCandidateGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data.candidate.label)}</>,
            onCellClicked: (params) => {
              if (params.data?.candidate?._id) {
                 window.COOLUTIL.viewRecordPopupByType("CANDIDATE",params.data.candidate._id);
              }
            },
        },
        {
            field: "company._id",
            headerName: "Company",
            valueGetter: sysrecordCompanyGetter,
            cellRenderer: (params) => <>{renderClickableField(params, params.data.company.label)}</>,
            onCellClicked: (params) => {
              if (params.data?.company?._id) {
                window.COOLUTIL.viewRecordPopupByType("COMPANY",params.data.company._id);
              }
            },
        },

        {field: "owner.label", headerName: "Owner"},

        {
            field: "createdOn",
            headerName: "Created Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
        {field: "status.name", headerName: "Pipeline Status"},
        {field: "state.name", headerName: "Pipeline SubStatus"},
        {
            field: "rejected",
            headerName: "Rejected Flag",
            valueGetter: (params) => {
                const rejected = params.data?.rejected;
                if (rejected) {
                    return params.data?.rejectInfo?.reason?.name || "";
                }
                return "";
            },
            cellRenderer: (params) => {
                const rejected = params.data?.rejected;
                const rejectionReason = params.data?.rejectInfo?.reason?.name || "";

                return (
                    <Flex direction="row" align="center" justify="start" gap="small">
                        <span>{rejectionReason}</span>
                        {rejected && <Tag color="red">Rejected</Tag>}
                    </Flex>
                );
            },
        },
    ],
    JOURNAL: [
        {field: "journalFrom.label", headerName: "User"},
        {
            field: "journalActivityLabel",
            headerName: "Activity Type",
            cellRenderer: function(params) {
                const { journalActivityLabel, journalActivityType } = params.data;

                if (!journalActivityLabel || !journalActivityType) {
                    return null;
                }


                const tagColor = journalActivityType === "SPECIFIC_TYPE" ? "default" : "success";

                return (
                  <Flex direction="row" align="center" justify="start" gap="small">
                      <span>{journalActivityLabel}</span>
                      <Tag color={tagColor}>{journalActivityType}</Tag>
                  </Flex>
                );
            }
        },


        {
            field: "journalMessage",
            headerName: "Message",
            valueGetter: (params) => {
                const message = params.data?.journalMessage || "";
                return message.replace(/<\/?[^>]+(>|$)/g, "");
            }
        },
        {
            field: "journalLinkedTo.label",
            headerName: "JournalLinked Records",
            valueGetter: (params) => {
                let journalLinkedTo = [];

                if (params.data.journalLinkedTo && params.data.journalLinkedTo.length > 0) {
                    params.data.journalLinkedTo.forEach((journalLinkedTos) => {
                        if (journalLinkedTos.type !== "USER" && journalLinkedTos.type !== "UNRECORDED") {
                            journalLinkedTo.push(journalLinkedTos.label);
                        }
                    });
                }

                return journalLinkedTo.join(", ") || "";
            },
            cellRenderer: (params) => {
                const journalLinkedTo = params.data.journalLinkedTo || [];

                const journalLinkedTosElements = journalLinkedTo.map((journalLinkedTos, index) => {
                    if (journalLinkedTos.type === "USER" || journalLinkedTos.type === "UNRECORDED") {
                        return <span key={index}>{journalLinkedTos.label}</span>;
                    }

                    return (
                      <span
                        key={index}
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => {
                            const candidateId = journalLinkedTos._id;
                            console.log("candidateId", candidateId);
                            if (candidateId) {
                                window.COOLUTIL.viewRecordPopupByType("CANDIDATE", candidateId);
                            }
                        }}
                      >
          {journalLinkedTos.label}
        </span>
                    );
                });


                return journalLinkedTosElements.length > 0
                  ? journalLinkedTosElements.reduce((prev, curr) => [prev, ", ", curr])
                  : null;
            },
        },
        {
            field: "journalDate",
            headerName: "Activity Date",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.journalDate ? formatGlobalDate(params.data.journalDate) : "";
            },
        },
    ],
    DEFAULT: [
        {field: "reference", headerName: "#REF"},
        {field: "name", headerName: "Record"},
        {field: "owner.label", headerName: "Owner"},
        {
            field: "createdOn",
            headerName: "Created At",
            type: "date",
            dateFormat: "dd/MM/yy",
            sort: "desc",
            sortedAt: 0,
            valueGetter: function (params) {
                return params.data.createdOn ? formatGlobalDate(params.data.createdOn) : "";
            },
        },
    ],
};
