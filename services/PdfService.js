const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateCrimeReportPDF = (crimeData, outputFilePath) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(fs.createWriteStream(outputFilePath));

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Crime Registration Details', { align: 'center' });
    doc.moveDown(0.5);

    // Line separator
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();
    doc.moveDown(1);

    // Crime Info Section
    doc.fontSize(14).font('Helvetica').text(`Crime Number: ${crimeData.crimeNumber}`, { continued: true });
    doc.text(` (अपराध संख्या: ${crimeData.crimeNumber})`);
    doc.moveDown();
    
    doc.text(`Aadhar Number: ${crimeData.aadharNumber}`, { continued: true });
    doc.text(` (आधार संख्या: ${crimeData.aadharNumber})`);
    doc.moveDown();

    doc.text(`Crime Type: ${crimeData.crimeType}`, { continued: true });
    doc.text(` (अपराध प्रकार: ${crimeData.crimeType})`);
    doc.moveDown();

    doc.text(`Crime Date: ${new Date(crimeData.crimeDate).toLocaleDateString()}`, { continued: true });
    doc.text(` (अपराध की तारीख: ${new Date(crimeData.crimeDate).toLocaleDateString()})`);
    doc.moveDown();

    // Parties Section
    doc.fontSize(16).font('Helvetica-Bold').text('Party 1:', { underline: true });
    doc.fontSize(12).font('Helvetica').text(`Name: ${crimeData.firstName} ${crimeData.middleName ? crimeData.middleName + ' ' : ''}${crimeData.lastName}`, { continued: true });
    doc.text(` (नाम: ${crimeData.firstName} ${crimeData.middleName ? crimeData.middleName + ' ' : ''}${crimeData.lastName})`);
    doc.moveDown();

    // Add Father's Name (assuming it's part of crimeData)
    doc.fontSize(12).text(`Father's Name: ${crimeData.fatherName || 'N/A'}`, { continued: true });
    doc.text(` (पिता का नाम: ${crimeData.fatherName || 'उपलब्ध नहीं'})`);
    doc.moveDown();

    // If Party 2 is present, add details for Party 2
    if (crimeData.party2) {
        doc.fontSize(16).font('Helvetica-Bold').text('Party 2:', { underline: true });
        doc.fontSize(12).font('Helvetica').text(`Name: ${crimeData.party2.firstName} ${crimeData.party2.middleName ? crimeData.party2.middleName + ' ' : ''}${crimeData.party2.lastName}`, { continued: true });
        doc.text(` (नाम: ${crimeData.party2.firstName} ${crimeData.party2.middleName ? crimeData.party2.middleName + ' ' : ''}${crimeData.party2.lastName})`);
        doc.moveDown();
        
        // Add Party 2 Father's Name
        doc.fontSize(12).text(`Father's Name: ${crimeData.party2.fatherName || 'N/A'}`, { continued: true });
        doc.text(` (पिता का नाम: ${crimeData.party2.fatherName || 'उपलब्ध नहीं'})`);
        doc.moveDown();
    }

    // Crime Details Section
    doc.fontSize(14).font('Helvetica-Bold').text('Crime Details:', { underline: true });
    doc.fontSize(12).font('Helvetica').text(`District: ${crimeData.district}`, { continued: true });
    doc.text(` (जिला: ${crimeData.district})`);
    doc.moveDown();
    
    doc.text(`Tehsil: ${crimeData.tehsil}`, { continued: true });
    doc.text(` (तहसील: ${crimeData.tehsil})`);
    doc.moveDown();
    
    doc.text(`Police Station: ${crimeData.policeStation}`, { continued: true });
    doc.text(` (पुलिस स्टेशन: ${crimeData.policeStation})`);
    doc.moveDown();

    doc.text(`Description: ${crimeData.description}`, { continued: true });
    doc.text(` (विवरण: ${crimeData.description})`);
    
    // Finalize PDF file
    doc.end();
};

module.exports = { generateCrimeReportPDF };
