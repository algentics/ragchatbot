import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType } from "docx"
import { jsPDF } from "jspdf"
import type { Message } from "@/types/chat"
import { marked } from "marked"

// Helper function to convert markdown to plain text with basic formatting
function markdownToPlainText(markdown: string): string {
  return marked(markdown, { mangle: false, headerIds: false })
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/\n\n/g, "\n") // Normalize line breaks
}

// Helper function to extract citations from content
function extractCitations(content: string, citations: Message["citations"]): string {
  if (!citations) return content

  let processedContent = content
  citations.forEach((citation, index) => {
    const citationMark = `[${index + 1}]`
    processedContent = processedContent.replace(citationMark, `[${index + 1}: ${citation.document.title}]`)
  })
  return processedContent
}

export async function exportToPDF(message: Message): Promise<Blob> {
  const doc = new jsPDF()

  // Configure PDF
  doc.setFont("helvetica")

  // Add title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("RAG Chatbot Response", 20, 20)

  // Add timestamp
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30)

  // Process content with citations
  const processedContent = extractCitations(message.content, message.citations)

  // Convert markdown to formatted text
  const plainText = markdownToPlainText(processedContent)

  // Add content with proper formatting
  doc.setFontSize(12)
  const splitText = doc.splitTextToSize(plainText, 170)
  let yPosition = 40

  splitText.forEach((line: string) => {
    // Check if we need a new page
    if (yPosition > 280) {
      doc.addPage()
      yPosition = 20
    }

    // Handle headers
    if (line.startsWith("#")) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
    } else {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
    }

    doc.text(line, 20, yPosition)
    yPosition += 7
  })

  // Add citations section if there are citations
  if (message.citations && message.citations.length > 0) {
    // Add a new page if we're close to the bottom
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Citations", 20, yPosition + 10)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    message.citations.forEach((citation, index) => {
      yPosition += 20
      doc.text(`[${index + 1}] ${citation.document.title} - ${citation.text}`, 20, yPosition, { maxWidth: 170 })
    })
  }

  return doc.output("blob")
}

export async function exportToDOCX(message: Message): Promise<Blob> {
  // Process content with citations
  const processedContent = extractCitations(message.content, message.citations)

  // Parse markdown content
  const tokens = marked.lexer(processedContent)

  // Convert markdown tokens to DOCX elements
  const children: any[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "RAG Chatbot Response",
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date().toLocaleString()}`,
          size: 20,
          break: 1,
        }),
      ],
    }),
  ]

  // Convert markdown tokens to DOCX elements
  tokens.forEach((token: any) => {
    switch (token.type) {
      case "heading":
        children.push(
          new Paragraph({
            children: [new TextRun({ text: token.text, bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1 + token.depth,
          }),
        )
        break

      case "paragraph":
        children.push(
          new Paragraph({
            children: [new TextRun({ text: token.text, size: 24 })],
          }),
        )
        break

      case "list":
        token.items.forEach((item: any, index: number) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `${index + 1}. ${item.text}`, size: 24 })],
              bullet: { level: 0 },
            }),
          )
        })
        break

      case "table":
        const table = new Table({
          rows: [
            new TableRow({
              children: token.header.map(
                (cell: string) =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: cell, bold: true })] })],
                  }),
              ),
            }),
            ...token.rows.map(
              (row: string[]) =>
                new TableRow({
                  children: row.map(
                    (cell: string) =>
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: cell })] })],
                      }),
                  ),
                }),
            ),
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        })
        children.push(table)
        break
    }
  })

  // Add citations if they exist
  if (message.citations && message.citations.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Citations",
            bold: true,
            size: 28,
            break: 2,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
      }),
    )

    message.citations.forEach((citation, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[${index + 1}] ${citation.document.title} - ${citation.text}`,
              size: 24,
            }),
          ],
        }),
      )
    })
  }

  const doc = new Document({
    sections: [{ children }],
  })

  return await Packer.toBlob(doc)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

