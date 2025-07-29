// Artifact Magic Tech - Data Configuration
// This file contains all the artifact data and configuration

const ARTIFACT_DATA = {
  choices: [
    "ORG", "PSB", "ACCT", "AMR", "RDM",
    "1", "2", "3", "4", "5", "6", "7", "8",
    "9", "10", "11", "12", "13", "14", "15", "16",
    "17", "18", "19", "20", "21", "22",
    "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32"
  ],

  artifacts: [
    { 
      name: "01 - Program Summary Data", 
      description: "For each program, provide the following in one Excel file:<br> - Integrated Master Plan (IMP) on Contract? (Yes / No) <br>- # of IMP Codes - Freeze Period (i.e. 60 days) <br>- Number of Work Packages (WP) <br>- Number of Control Accounts (CA)", 
      elements: ["3", "8", "9", "10", "27", "29", "ORG", "PSB", "AMR", "RDM"]
    },
    { 
      name: "02 - Accounting Fiscal Calendar", 
      description: "Fiscal Calendar Used (include all accounting periods from beginning of program until program completion)", 
      elements: ["3", "8", "9", "10", "27", "29", "ORG", "PSB", "AMR", "RDM"]
    },
    { 
      name: "03 - EVM System Description", 
      description: "System Descriptions, corporate operating instructions, standard operating procedures, and program unique directives/procedures. (Include the latest approved versions)", 
      elements: ["1", "3", "4", "6", "7", "10", "12", "14", "21", "23", "27", "28", "29", "ORG", "PSB", "ACCT", "AMR", "RDM"]
    },
    { 
      name: "04 - Contract Statement of Work", 
      description: "Contract Statement  of Work", 
      elements: ["1", "6", "12", "ORG", "PSB"]
    },
    { 
      name: "05 - Contract Work Breakdown Structure Dictionary", 
      description: "Contract Work Breakdown Structure Dictionary. Include reference ID to the SOW.", 
      elements: ["1", "12", "ORG", "PSB"]
    },
    { 
      name: "06 - Contractual Documents", 
      description: "Initial contract, and contract modifications since program inception, e.g., contract modification, letter to proceed from contracts office or legal office, not-to-exceed letter, change order, engineering change order, delivery order, basic ordering agreement, etc.<br>- Comprehensive list by date, dollar value, funding and changes to the contract target cost. <br>- Electronic copies of all contract mods for the last 12 months.", 
      elements: ["1", "2", "6", "14", "20", "27", "28", "31", "ORG", "PSB", "AMR", "RDM"]
    },
    { 
      name: "Quantum Superposition Lens", 
      description: "View and manipulate alternate timelines", 
      elements: ["Time", "Knowledge", "Creation"] 
    }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARTIFACT_DATA;
}