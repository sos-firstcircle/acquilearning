/* Product Knowledge Exam 1 (Day 3). Edit the questions here; the page is exams/product-knowledge-1.html.
   Points: every question is worth 1 unless it has `points`.
   Question types:
     single  options[], answer = index of the right option (options are shuffled for each attempt)
     tf      True/False, answer = 0 (True) or 1 (False); not shuffled
     text    typed answer. fmt:"peso" shows a ₱ sign and commas as you type; fmt:"plain" is digits only. answer = the digits to match (e.g. "199500" accepts P199,500 / 199500 / ₱199,500)
     multi   tick all that apply, options[], answer = array of right indices (all-or-nothing)
   multi scoring: 0.5 for each right item ticked, minus 0.5 for each wrong item ticked (never below 0). The question is worth
     0.5 x the number of right items.
   answer: null = key not confirmed yet. That question is shown but NOT scored (and not counted in the total).
   why = shown after the exam. */
window.LMS_PK1 = {
  id: "d3-exam-product-knowledge-1",
  title: "Product Knowledge Examination 1",
  passing: 75,
  sections: [
    { title: "First Circle Business Credit Line: Product & Features",
      desc: "Aside from the product features, do you really know what the product is and how it works within the company?",
      questions: [
        { type:"single", q:"What's a revolving credit line?", options:[
            "A one-time loan where you borrow a fixed amount and repay it in equal installments.",
            "A credit facility that lets businesses borrow, repay, and borrow again up to a set limit, as long as they repay on time.",
            "A one-time short-term loan where only interest is paid monthly, and the principal is due at the end of the term."], answer:1,
          why:"A revolving credit line (like First Circle's BCL) lets SMEs withdraw, repay, and withdraw again up to their approved limit, similar to a credit card but designed for businesses. Term loans are usually one-time." },
        { type:"single", q:"Your client got granted a credit limit with a 0.79% interest rate. They want to do a bi-weekly (2x a month) repayment scheme. What would be their new monthly interest rate?", options:["0.69%","0.79%","1.99%"], answer:1,
          why:"The rate stays at 0.79%. Choosing a bi-weekly repayment scheme doesn't change the monthly interest rate." },
        { type:"text", q:"What is the annual subscription fee of a ₱5,000,000 revolving credit line? Type the amount in pesos (ex: ₱87,500)", answer:"199500", fmt:"peso",
          why:"The annual subscription fee of a ₱5,000,000 line is P199,500." },
        { type:"single", q:"Your client just got granted a credit line and wants to drawdown. You need to ask them what's their preferred convenience fee. What's the best pitch to them knowing they only want to utilize their credit line once a year?", options:[
            "\"I recommend the annual subscription fee as it's the cheaper option vs. the processing fee if you only plan on using it once a year.\"",
            "\"I recommend the processing fee since a one-time fee due 10 days after your drawdown will make it easier to repay.\"",
            "\"I recommend the processing fee as it's the cheaper option vs. the subscription fee if you only plan on using it once a year.\""], answer:2,
          why:"If the borrower only wants to use the line once or twice a year, the processing fee saves them more. If they plan to use it more than 3 times a year, the subscription fee saves more." },
        { type:"single", q:"When is a client eligible for an interest discount?", options:[
            "1 month after disbursement of their first loan.","1 month after their credit line gets approved.","2 months after their credit line gets approved."], answer:2,
          why:"A client is only eligible for a discount 2 months after the credit line gets approved." },
        { type:"single", q:"What's the maximum term of First Circle's credit line?", options:["12 months","24 months","There is no maximum term, only a minimum term."], answer:1,
          why:"The longest term is 24 months, under the Business Credit Plus." },
        { type:"single", q:"Your client wants to use their BCL. They want a 4-month term loan but only wants to pay the entire principal and interest at the end of the loan (which is the end of the 4th month). Is this possible?", options:[
            "Yes, it's possible since there's an option for bullet repayment, where clients can withhold paying anything for at most 4 months.",
            "No, it's not possible because bullet repayment only extends 3 months max.",
            "No, you can only repay First Circle either every 2 weeks or every month. It's not possible to withhold payments past 1 month."], answer:1,
          why:"Bullet repayment is only 3 months max. It can't go past 3." },
        { type:"single", q:"Your client is granted a P5M credit line with a rate of 1.39%. They asked you they want to use their credit line but would like to do a bullet repayment. What would be the updated interest rate?", options:[
            "There's an additional 1%, where the new rate is 2.39%.",
            "There's a 1% discount since they'll repay in one go. So the new rate is 0.39%.",
            "Rate remains the same at 1.39%. There's no discount or additional rate."], answer:0,
          why:"Bullet repayment adds 1% to the monthly interest rate because it's riskier for us: we receive nothing until the end of the loan term." },
        { type:"single", q:"Which type of credit line enables you to do a 1-month only term with an all-in-1 fee?", options:["Business Credit Line","Business Credit Plus","Express Business Loan"], answer:2,
          why:"The Express Business Loan gives a 1-month term with an all-in-1 price." },
        { type:"single", q:"If the annual revenue of a business is around P62M, what would be the estimated credit line value?", options:["P10M","P5M","P6M"], answer:1,
          why:"The estimated credit line is P5M. Note that it's only an estimate, not the actual value." },
        { type:"tf", q:"Your client got granted a P7.5M credit line. They used P5.5M of their line. Based on the principal paydown policy, is their credit limit locked?", options:["Yes","No"], answer:1,
          why:"Not locked yet. Utilization is about 73% (P5.5M of P7.5M), below the 75% mark." },
        { type:"single", q:"It's 2 days before the due date of the client's loan. Can they still reschedule?", options:[
            "Yes, since we can accommodate up until 1 day before the due date.",
            "Yes, since we can accommodate up until 2 days before the due date.",
            "No, since we can only accommodate up until 3 days before the due date."], answer:1,
          why:"We can reschedule loans up to 2 days before the due date. Anything later, we can't." },
        { type:"single", q:"You're at a medical and health convention. You get to speak with a start-up founder who sells glucose meters (a device used to measure blood sugar) through his physical store in Robinsons Cainta. He's only been operating for 3 months and only sells direct-to-consumer, but already has ₱30M in sales. Are they qualified for First Circle's revolving credit line?", options:[
            "It depends on whether the business is a corp or a sole prop.",
            "Yes, as he's already reached more than ₱25M in revenue!",
            "No, since B2C businesses need to be operating for more than 1 year."], answer:2,
          why:"B2C businesses need to have been operating for more than 1 year." },
        { type:"single", q:"Can clients submit paid invoices as proof of future revenue?", options:[
            "Yes, so long as the invoices are signed by their client.",
            "No, they can submit fulfilled purchase orders instead.",
            "No, paid invoices aren't valid since they've been paid already."], answer:2,
          why:"Paid invoices aren't valid because they've already been paid. They are no longer proof of future income." },
        { type:"multi", q:"Please select the requirements B2B corporate applicants need to submit to apply for a revolving credit line and maximize its credit limit.",
          options:["Latest DTI Certificate","Secretary's Certificate","SEC Certificate of Registration","Latest General Information Sheet","Latest Audited Financial Statements","BIR 2303","Latest Income Tax Return","Articles of Incorporation","Latest 3-6 month bank statements","Future Revenue","Trading Relationship","Updated Valid ID","Latest Articles of Partnership"],
          answer:[1,2,3,4,7,8,9,10,11],
          why:"Corporate applicants submit: Secretary's Certificate, SEC Certificate of Registration, Latest General Information Sheet, Latest Audited Financial Statements, Articles of Incorporation, Latest 3-6 month bank statements, Future Revenue, Trading Relationship and an Updated Valid ID. Best to memorize this, since you can meet a lead at an event or social gathering." },
        { type:"multi", q:"Please select the requirements B2B sole proprietor applicants need to submit to apply for a revolving credit line and maximize its credit limit.",
          options:["Latest DTI Certificate","Secretary's Certificate","SEC Certificate of Registration","Latest General Information Sheet","Latest Audited Financial Statements","BIR 2303","Latest Income Tax Return","Articles of Incorporation","Latest 3-6 month bank statements","Future Revenue","Trading Relationship","Updated Valid ID","Latest Articles of Partnership"],
          answer:[0,5,6,8,9,10,11],
          why:"Sole proprietors submit: Latest DTI Certificate, BIR 2303 (BIR COR), Latest Income Tax Return, Latest 3-6 month bank statements, Future Revenue, Trading Relationship and an Updated Valid ID." }
      ] },
    { title: "First Circle Banking Account",
      desc: "How does our BA work?",
      questions: [
        { type:"single", q:"Is our BA PDIC insured?", options:["No, it's not since we're not a bank.","Yes, it's insured up to P500k.","Yes, it's insured up to P1M."], answer:2,
          why:"It's insured up to P1M." },
        { type:"single", q:"How can batch transfers help with payroll?", options:[
            "Since it allows users to pay multiple bank accounts/e-wallets all at once, businesses can use this for payroll as well.",
            "No, the batch transfer feature can't help with payroll since it can only schedule transfers.",
            "SBA doesn't have a batch transfer feature."], answer:0,
          why:"Batch transfers pay multiple bank accounts all at once, so businesses can use them for payroll too." },
        { type:"tf", q:"The QR code from BA is not free to use, only the basic online transfer is free.", options:["True","False"], answer:1,
          why:"The QR code is free to use." },
        { type:"tf", q:"A sole prop is eligible for BA if they're not registered with the BIR but registered with the DTI.", options:["True","False"], answer:1,
          why:"Sole props are required to be both BIR and DTI-registered." },
        { type:"single", q:"What's the maintaining balance required for a business to continuously be able to use their BA account?", options:[
            "There should be an average of at least P50k on a daily basis.",
            "There should be an average of at least P100k on a daily basis.",
            "It's 10% of the daily transaction volume.",
            "There's no maintaining balance that needs to be met to continue using SBA."], answer:3,
          why:"It's free (for now) to use SBA. Businesses just need to submit the required documents." }
      ] },
    { title: "Future Salary Advance (FSA)",
      desc: "How well do you know FSA?",
      questions: [
        { type:"text", q:"What's the minimum number of employees a business must have to be eligible for FSA? Write only the number (ex: 10).", answer:"20", fmt:"plain",
          why:"A business needs at least 20 employees to be eligible for FSA." },
        { type:"tf", q:"Flexible Salary Advance is cheaper than Asenso Advance.", options:["True","False"], answer:1,
          why:"Asenso Advance is cheaper than Flexible Salary Advance." },
        { type:"tf", q:"FSA only charges a monthly interest fee.", options:["True","False"], answer:1,
          why:"FSA only charges a one-time convenience fee. There are no monthly payments." },
        { type:"single", q:"When do we issue the SOA that contains the amount the business needs to repay to us?", options:[
            "5 days before the payroll date.","10 days before the payroll date.","On the payroll date."], answer:1,
          why:"We send the SOA 10 days before the payroll date." },
        { type:"single", q:"What's the overdue penalty cost incurred by the employers?", options:[
            "2% per week of the current SOA balance.","2% per month of the SOA balance at the last day of the month.","2% per week of the base salaries of the borrowers."], answer:0,
          why:"When the employer doesn't remit the payment on time, they incur an additional 2% per week of the outstanding SOA balance." }
      ] }
  ]
};
