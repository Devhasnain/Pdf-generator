const { Router } = require("express");
const PDFdocument = require("pdfkit");
const fs = require("fs");

const route = Router();

let tableHeaders = [
  "Date",
  "Unit",
  "Rate",
  "Amount",
  "Date",
  "Unit",
  "Rate",
  "Amount",
];

let tablefooter = [
  "Total",
  "6999",
  "",
  "13532135",
  "",
  "13423",
  "",
  "12341234",
];

const setHeader = ({ title1, title2, doc }) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("Soft", 60, 15, { align: "center" });
  doc.lineWidth(2).moveTo(20, 35).lineTo(590, 35).stroke();
  doc.rect(20, 36, 250, 25).fill("#d9d8d4");
  doc.rect(590 - 250, 36, 250, 25).fill("#d9d8d4");
  doc.font("Helvetica").fontSize(12).fillColor("black");
  doc.fillColor("black").text(title1, -350, 44, { align: "center" });
  doc.fillColor("black").fontSize(10).text(title2, 350, 44, { width: "100%" });
};

const setTableHeader = ({ doc, tab1Text, tab2Text, tab3Text }) => {
  // boxes
  doc.rect(20, 70, 270, 25).fill("#d9d8d4");
  doc.rect(590 - 270, 70, 270, 25).fill("#d9d8d4");

  // boxes text
  doc.font("Helvetica").fontSize(12).fillColor("black");
  doc.text(tab1Text, -240, 78, { align: "center" });
  doc.text(tab2Text, 360, 78, { align: "center" });

  // line
  doc.lineWidth(2).moveTo(20, 125).lineTo(590, 125).stroke();

  // table head
  let headerPosX = 20;

  let heading = doc.font("Helvetica").fontSize(12).fillColor("black");
  let headingOptions = {
    align: "start",
    link: "",
    underline: true,
  };

  tableHeaders.forEach((item, index) => {
    if (index === 0) {
      heading.text(item, 20, 110, headingOptions);
    } else if (index === tableHeaders.length - 1) {
      heading.text(item, 540, 110);
    } else {
      heading.text(item, (headerPosX += 75), 110, headingOptions);
    }
  });

  doc.rect(20, 140, 250, 20).fill("#d9d8d4");

  doc
    .fillColor("black")
    .fontSize(10)
    .text(tab3Text, 25, 147, { align: "start" });
};

const setTableBody = ({ doc, data }) => {
  let y = 175;

  data.forEach((item, index) => {
    let headerPosX = 20;
    item.forEach((ele) => {
      doc.text(ele, headerPosX, y);
      headerPosX += 75;
    });
    y += 15;
  });
};

const setTableFooter = ({ doc, grossAmount, brokerage, saudaNetAmt }) => {
  doc
    .lineWidth(1)
    .moveTo(20, doc.page.height - 165)
    .lineTo(590, doc.page.height - 165)
    .stroke();

  let footerHeadingPx = 20;

  tablefooter.forEach((item, index) => {
    if (index === 0) {
      doc.fillColor("black").text(item, 20, doc.page.height - 160);
    } else if (index === tableHeaders.length - 1) {
      doc.fillColor("black").text(item, 540, doc.page.height - 160);
    } else {
      doc
        .fillColor("black")
        .text(item, (footerHeadingPx += 75), doc.page.height - 160);
    }
  });

  doc
    .lineWidth(2)
    .moveTo(20, doc.page.height - 145)
    .lineTo(590, doc.page.height - 145)
    .stroke();

  doc.fillColor("black").text(grossAmount.title, 380, doc.page.height - 130);
  doc
    .fillColor("blue")
    .text(grossAmount.amount, 100, doc.page.height - 130, { align: "right" });

  doc.fillColor("black").text(brokerage.title, 380, doc.page.height - 110);
  doc
    .fillColor("red")
    .text(brokerage.amount, 100, doc.page.height - 110, { align: "right" });

  doc.fillColor("black").text(saudaNetAmt.title, 380, doc.page.height - 90);
  doc
    .fillColor("blue")
    .text(saudaNetAmt.amount, 100, doc.page.height - 90, { align: "right" });

  doc
    .lineWidth(2)
    .moveTo(20, doc.page.height - 50)
    .lineTo(590, doc.page.height - 50)
    .stroke();
};

let totalData = [
  {
    title: "MCX",
    items: [
      {
        name: "Gross",
        amount: "66143 Cr",
      },
      {
        name: "Brok",
        amount: "66143 Dr",
      },
      {
        name: "Net Amt",
        amount: "66143 Cr",
      },
    ],
  },
  {
    title: "NSE",
    items: [
      {
        name: "Gross",
        amount: "66143 Cr",
      },
      {
        name: "Brok",
        amount: "66143 Dr",
      },
      {
        name: "Net Amt",
        amount: "66143 Cr",
      },
    ],
  },
  {
    title: "Options",
    items: [
      {
        name: "Gross",
        amount: "66143 Cr",
      },
      {
        name: "Brok",
        amount: "66143 Dr",
      },
      {
        name: "Net Amt",
        amount: "66143 Cr",
      },
    ],
  },
];

let grandTotal = [
  {
    name: "Gross",
    amount: "332323",
    unit: "Cr",
  },
  {
    name: "Brokrage",
    amount: "332323",
    unit: "Dr",
  },
  {
    name: "Net Amt",
    amount: "332323",
    unit: "Cr",
  },
];

