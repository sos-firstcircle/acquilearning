/* Product Knowledge Exam 2 (not on a day yet). Edit the questions here; the page is exams/product-knowledge-2.html.
   Same question types and scoring as exam 1 (see product-knowledge-1-questions.js):
     single / tf: 1 point. multi (tick all): 0.5 for each right item ticked, minus 0.5 for each wrong item ticked (never below 0),
     so the question is worth 0.5 x the number of right items. answer = index (single/tf) or array of indices (multi).
   why = the feedback shown after the exam. whyWrong (optional) = shown instead of why when the answer is wrong. */
window.LMS_PK2 = {
  id: "exam-product-knowledge-2",
  title: "Product Knowledge Examination 2",
  passing: 75,
  sections: [
    { title: "First Circle Business Credit Line: Product & Features",
      desc: "Aside from the product features, do you really know what the product is and how it works within the company?",
      questions: [
        { type:"single", q:"What's a secured loan?", options:[
            "A loan that requires no collateral for high purchase of property or equipment",
            "A loan that you can borrow at a certain limit, repay and borrow again",
            "A loan that requires collateral and usually with lower interest"], answer:2,
          why:"You're right! A secured loan requires collateral and usually at a lower interest" },
        { type:"single", q:"Your client got granted a credit limit with a 1.39% interest rate. They want to do a bi-weekly (2x a month) repayment scheme. What would be their new monthly interest rate?", options:["1.29%","0.99%","1.39%"], answer:0,
          why:"Correct! 1.29% is the new interest rate since we give 0.1% discount since we get the payment faster." },
        { type:"single", q:"What is the processing fee of a ₱5,000,000 revolving credit line?", options:["₱199,500","₱69,500","₱99,500"], answer:2,
          why:"Correct! 5M x 1.99% is equal to Php 99,500 which is the processing fee amount." },
        { type:"single", q:"Your client just got granted a credit line and wants to drawdown. You need to ask them what's their preferred convenience fee. What's the best pitch to them knowing they want to utilize their credit line more than 3-4 times a year?", options:[
            "\"I recommend the annual subscription fee as it's the cheaper option vs. the processing fee if you only plan on using it once a year.\"",
            "\"I recommend the processing fee since a one-time fee due 10 days after your drawdown will make it easier to repay.\"",
            "\"I recommend the processing fee as it's the cheaper option vs. the subscription fee if you only plan on using it once a year.\""], answer:0,
          why:"Correct! Its best to recommend in this scenario that Annual Subscription Fee if they are sure to use it 3-4 times a year since its cheaper than opting for processing fee." },
        { type:"single", q:"Your client is under Medium+ tier, are they eligible for a discount?", options:["Yes after 2 months","No","Yes after 1 month"], answer:1,
          why:"Correct! Medium+ customers are not eligible to give pricing discounts!" },
        { type:"single", q:"What's the lowest interest rate First Circle can offer?", options:["0.99%","0.79%","0.69%"], answer:1,
          why:"Nice one! The lowest rate we can offer is 0.79% subject to assessment" },
        { type:"single", q:"Your client wants to use their BCL. They want a 3-month term loan but only wants to pay the entire principal and interest at the end of the loan (which is the end of the 3rd month). Is this possible?", options:[
            "Yes, it's possible since we there's an option for bullet repayment, where clients can withhold paying anything for at most 4 months.",
            "No, since we have Express Business Loan",
            "Yes, since we allow up to maximum of 3 months"], answer:2,
          why:"Nice one! The bullet repayment frequency is only 3 months max. It can't go past 3." },
        { type:"single", q:"Your client is granted a P5M credit line with a rate of 1.99%. They asked you they want to use their credit line but would like to do a bullet repayment. What would be the updated interest rate?", options:[
            "There's an additional 1%, where the new rate is 2.39%.",
            "There's an additional 1%, where the new rate is 2.99%.",
            "Rate remains the same at 1.99%. There's no discount or additional rate."], answer:1,
          why:"Yeahh, there's an additional 1% to the monthly interest rate if the client avails of a bullet repayment because it's riskier for us. Imagine, we're not getting any money up until the end of the loan term." },
        { type:"single", q:"Which type of credit line will the client choose if they are planning to repay for 13 months?", options:["Business Credit Line","Business Credit Plus","Express Business Loan"], answer:1,
          why:"Yes, it's the BCP that allows a business to get up to maximum 24 months." },
        { type:"single", q:"Your client interest rate approved is 0.79%, what will be their EBL convenience fee rate?", options:["1%","2%","0.79%"], answer:2,
          why:"Correct! 0.79% will be their one time fee for EBL.",
          whyWrong:"Incorrect! 0.79% will be their one time fee for EBL." },
        { type:"tf", q:"Your client got granted a P6M credit line. They used P4.5M of their line. Based on the principal paydown policy, is their credit limit locked?", options:["Yes","No"], answer:0,
          why:"Nice one! Their credit limit is locked already since utilization is at 75% already." },
        { type:"single", q:"What is the max calendar days a client can reschedule their due date?", options:["10 days","3 days","30 days"], answer:2,
          why:"Correct! We can only accommodate up to max period of 30 calendar days." },
        { type:"single", q:"You're at a medical and health convention. You get to speak with a start-up founder who supplies medical equipment to St. Lukes, Government Hospitals and Corp business around Manila . He's only been operating for 3 months but already has ₱5M annual sales. Are they qualified for First Circle's revolving credit line?", options:[
            "No, since his business is operating less than 1 year",
            "No, since his revenue is below 25M!",
            "Yes, since his business is operating at least 3 months!"], answer:2,
          why:"B2B businesses need to have been operating a least 3 months." },
        { type:"single", q:"Can we proceed with B2B assessment if client submits unpaid invoices  of their Sole Prop clients as proof of future revenue?", options:[
            "Yes, so long as the invoices are signed by their client.",
            "No, they should submit Corporations, Cooperatives or Government Unpaid Invoices.",
            "No, they should just submit Official Receipts"], answer:1,
          why:"Correct! Unpaid invoices should be from their Corp, Cooperatives or Government clients to proceed with B2B assessment, hence they will be considered as B2C if they can't provide." },
        { type:"multi", q:"Please select the requirements B2B corporate applicants need to submit to apply for a revolving credit line and maximize its credit limit.", options:["Latest DTI Certificate","Signed Secretary's Certificate","SEC Certificate of Registration","Latest General Information Sheet","Latest Audited Financial Statements","BIR 2303","Latest Income Tax Return","Articles of Incorporation","Latest 3-6 month bank statements","Future Revenue","Trading Relationship","Updated Valid ID","Latest Articles of Partnership"], answer:[1,2,3,4,7,8,9,10,11],
          why:"Niceee! Good thing you memorized it." },
        { type:"multi", q:"Please select the requirements B2C Sole Proprietor applicants need to submit to apply for a revolving credit line and maximize its credit limit.", options:["Latest DTI Certificate","Signed Secretary's Certificate","SEC Certificate of Registration","Latest General Information Sheet","Latest Audited Financial Statements","BIR 2303","Latest Income Tax Return","Articles of Incorporation","Latest 3-6 month bank statements","Future Revenue","Trading Relationship","Updated Valid ID","Latest Articles of Partnership"], answer:[0,6,8,11],
          why:"Niceee! Good thing you memorized it." }
      ] },
    { title: "First Circle Banking Account",
      desc: "How does our BA work?",
      questions: [
        { type:"single", q:"Is our BA PDIC insured?", options:["No, it's not since we're not a bank.","Yes, it's insured up to P500k.","Yes, it's insured up to P1M."], answer:2,
          why:"It's insured up to P1M!" },
        { type:"single", q:"How can batch transfers help with payroll?", options:[
            "Since it allows users to pay multiple bank accounts/e-wallets all at once, businesses can use this for payroll as well.",
            "No, the batch transfer feature can't help with payroll since it can only schedule transfers.",
            "BA doesn't have a batch transfer feature."], answer:0,
          why:"Yes, correct! Since batch transfers can help pay multiple bank accounts all at once, they can use it for payroll too." },
        { type:"tf", q:"The QR code from BA charges 2% fee from their customer.", options:["True","False"], answer:1,
          why:"QR code is free to use!" },
        { type:"tf", q:"A sole prop is eligible for BA if they're not registered with the BIR but registered with the DTI.", options:["True","False"], answer:1,
          why:"Sole props are required to be BIR and DTI-registered businesses." },
        { type:"single", q:"What's the maintaining balance required for a business to continuously be able to use their BA account?", options:[
            "There should be an average of at least P50k on a daily basis.",
            "There should be an average of at least P100k on a daily basis.",
            "It's 10% of the daily transaction volume.",
            "There's no maintaining balance that needs to be met to continue using BA."], answer:3,
          why:"Yess! It's free (for now) to use BA. Businesses just need to submit the required documents." }
      ] },
    { title: "Future Salary Advance (FSA)",
      desc: "How well do you know FSA?",
      questions: [
        { type:"single", q:"Your client has 20 employees but 10 of them are less than 3 months. Are they eligible for FSA?", options:[
            "Yes, since they have 20 employees",
            "No, since not all 20 employees are more than 3 months employed"], answer:1, why:"" },
        { type:"tf", q:"The employee requested Asenso Advance, First Circle will then disburse it to his/her bank account.", options:["True","False"], answer:1,
          why:"Correct! We will not disburse it directly to the employee if they opt for Asenso Advance, it will be disburse directly to the institution (e.g school, hospital)" },
        { type:"tf", q:"FSA only charges a 5% monthly interest rate.", options:["True","False"], answer:1,
          why:"FSA only charges a one-time convenience fee! There's no monthly payments." },
        { type:"single", q:"Whats the maximum grace period we allow after payroll due date?", options:[
            "5 business days after the payroll date.","10 business days after the payroll date.","No, we don't allow any grace period"], answer:0,
          why:"We allow up to maximum of 5 business days to remit their employee's repayment due." },
        { type:"tf", q:"First Circle will go directly to the employer once the employee goes AWOL and charge to them remaining balance", options:["False","True"], answer:0,
          why:"Employers are not a guarantor and has no liability" }
      ] }
  ]
};
