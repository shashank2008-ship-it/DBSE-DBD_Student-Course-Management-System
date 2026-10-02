const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  ShadingType
} = require('docx');

const archImgPath = 'C:/Users/GOTTI SHASHANK/.gemini/antigravity-ide/brain/ca2f05cb-e39c-4bcf-9c2b-e47c7fde88eb/system_architecture_diagram_1790937526520.jpg';
const erImgPath = 'C:/Users/GOTTI SHASHANK/.gemini/antigravity-ide/brain/ca2f05cb-e39c-4bcf-9c2b-e47c7fde88eb/er_diagram_1790937547489.jpg';

const practicalNoteText = "Practical note: use the submitted source files as the authority when checking this section. During a live demonstration, record the input, the response shown by the application, and the resulting database state where relevant. If the observed behavior differs from the description, correct the implementation or update the report before submission.";

function createParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { before: options.before || 120, after: options.after || 120, line: 360 },
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || "000000"
      })
    ]
  });
}

function createHeading(text, level = 1, centered = false) {
  const size = level === 1 ? 32 : (level === 2 ? 28 : 26);
  return new Paragraph({
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 240, after: 180, line: 360 },
    children: [
      new TextRun({
        text: text,
        font: "Times New Roman",
        size: size,
        bold: true,
        color: level === 1 ? "1F2937" : "000000"
      })
    ]
  });
}

function createSubsectionPage(subNumber, title, paragraphs, imagePath = null, table = null) {
  const elements = [];
  
  // Subsection Title
  elements.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 180, line: 360 },
    children: [
      new TextRun({
        text: `${subNumber} ${title}`,
        font: "Times New Roman",
        size: 28, // 14pt
        bold: true,
        color: "000000"
      })
    ]
  }));

  // Body Paragraphs (Rich technical matter)
  for (const p of paragraphs) {
    elements.push(createParagraph(p));
  }

  // Optional Table
  if (table) {
    elements.push(table);
  }

  // Optional Image
  if (imagePath && fs.existsSync(imagePath)) {
    try {
      const imgBuffer = fs.readFileSync(imagePath);
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: {
              width: 580,
              height: 326
            }
          })
        ]
      }));
    } catch (e) {
      console.error('Error inserting image:', e.message);
    }
  }

  // Standard Practical Note
  elements.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 200, after: 120, line: 320 },
    children: [
      new TextRun({
        text: practicalNoteText,
        font: "Times New Roman",
        size: 22, // 11pt
        italics: true,
        color: "4B5563"
      })
    ]
  }));

  // Page break after every subsection (Preserving exact PDF 1-page-per-subsection structure)
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

function createChapterIntro(chapNum, chapTitle, introText) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 360, after: 240, line: 360 },
      children: [
        new TextRun({
          text: `CHAPTER ${chapNum} – ${chapTitle.toUpperCase()}`,
          font: "Times New Roman",
          size: 32, // 16pt
          bold: true,
          color: "000000"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 180, after: 240, line: 360 },
      children: [
        new TextRun({
          text: introText,
          font: "Times New Roman",
          size: 24, // 12pt
          color: "000000"
        })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

console.log('Core generator helper loaded.');
module.exports = {
  createParagraph,
  createHeading,
  createSubsectionPage,
  createChapterIntro,
  archImgPath,
  erImgPath,
  practicalNoteText
};