let tableContent = [
  {
    element: "GOLD 05-Apr-2024",
    data: [
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
    ],
  },
  {
    element: "Silver 05-Apr-2024",
    data: [
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
    ],
  },
  {
    element: "Almunium 05-Apr-2024",
    data: [
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
    ],
  },
  {
    element: "Another 05-Apr-2024",
    data: [
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
      [
        "11-03-2024",
        "60",
        "74179",
        "4450740",
        "11-03-2024",
        "60",
        "74179",
        "4450740",
      ],
    ],
  },
];

const setTotal = ({ doc, data, grandTotal }) => {
  doc.lineWidth(2).moveTo(20, 50).lineTo(590, 50).stroke();
  data.forEach((item, index) => {
    if (index === 0) {
      doc.rect(25, 70, 165, 25).fill("#d9d8d4");
      doc.fillColor("black").text(item?.title, 85, 78);
      let tdY = 90;
      item?.items?.forEach((ele, id) => {
        tdY += 25;
        doc.fillColor("black").text(ele?.name, 25, tdY);
        doc.fillColor("black").text(ele?.amount, 140, tdY);
      });
    } else if (index === data.length - 1) {
      doc.rect(225, 70, 165, 25).fill("#d9d8d4");
      doc.fillColor("black").text(item?.title, 270, 78);
      let tdY = 90;
      item?.items?.forEach((ele, id) => {
        tdY += 25;
        doc.fillColor("black").text(ele?.name, 225, tdY);
        doc.fillColor("black").text(ele?.amount, 340, tdY);
      });
    } else {
      doc.rect(420, 70, 165, 25).fill("#d9d8d4");
      doc.fillColor("black").text(item?.title, 460, 78);
      let tdY = 90;
      item?.items?.forEach((ele, id) => {
        tdY += 25;
        doc.fillColor("black").text(ele?.name, 420, tdY);
        doc.fillColor("black").text(ele?.amount, 540, tdY);
      });
    }
  });

  doc.lineWidth(2).moveTo(20, 190).lineTo(590, 190).stroke();

  doc.fillColor("black").fontSize(9).text("E.&.O.E", 20, 250);

  let x = 540;
  let y = 200;

  grandTotal.forEach((item, index) => {
    doc.fillColor("black").text(item?.name, 420, y);
    doc.fillColor("black").text(item?.amount, x, y);
    doc.fillColor("black").text(item?.unit, 580, y);
    y += 20;
  });

  doc.fillColor("black").text("For", 420, 280);
  doc.fillColor("black").fontSize(18).text("Soft", 450, 280);
};

route.get("/", (req, res) => {
  try {
    let doc = new PDFdocument();

    let time = new Date();

    let date = time.getDate();
let sec = time.getSeconds();

    let writeStream = fs.createWriteStream(
      `./assets/pdf-${date+"-"+sec}.pdf`
    );

    doc.pipe(writeStream);

    setHeader({
      doc,
      title1: "SMDR (YG)",
      title2: "Account Statement From 10-03-2024 To 16-03-2024",
    });

    tableContent.forEach((item, index) => {
      for (let i = 0; i < item.data.length - 1; i++) {
        if (i <= 30) {
          setTableHeader({
            doc,
            tab1Text: "Purchase",
            tab2Text: "Sale",
            tab3Text: item.element,
          });
          setTableBody({ doc, data: item.data.slice(0, 30) });
          setTableFooter({
            doc,
            grossAmount: {
              title: "Gross Amount",
              amount: "404242 Cr",
            },
            brokerage: {
              title: "Brokerage",
              amount: "23234 Dr",
            },
            saudaNetAmt: {
              title: "Sauda Net Amt",
              amount: "23233 Cr",
            },
          });
        } else if (i > 30 && i < 60) {
          setTableHeader({
            doc,
            tab1Text: "Purchase",
            tab2Text: "Sale",
            tab3Text: item.element,
          });
          setTableBody({ doc, data: item.data.slice(30, 60) });
          setTableFooter({
            doc,
            grossAmount: {
              title: "Gross Amount",
              amount: "404242 Cr",
            },
            brokerage: {
              title: "Brokerage",
              amount: "23234 Dr",
            },
            saudaNetAmt: {
              title: "Sauda Net Amt",
              amount: "23233 Cr",
            },
          });
        } else if (i > 60 && i < 90) {
          setTableHeader({
            doc,
            tab1Text: "Purchase",
            tab2Text: "Sale",
            tab3Text: item.element,
          });
          setTableBody({ doc, data: item.data.slice(60, 90) });
          setTableFooter({
            doc,
            grossAmount: {
              title: "Gross Amount",
              amount: "404242 Cr",
            },
            brokerage: {
              title: "Brokerage",
              amount: "23234 Dr",
            },
            saudaNetAmt: {
              title: "Sauda Net Amt",
              amount: "23233 Cr",
            },
          });
        } else if (i > 90 && i < 120) {
          setTableHeader({
            doc,
            tab1Text: "Purchase",
            tab2Text: "Sale",
            tab3Text: item.element,
          });
          setTableBody({ doc, data: item.data.slice(90, 120) });
          setTableFooter({
            doc,
            grossAmount: {
              title: "Gross Amount",
              amount: "404242 Cr",
            },
            brokerage: {
              title: "Brokerage",
              amount: "23234 Dr",
            },
            saudaNetAmt: {
              title: "Sauda Net Amt",
              amount: "23233 Cr",
            },
          });
        }
      }
      doc.addPage();
    });

    setTotal({
      doc,
      data: totalData,
      grandTotal: grandTotal,
    });

    doc.end();

    writeStream.on("finish", () => {
      res.json({ message: "PDF saved successfully" });
    });

    writeStream.on("error", (err) => {
      console.error("Error saving PDF:", err);
      res.status(500).json({ error: "Failed to save PDF" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
});


module.exports = route;
