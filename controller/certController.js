const html_to_pdf = require("html-pdf-node");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const xlsx = require("xlsx");
const sendCertificate = require("../utility/mailer");

exports.renderLanding = (req, res) => {
  res.render("landing");
};

exports.renderEditor = (req, res) => {
  const { templateId } = req.params;
  res.render("editor", { templateId });
};

exports.generateBulk = async (req, res) => {
  try {
    const { templateId, orgName, description, ownerSignature } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded.");

    // 1. Read CSS for inlining (certificate-only CSS)
    const certificateCss = fs.readFileSync(
      path.join(__dirname, "../public/css/certificate.css"),
      "utf8",
    );

    // 2. Parse Excel
    const workbook = xlsx.readFile(file.path);
    const rawData = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );
    fs.unlinkSync(file.path);

    console.log(`Processing ${rawData.length} entries...`);

    // 3. The One-by-One Loop
    for (let row of rawData) {
      // MAPPING YOUR SPECIFIC COLUMNS
      const name = row.Name || row.name;
      const email = row.Email || row.email;
      const sno = row["Sno."] || row.sno;

      if (!email || !name) {
        console.log(`Skipping SNo ${sno}: Missing name or email.`);
        continue;
      }

      // A. Render the HTML
      const htmlContent = await ejs.renderFile(
        path.join(__dirname, "../views/certificate.ejs"),
        {
          templateId,
          orgName,
          description,
          ownerSignature,
          previewName: name, // Injecting Excel Name
          inlineCSS: certificateCss,
        },
      );

      // B. Generate PDF Buffer
      let options = {
        width: "1000px",
        height: "700px",
        printBackground: true,
        margin: {
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      };

      let pdfFile = { content: htmlContent };
      const pdfBuffer = await html_to_pdf.generatePdf(pdfFile, options);
      // C. Send Mail Immediately
      try {
        await sendCertificate(email, name, pdfBuffer);
        console.log(`✅ Sent to: ${name} (${email})`);
      } catch (mailErr) {
        console.error(`❌ Failed to send to ${email}:`, mailErr.message);
      }
    }

    res.send(
      `<h1>Process Complete</h1><p>Processed ${rawData.length} certificates. Check server logs for delivery status.</p>`,
    );
  } catch (err) {
    console.error("Critical Error:", err);
    res.status(500).send("System Error: " + err.message);
  }
};
