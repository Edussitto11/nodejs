const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Ruta para generar el PDF
app.post('/generate-pdf', (req, res) => {
  const data = req.body; // Datos de la factura

  const doc = new PDFDocument();
  const fileName = `factura_${data["Factura ID"]}.pdf`;
  const filePath = `/tmp/${fileName}`; // Ruta temporal para almacenar el PDF

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Crear contenido del PDF
  doc.fontSize(20).text(`Factura: ${data["Factura ID"]}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Cliente: ${data.Cliente.Nombre}`);
  doc.text(`Dirección: ${data.Cliente.Dirección}`);
  doc.text(`Email: ${data.Cliente.Email}`);
  doc.text(`Teléfono: ${data.Cliente.Teléfono}`);
  doc.moveDown();

  doc.text(`Subtotal: ${data.Subtotal}`);
  doc.text(`Total: ${data.Total}`, { bold: true });
  doc.moveDown();

  // Finalizar el PDF
  doc.end();

  writeStream.on('finish', () => {
    res.sendFile(filePath); // Envía el archivo PDF generado al cliente
  });

  writeStream.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
