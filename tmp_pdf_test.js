const PDFDocument = require('./backend/node_modules/pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'LETTER', margins: { top: 30, bottom: 50, left: 50, right: 50 } });
const stream = fs.createWriteStream('tmp_transcript.pdf');
doc.pipe(stream);

let currentPage = 1;
const totalPages = 4;
const addHeader = () => {
  doc.fontSize(7).fillColor('black').text('Header text', 50, 25);
  doc.text(`Page ${currentPage} of ${totalPages}`, 510, 25);
};
const addWatermark = () => {
  const watermarkY = doc.page.height - doc.page.margins.bottom - 20;
  doc
    .fontSize(7)
    .fillColor('gray')
    .text(
      'Unofficial Copy. NOT to be used as certificate of academic results. Grades may be subject to amendment.',
      50,
      watermarkY,
      { align: 'center', width: doc.page.width - 100 }
    );
  doc.fillColor('black');
};

addHeader();
addWatermark();

doc.fontSize(10).text('Name: TEST STUDENT', 50, 65);
doc.text('Student ID: 123456', 50, 80);

let currentY = 140;
for (let p = 0; p < 5; p++) {
  if (currentY > 700) {
    doc.addPage();
    currentPage++;
    addHeader();
    addWatermark();
    currentY = 65;
  }
  doc.fontSize(11).text(`Term ${p + 1}`, 50, currentY);
  currentY += 20;
  doc.fontSize(9);
  for (let c = 0; c < 10; c++) {
    if (currentY > 710) {
      doc.addPage();
      currentPage++;
      addHeader();
      addWatermark();
      currentY = 65;
    }
    doc.text(`CSC${p}${c}`, 50, currentY);
    doc.text(`Course ${c}`, 130, currentY);
    doc.text('3.0', 425, currentY, { width: 30, align: 'right' });
    doc.text('A', 472, currentY, { width: 30, align: 'center' });
    currentY += 15;
  }
  currentY += 40;
}

doc.end();
stream.on('finish', () => console.log('PDF created'));
