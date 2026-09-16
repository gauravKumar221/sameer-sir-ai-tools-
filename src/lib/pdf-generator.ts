import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface GuidePdfContent {
  title: string;
  category: string;
  author: string;
  pages: {
    heading: string;
    subheading?: string;
    content: string[];
    codeSnippet?: string[];
    takeaways?: string[];
  }[];
}

export async function createDemoCoursePdf(guideContent: GuidePdfContent): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  // 1. Cover Page
  const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Background gradient-style bar
  coverPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 220,
    width: PAGE_WIDTH,
    height: 220,
    color: rgb(0.12, 0.22, 0.65), // Brand Indigo
  });

  coverPage.drawRectangle({
    x: 40,
    y: PAGE_HEIGHT - 260,
    width: 120,
    height: 28,
    color: rgb(0.96, 0.62, 0.05), // Accent gold
  });

  coverPage.drawText(guideContent.category.toUpperCase(), {
    x: 50,
    y: PAGE_HEIGHT - 243,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText(guideContent.title, {
    x: 40,
    y: PAGE_HEIGHT - 130,
    size: 26,
    font: fontBold,
    color: rgb(1, 1, 1),
    maxWidth: PAGE_WIDTH - 80,
    lineHeight: 32,
  });

  coverPage.drawText(`Comprehensive Developer Masterclass & Practical Guide`, {
    x: 40,
    y: PAGE_HEIGHT - 175,
    size: 13,
    font: fontRegular,
    color: rgb(0.85, 0.9, 1),
  });

  coverPage.drawText(`Author / Publisher: ${guideContent.author}`, {
    x: 40,
    y: 120,
    size: 12,
    font: fontBold,
    color: rgb(0.2, 0.25, 0.35),
  });

  coverPage.drawText(`© LearnForge Education Platform • View-Only Licensed Digital Edition`, {
    x: 40,
    y: 80,
    size: 10,
    font: fontRegular,
    color: rgb(0.5, 0.55, 0.65),
  });

  // 2. Chapter / Content Pages
  for (let i = 0; i < guideContent.pages.length; i++) {
    const pageData = guideContent.pages[i];
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Header
    page.drawRectangle({
      x: 40,
      y: PAGE_HEIGHT - 45,
      width: PAGE_WIDTH - 80,
      height: 1,
      color: rgb(0.85, 0.88, 0.92),
    });

    page.drawText(guideContent.title, {
      x: 40,
      y: PAGE_HEIGHT - 38,
      size: 9,
      font: fontRegular,
      color: rgb(0.45, 0.5, 0.6),
    });

    page.drawText(`Page ${i + 2} of ${guideContent.pages.length + 1}`, {
      x: PAGE_WIDTH - 120,
      y: PAGE_HEIGHT - 38,
      size: 9,
      font: fontRegular,
      color: rgb(0.45, 0.5, 0.6),
    });

    // Heading
    let currentY = PAGE_HEIGHT - 90;
    
    page.drawText(`Chapter ${i + 1}: ${pageData.heading}`, {
      x: 40,
      y: currentY,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.3),
    });

    currentY -= 20;

    if (pageData.subheading) {
      page.drawText(pageData.subheading, {
        x: 40,
        y: currentY,
        size: 12,
        font: fontRegular,
        color: rgb(0.35, 0.4, 0.5),
      });
      currentY -= 30;
    } else {
      currentY -= 15;
    }

    // Paragraphs
    for (const p of pageData.content) {
      page.drawText(p, {
        x: 40,
        y: currentY,
        size: 10.5,
        font: fontRegular,
        color: rgb(0.2, 0.22, 0.28),
        maxWidth: PAGE_WIDTH - 80,
        lineHeight: 16,
      });
      // Estimate height based on length
      const lines = Math.ceil(p.length / 75);
      currentY -= lines * 16 + 12;
    }

    // Code Snippet Box (if any)
    if (pageData.codeSnippet && pageData.codeSnippet.length > 0) {
      const codeBoxHeight = pageData.codeSnippet.length * 15 + 20;
      
      page.drawRectangle({
        x: 40,
        y: currentY - codeBoxHeight + 10,
        width: PAGE_WIDTH - 80,
        height: codeBoxHeight,
        color: rgb(0.08, 0.1, 0.16),
      });

      let codeY = currentY - 10;
      for (const codeLine of pageData.codeSnippet) {
        page.drawText(codeLine, {
          x: 55,
          y: codeY,
          size: 9.5,
          font: fontMono,
          color: rgb(0.55, 0.85, 0.6),
        });
        codeY -= 15;
      }

      currentY -= codeBoxHeight + 15;
    }

    // Key Takeaways Box (if any)
    if (pageData.takeaways && pageData.takeaways.length > 0) {
      const boxHeight = pageData.takeaways.length * 16 + 30;
      
      page.drawRectangle({
        x: 40,
        y: currentY - boxHeight + 10,
        width: PAGE_WIDTH - 80,
        height: boxHeight,
        color: rgb(0.94, 0.97, 1),
        borderColor: rgb(0.3, 0.5, 0.9),
        borderWidth: 1,
      });

      page.drawText('Key Takeaways & Best Practices:', {
        x: 55,
        y: currentY - 8,
        size: 10.5,
        font: fontBold,
        color: rgb(0.15, 0.3, 0.7),
      });

      let itemY = currentY - 26;
      for (const item of pageData.takeaways) {
        page.drawText(`• ${item}`, {
          x: 55,
          y: itemY,
          size: 9.5,
          font: fontRegular,
          color: rgb(0.15, 0.2, 0.3),
          maxWidth: PAGE_WIDTH - 110,
        });
        itemY -= 16;
      }
    }

    // Footer
    page.drawText(`Confidential Licensed Course Material • Proprietary Digital Access`, {
      x: 40,
      y: 35,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.6, 0.65, 0.7),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
