// import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType
//     , TextRun, BorderStyle, Table, TableCell , TableRow} from "docx";

// export class DocumentCreator {


//   public create(): Document {
//     const document = new Document();

//     let content = '';
//     const heading = new Paragraph({
//                     text: "Jugal Rana",
//                     heading: HeadingLevel.TITLE,
//                 });

//     const contactInfo = this.createContactInfo('+98182328X', 'https://www.eduforbetterment.com', 'info@eduforbetterment.com');

//     const headingedu =  this.createHeading("Education");

//     const educationtext = this.educationtext();


//   document.addSection({ children: [heading,contactInfo,headingedu,educationtext] });

//   return document;

//   }


// public createContactInfo(phoneNumber: string, profileUrl: string, email: string): Paragraph {
//         return new Paragraph({
//             alignment: AlignmentType.CENTER,
//             children: [
//                 new TextRun(`Mobile: ${phoneNumber} | Website URL: ${profileUrl} | Email: ${email}`),
//                 new TextRun("").break(),
//             ],
//         });
//     }

//    public createHeading(text: string): Paragraph {
//         return new Paragraph({
//             text: text,
//             heading: HeadingLevel.HEADING_1,
//             thematicBreak: true,
//         });
//     }

//     public educationtext(): Paragraph{

//        return new Paragraph({
//             text: "B.E. IT - 2005 to 2009",
            
//         });

//     }

// }