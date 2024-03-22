const { Router } = require("express");
const PDFdocument = require("pdfkit");

const route = Router();

function drawTableRow(doc, rowData, startX, startY, isHeader = false) {
  const rowHeight = 30;
  const colWidth = 150;
  const fontSize = 12;

  doc.font("Helvetica").fontSize(fontSize);

  rowData.forEach((cellData, index) => {
    const xPos = startX + index * colWidth;
    const yPos = startY;

    if (isHeader) {
      doc
        .fillColor("black")
        .text(cellData, xPos, yPos, { width: colWidth, align: "center" });
      doc
        .moveTo(xPos, yPos + rowHeight)
        .lineTo(xPos + colWidth, yPos + rowHeight)
        .stroke();
    } else {
      doc
        .fillColor("black")
        .text(cellData, xPos, yPos + 10, { width: colWidth, align: "center" });
      doc
        .moveTo(xPos, yPos)
        .lineTo(xPos + colWidth, yPos)
        .stroke();
    }
  });
}

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
  "Total Unit here",
  "",
  "Total",
  "",
  "Total Unit here",
  "",
  "Total",
];

route.get("/", (req, res) => {
  try {
    let doc = new PDFdocument();

    doc.pipe(res);

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("Soft", 60, 20, { align: "center" });
    doc.lineWidth(2).moveTo(20, 50).lineTo(590, 50).stroke();

    doc.rect(20, 52, 250, 30).fill("gray");
    doc.rect(590 - 250, 52, 250, 30).fill("gray");

    doc.font("Helvetica").fontSize(12).fillColor("black");
    doc.text("Box 1 Text", -350, 61, { align: "center" });
    doc.text("Box 2 Text", 300, 61, { align: "center" });

    doc.rect(20, 100, 270, 30).fill("gray");
    doc.rect(590 - 270, 100, 270, 30).fill("gray");

    doc.font("Helvetica").fontSize(12).fillColor("black");
    doc.text("Box 3 Text", -240, 111, { align: "center" });
    doc.text("Box 4 Text", 360, 111, { align: "center" });

    doc.lineWidth(2).moveTo(20, 161).lineTo(590, 161).stroke();

    let headerPosX = 20;

    let heading = doc.font("Helvetica").fontSize(12).fillColor("black");
    let headingOptions = {
      align: "start",
      link: "http://apple.com/",
      underline: true,
    };

    tableHeaders.forEach((item, index) => {
      if (index === 0) {
        heading.text(item, 20, 141, headingOptions);
      } else if (index === tableHeaders.length - 1) {
        heading.text(item, 540, 141);
      } else {
        heading.text(item, (headerPosX += 75), 141, headingOptions);
      }
    });

    doc.rect(20, 200, 250, 20).fill("gray");

    doc.fill("black").text("Box 1 Text", 25, 205, { align: "start" });

    doc.lineWidth(1).moveTo(20, doc.page.height - 250).lineTo(590,doc.page.height - 250).stroke();

    let footerHeadingPx = 20;

    tablefooter.forEach((item, index) => {
      if (index === 0) {
        heading.text(item, 20, doc.page.height - 245);
      } else if (index === tableHeaders.length - 1) {
        heading.text(item, 540, doc.page.height - 245);
      } else {
        heading.text(item, (footerHeadingPx += 75), doc.page.height - 245);
      }
    });

    doc.lineWidth(2).moveTo(20, doc.page.height - 230).lineTo(590, doc.page.height - 230).stroke();

    doc.lineWidth(1).moveTo(20, doc.page.height - 50).lineTo(590,doc.page.height - 50).stroke();

    heading.text("Gross Amount", 100, doc.page.height - 200, {align:"right"})
    heading.text("Gross Amount", 0, doc.page.height - 180, {align:"right"})
    heading.text("Gross Amount", 0, doc.page.height - 160, {align:"right"})

    // doc.font('Helvetica-Bold').fontSize(24).text('Heading', { align: 'center' });
    // doc.moveDown(); // Move down before drawing the table

    // // Define table properties
    // const table = {
    //   headers: ['Column 1', 'Column 2', 'Column 3'],
    //   rows: [
    //     ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
    //     ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3'],
    //     ['Row 3, Cell 1', 'Row 3, Cell 2', 'Row 3, Cell 3']
    //   ],
    //   rowCount: 3,
    //   columnCount: 3,
    //   startX: 50,
    //   startY: doc.y
    // };

    // // Draw table headers
    // drawTableRow(doc, table.headers, table.startX, table.startY, true);

    // // Draw table rows
    // for (let i = 0; i < table.rowCount; i++) {
    //   drawTableRow(doc, table.rows[i], table.startX, table.startY + (i + 1) * 30);
    // }

    doc.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = route;
