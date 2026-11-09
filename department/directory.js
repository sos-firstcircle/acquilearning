// Team directory data. Edit here to add/remove people; the page builds itself.
// Person = [name, role?, note?]. Role defaults to "Acquisition Manager". "TBH" (to be hired) is left out.
// Source: org chart image from Sales Ops (Nov 2026).
const AM = "Acquisition Manager", SAM = "Senior Acquisition Manager", ACM = "Account Manager";
window.DEPT_DIRECTORY = {
  leadership: [
    ["Chris Burgess", "Chief Investments Officer"],
    ["Charles Allen", "Head of Operations"],
    ["Alan Smyth", "Head of Acquisition"]
  ],
  // Partnerships team (no team leader)
  partners: [
    ["Gabriel Cruz", "Partnerships Manager"],
    ["Mike Rg Rebadulla", "Partnerships Analyst", "", "sdr"]
  ],
  // Sales Ops BDMs (not under Michael)
  sosBdm: [
    ["Renzo Bayog", "BDM"],
    ["Boying Aviguetero", "BDM"]
  ],
  salesOps: [
    ["Michael Limandibrata", "Head of Sales Operations"],
    ["Ayrton Arteficio", "Sales Operations Manager"],
    ["Sophia Pesa", "Senior Sales Ops Analyst"],
    ["Hanna Jo", "Sales Ops Analyst"],
    ["Nice Junsay", "Sales Ops Analyst"],
    ["Reyster Barron", "Training Manager"]
  ],
  // Top Gun AMs, each with their SDR
  topGun: [
    { am: ["Patrick Suaco", "Top Gun AM"], sdr: ["Ver Magtoto", "SDR"] },
    { am: ["June Amarila", "Top Gun AM"], sdr: ["DJ Legaspi", "SDR"] }
  ],
  // Teams with a leader and members
  teams: [
    { name: "Justin Masilang", leader: ["Justin Masilang", "Team Leader"], columns: [
      { name: "Inbound", members: [
        ["Irene Isidro", SAM], ["James Bagayo", SAM], ["Chelsey Borja"], ["Micaella Soriano"], ["Sharleigh Pujanes"],
        ["Ri Galang"], ["Darell Velasquez"], ["Rose Alejandro"], ["Christian Paulino"], ["Shin Valencia"]
      ]},
      { name: "CLO Activation", members: [
        ["Lee Daz", SAM], ["Lay Sawadjan"], ["Jayson Decena"], ["Taro Chida"], ["JC Mores"],
        ["Federico Miralles Jr."], ["Ghirlie Cabalejo"], ["Benedict O'yek", AM, "", "new"]
      ]},
      { name: "Specialized Sales Team", members: [
        ["Bea Julongbayan"], ["Ronna Pantaleon"], ["AJ Angustia"], ["Bert Arriesgado"], ["Rutchelle Co-Untian"],
        ["Ed Manangan"], ["Ai Del Monte"], ["Aliza Copper"]
      ]}
    ]},
    { name: "ESBT 1", leader: ["Jad De Guzman", "Team Leader"], members: [
      ["Daren Bugat"], ["Mica Bongcarawan"], ["Joshua Aguirre"], ["Jobelle Gulam"], ["Charmaine Abubakar"],
      ["Mary Gallart"], ["Raymund Estebar", AM, "", "new"]
    ]},
    { name: "ESBT 2", leader: ["Jay Ann Perez", "Team Leader"], members: [
      ["JV Estrella"], ["Lester Beroy"], ["Ohmar Yumol"], ["Jan Carillo"]
    ]},
    { name: "EXBT 1", leader: ["Rox Colegio", "Team Leader"], members: [
      ["Dewi Acabado"], ["Jherrlyn Talwer"], ["Janica Astillas"], ["Jonalyn Pasaporte"],
      ["Catherine Barrios"], ["Ram Vonn Dela Cruz"], ["AJ Forcadilla"], ["Chris Casala"],
      ["Danielle Eniorga"], ["Lee Carl Acevedo"], ["Ralph Gabinete"], ["Milvin Bitara"], ["Mike Baluarte"], ["Jhoana Akut"]
    ]},
    { name: "EXBT 2", leader: ["Jad De Guzman", "Team Leader"], members: [
      ["Ann Latorre", SAM], ["Kevin Lopez", SAM], ["Jhe-ann Arrogante"], ["Sean Esplana"], ["John Mortel"],
      ["Leah Cañaberal"], ["Ruth Macalalad"], ["Aika Bernal"], ["GP Gotiangco"], ["Jelan Batas"], ["Caleb Adajar"],
      ["Ravy Manansala"], ["Mathew Landig"], ["Princess Regalario"], ["Pearl Sunga"]
    ]},
    { name: "EXBT 3", leader: ["Jay Ann Perez", "Team Leader"], members: [
      ["Yel Del Rosario", SAM], ["Danica San Juan", ACM], ["Lordwin Florendo"], ["Jessa Monroy"], ["Susan Unida"],
      ["Hazel McWilliam"], ["Aimee Sy"], ["Heiz Dela Cruz"], ["Dessa Lagramada"], ["Michelle Maitem"],
      ["Joseph Villarmino"], ["Ederle Mangondato"], ["Agnes Panopio"], ["Bernardo Adduru"], ["Gabriel Ballon"],
      ["Martin Diwa"], ["Patricia Rea Chano"]
    ]},
    { name: "EXBT 4", leader: ["Chuck Alvarez", "Team Leader"], members: [
      ["Barcy Castro"], ["Miggy Lukban", ACM], ["Michael Griño"], ["Loren Lopez"], ["Cell Dela Cruz"],
      ["Mary Gammad"], ["Jomic David"], ["DJ Amameo"], ["Rosanne Garcia"],
      ["Grace Belarmino"], ["Krismel Lat-Mallare"], ["Jhanna Morales"], ["Mary Ann Mendoza"], ["Jenny Longos"],
      ["Joanne Karen Rico"]
    ]},
    { name: "EXBT 5", leader: ["Brian De Torres", "Team Leader"], members: [
      ["Joy Custodio"], ["Keith Santiago"], ["Shena Rivera"], ["Leslie De Los Angeles"],
      ["Shenan Tominez"], ["Marites Cuario"], ["Marianne Javier"], ["Lovely Castro"],
      ["Rachel Bolaños"], ["Joana Jayme"], ["Cristina Articona"]
    ]},
    { name: "EXBT 6", leader: ["Aly Abetria", "Team Leader"], members: [
      ["Leslie Joy Roxas"], ["Alvin Tristan Lupisan"], ["Jessica Valdrez"], ["Roxeal Marzo-Urate"],
      ["Sophia Andrea Bravo"], ["Gavin Soria"], ["DJ Narag"], ["Jay-Jay Silpedes"], ["Lorraine Carlos"],
      ["Maybelle Catibog"], ["Azella Zaragoza"]
    ]},
    { name: "EXBT 7", leader: ["Leslie Ann Reyes", "Team Leader"], members: [
      ["Elaine Fantolgo"], ["Jeeboy Fababier"], ["Gilbert Lu"], ["Jeremiah David Veloria", AM, "", "new"], ["Alyssa Clarisse Moncada", AM, "", "new"]
    ]},
    { name: "EMBT 1", leader: ["Klang Sarrate", "Team Leader"], members: [
      ["Mel Martinez"], ["Jacky Fabiosa"], ["Melanie Lucenas"], ["Zoe Cortez"], ["Abegail Melegrito"],
      ["Reissie Suba"], ["Ariza Tanchiu"], ["Yvee Biscara"], ["Mhona Brotonel"], ["Matthew Nalos"],
      ["Kristhine Maglana"], ["Andrea Buenafe"]
    ]},
    { name: "EMBT 2", leader: ["Jico De Dios", "Team Leader"], members: [
      ["Laalaa Bonifacio"], ["Mico Escañan", ACM], ["Jefferson Pinca"], ["Cheng Brusola"], 
      ["Daniel Yabut"], ["Mark Santos"], ["Melinda Marientes"],
      ["Aprille Rose Sugatan"], ["Ian Dabalos"], ["Andrew Sunga"], ["Brylle Kent Bahia"], ["Alexander Painaga", AM, "", "new"], ["Renell Gatchalian", AM, "", "new"]
    ]},
    { name: "EMBT 3", leader: ["Chot Camacho", "Team Leader"], members: [
      ["Joanne Diaz"], ["Arlene Espenocilla", ACM], ["Rasmiah Serrano"], ["Annette de Leon"],
      ["Vince Jose"], ["Enrico Cabrera"], ["Rafael Crisostomo"], ["Kat Bañas"], ["Hyasmin Joy Lascano", AM, "", "new"]
    ]},
    { name: "Region Team 1", leader: ["Blue Aldridge", "Team Leader"], members: [
      ["Ryan Pene", AM, "Davao"], ["Jack Francisco", AM, "Central & North Luzon"], ["Ronell Macanip", AM, "Central & North Luzon"],
      ["Kenjiva Quiano", AM, "South Luzon"], ["Paolo Martinez", AM, "South Luzon"], 
      ["Romeo Galang"], ["Riz Sorillo"], ["Jerome Limas"], ["Weng Bumanglag"], ["Kell Mina"], ["Mariel Rivera"],
      ["Lorelee Pinzon"], ["Angelique Gutierrez"], ["Buena Bulosan"], ["Ralph Maru Aniciete", AM, "", "new"], ["Melissa Ligeralde", AM, "", "new"]
    ]},
    { name: "Region Team 2", leader: ["Charles Gito", "Team Leader"], members: [
      ["Jome Luzon", AM, "Cebu"], ["Paolo Pogoy", AM, "Cebu"], ["Xyzel Cuento", AM, "Cebu"],
      ["Jason Junsan", AM, "West Visayas"], ["Ivy Completo"], ["Ronaldo Monserate Jr."], ["Cherry Alvarado"],
      ["Jaime Rafael Bayoneta"], ["Giovanni Capawa"], ["Jazon Pulmano", AM, "", "new"]
    ]}
  ]
};
