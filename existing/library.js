/* Library for EXISTING AMs (batch 000002): an info dump of reading links. Edit only this file to add/remove items.
   Each group: { title, items: [{ label, href, note?, dl? }] }. External links open in a new tab; dl:true = file in downloads/. */
const LIBRARY_GROUPS = [
  { title: "Product Knowledge Notion Links", items: [
    { label: "AM Success Playbook", href: "https://app.notion.com/p/27f1a5890448807ba169ede63f57759f?pvs=25" },
    { label: "Financing Industry Knowledge", href: "https://app.notion.com/p/4c1a1bffafa742e3bdcce84efaec3008?pvs=25" },
    { label: "Business Credit Line (BCL)", href: "https://www.notion.so/firstcircle/Sales-First-Circle-Credit-Line-Guide-47237af4d0bb424a89cbf48cfcbd5ffc" },
    { label: "Banking Account (BA)", href: "https://www.notion.so/firstcircle/Sales-Smart-Banking-Account-Guide-2991a58904488098be8df6391ff70a64" },
    { label: "Future Salary Advance (FSA)", href: "https://www.notion.so/firstcircle/Sales-Smart-Salary-Advance-Guide-2981a5890448803390b8e00d71939164" },
    { label: "First Circle Requirements List", href: "https://app.notion.com/p/28e1a5890448805281a5c5d7b7d85f27?pvs=25" }
  ]},
  { title: "First Circle General Notion Links", items: [
    { label: "Acquisition @ First Circle", href: "https://app.notion.com/p/firstcircle/Acquisition-First-Circle-87df90fc3c9d48c7984f1dfcd3d76047" },
    { label: "First Circle Home (Notion)", href: "https://app.notion.com/p/firstcircle/First-Circle-Home-911987b5def34044a7faa5ee3703e69c" },
    { label: "Transportation to and from client meetings", href: "https://app.notion.com/p/firstcircle/Transportation-to-and-from-Client-Meetings-44fb796bbb28458b90128ce1866ddcef" },
    { label: "Employee expenses reimbursements policy", href: "https://app.notion.com/p/firstcircle/Employee-Expenses-Reimbursements-Policy-d4836ab53ea8439493a3c3adf1e77c6e" },
    { label: "Macbook Basics", href: "lessons/d01-mac-basics.html" }
  ]},
  { title: "Outbound Prospecting", items: [
    { label: "ACQ Platform-based Selling: Outbound Prospecting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Platform-based-Selling-Outbound-Prospecting-1d51a5890448805f85dbefb7ea8e670c" },
    { label: "Communication Standards and Tone Guide (Notion)", href: "https://app.notion.com/p/firstcircle/Communication-Standards-Tone-Guide-34c1a5890448800492bbfe0f0be693a4" },
    { label: "Sample prospecting call recording 1", href: "https://drive.google.com/file/d/1Etn1hi9PjyG5qiHI8RoQEn7Jft0N8RD2/view" },
    { label: "Sample prospecting call recording 2", href: "https://drive.google.com/file/d/1s-Di2naBvmqtXjXAUDyGR61Qli3e0dTh/view" }
  ]},
  { title: "Discovery Call", items: [
    { label: "ACQ Sales Training: Multi-Product Discovery Call / Meeting (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Sales-Training-Multi-Product-Discovery-Call-Meeting-2131a589044880d7b92adb7e64a56961" },
    { label: "Discovery call pitch deck (Google Slides)", href: "https://docs.google.com/presentation/d/1aEyNDbc8AiiPaNOx96u0NQmo-bPoTtdOJN0bv87wcRA/edit?slide=id.g31bf3e9912e_0_226#slide=id.g31bf3e9912e_0_226" }
  ]},
  { title: "Finding Decision Makers", items: [
    { label: "Prospecting Manual: Online Scraping for Decision Makers / Key Persons (Notion)", href: "https://app.notion.com/p/firstcircle/ACQ-Prospecting-Manual-Online-Scraping-for-Decision-Makers-Key-Persons-32c1a5890448800b8e84cf5b72c0d42d" },
    { label: "Apollo / Lusha learning video", href: "https://drive.google.com/file/d/161yMqlzwdXn8Vxl7-i5Ak4gEurBryub4/view" }
  ]},
  { title: "Connect Notion Links", items: [
    { label: "Add a new team member", href: "https://www.notion.so/firstcircle/Teams-2001a5890448806abaa9c51315a15579" },
    { label: "Add bank accounts (Contacts)", href: "https://www.notion.so/firstcircle/Contact-2001a589044880c08e32ddeca52117b8?pvs=25" },
    { label: "Top up the wallet (Deposits)", href: "https://www.notion.so/firstcircle/Deposits-2001a5890448806c82e6c36e99011fc7" },
    { label: "Transfer funds (Transfers)", href: "https://www.notion.so/firstcircle/Transfers-2001a5890448800b998cea9f027f8d8c" },
    { label: "Use the credit line (Drawdown)", href: "https://www.notion.so/firstcircle/Drawdown-2001a58904488098aed9e8b9f6cc47ce" }
  ]},
  { title: "Document Upload Notion Links", items: [
    { label: "How to review onboarding documents", href: "https://app.notion.com/p/firstcircle/How-to-Review-Onboarding-Documents-404df9ae1e7e4943b5bca9e0efcc8f0b" },
    { label: "How to submit onboarding documents for review", href: "https://app.notion.com/p/firstcircle/How-to-Submit-Onboarding-Documents-for-Review-2831a5890448808d948bfbdb508d28e6" }
  ]}
];
