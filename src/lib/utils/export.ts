/**
 * Utility functions for exporting data to CSV and Excel format in the browser.
 */

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: any, row: any) => string;
}

/**
 * Escapes a cell value for CSV output.
 */
function escapeCSVCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Download a file in browser using Blob and <a> tag.
 */
export function downloadFile(content: BlobPart, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export array of objects to CSV format.
 * Adds UTF-8 Byte Order Mark (\uFEFF) so Excel opens UTF-8/Bengali text cleanly.
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns: ExportColumn[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = columns.map(c => escapeCSVCell(c.label)).join(',');

  const rows = data.map(row => {
    return columns.map(c => {
      const rawValue = row[c.key];
      const val = c.formatter ? c.formatter(rawValue, row) : rawValue;
      return escapeCSVCell(val);
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');

  downloadFile(csvContent, filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export array of objects to XML Spreadsheet format (.xls/.xlsx compatible with MS Excel).
 */
export function exportToExcel<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns: ExportColumn[],
  sheetName: string = 'Feedback Data'
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const escapeXML = (str: any) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const headerXML = columns.map(c => `      <Cell><Data ss:Type="String">${escapeXML(c.label)}</Data></Cell>`).join('\n');

  const rowsXML = data.map(row => {
    const cells = columns.map(c => {
      const rawValue = row[c.key];
      const val = c.formatter ? c.formatter(rawValue, row) : rawValue;
      const isNum = typeof val === 'number';
      return `      <Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXML(val)}</Data></Cell>`;
    }).join('\n');
    return `    <Row>\n${cells}\n    </Row>`;
  }).join('\n');

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXML(sheetName)}">
  <Table>
    <Row ss:StyleID="Header">
${headerXML}
    </Row>
${rowsXML}
  </Table>
 </Worksheet>
</Workbook>`;

  const outFilename = filename.endsWith('.xls') || filename.endsWith('.xlsx')
    ? filename
    : `${filename}.xls`;

  downloadFile(xmlString, outFilename, 'application/vnd.ms-excel;charset=utf-8;');
}
