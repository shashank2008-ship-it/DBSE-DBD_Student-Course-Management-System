const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  AlignmentType
} = require('docx');

const { getFrontMatter, getChapter1, getChapter2, getChapter3, getChapter4 } = require('./chapters_1_to_4');
const { getChapter5, getChapter6, getChapter7 } = require('./chapters_5_to_7');
const { getChapter8, getChapter9, getChapter10, getChapter11 } = require('./chapters_8_to_11');
const { getChapter12, getChapter13, getChapter14 } = require('./chapters_12_to_14');

async function generateFullReport() {
  console.log('Generating complete project report...');

  const frontMatter = getFrontMatter();
  const ch1 = getChapter1();
  const ch2 = getChapter2();
  const ch3 = getChapter3();
  const ch4 = getChapter4();
  const ch5 = getChapter5();
  const ch6 = getChapter6();
  const ch7 = getChapter7();
  const ch8 = getChapter8();
  const ch9 = getChapter9();
  const ch10 = getChapter10();
  const ch11 = getChapter11();
  const ch12 = getChapter12();
  const ch13 = getChapter13();
  const ch14 = getChapter14();

  const allElements = [
    ...frontMatter,
    ...ch1,
    ...ch2,
    ...ch3,
    ...ch4,
    ...ch5,
    ...ch6,
    ...ch7,
    ...ch8,
    ...ch9,
    ...ch10,
    ...ch11,
    ...ch12,
    ...ch13,
    ...ch14
  ];

  console.log(`Total assembled elements: ${allElements.length}`);

  const doc = new Document({
    creator: "K L Deemed to be University",
    title: "Student Course Enrollment and Distributed Academic Management System",
    description: "Official B.Tech Project Documentation Report (DBSE & DBD)",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            },
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: "Student Course Enrollment and Distributed Academic Management System",
                    font: "Times New Roman",
                    size: 18,
                    color: "6B7280",
                    italics: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120 },
                children: [
                  new TextRun({
                    text: "K L (Deemed to be) University — Dept. of CSE & CSIT  |  Page ",
                    font: "Times New Roman",
                    size: 18,
                    color: "6B7280"
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 18,
                    bold: true,
                    color: "1F2937"
                  })
                ]
              })
            ]
          })
        },
        children: allElements
      }
    ]
  });

  const outputPath = path.resolve(__dirname, '..', 'Student_Course_Enrollment_Documentation.docx');
  console.log(`Compiling DOCX to ${outputPath}...`);

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`SUCCESS! Generated ${outputPath} (${buffer.length} bytes)`);
}

generateFullReport().catch(err => {
  console.error('Error generating documentation:', err);
  process.exit(1);
});
