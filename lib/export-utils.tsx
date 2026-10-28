export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generatePDFReport(data: any, title: string): string {
  // Generate HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #008F72;
          padding-bottom: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        .title {
          flex: 1;
        }
        h1 {
          margin: 0;
          color: #103B3A;
          font-size: 26px;
        }
        .subtitle {
          color: #008F72;
          font-size: 13px;
          margin-top: 5px;
          font-weight: bold;
        }
        .info {
          background: #f4f8f5;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #dce7e1;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }
        .label {
          font-weight: bold;
          color: #253533;
        }
        .value {
          color: #333;
          font-family: monospace;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #dce7e1;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #008F72;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #647773;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">
          <h1>Laboratorio Ambiental</h1>
          <div class="subtitle">by GREEN OWL LABS — La ciencia ambiental, en tu bolsillo</div>
        </div>
      </div>
      
      <h2>${title}</h2>
      
      <div class="info">
        <div class="info-row">
          <span class="label">Fecha de generación:</span>
          <span class="value">${new Date().toLocaleString("es-ES")}</span>
        </div>
        <div class="info-row">
          <span class="label">Tipo de reporte:</span>
          <span class="value">${data.type || "Análisis Ambiental"}</span>
        </div>
      </div>
      
      ${generateDataTable(data)}
      
      <div class="footer">
        <p>Generado por Laboratorio Ambiental by GREEN OWL LABS — Plataforma Profesional</p>
        <p>Este reporte es confidencial y está destinado únicamente para uso profesional</p>
      </div>
    </body>
    </html>
  `

  return htmlContent
}

function generateDataTable(data: any): string {
  if (Array.isArray(data.calculations) && data.calculations.length > 0) {
    const headers = Object.keys(data.calculations[0].inputs || {})
    return `
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            ${headers.map((h) => `<th>${h}</th>`).join("")}
            <th>Resultado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${data.calculations
            .map(
              (calc: any) => `
            <tr>
              <td><strong>${calc.type}</strong></td>
              ${headers.map((h) => `<td>${calc.inputs[h] || "-"}</td>`).join("")}
              <td><strong>${calc.result}</strong></td>
              <td>${new Date(calc.timestamp).toLocaleString("es-ES")}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
  }

  if (data.results) {
    return `
      <table>
        <thead>
          <tr>
            <th>Parámetro</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data.results)
            .map(
              ([key, value]) => `
            <tr>
              <td>${key}</td>
              <td><strong>${value}</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
  }

  return "<p>No hay datos disponibles para mostrar</p>"
}

export function printReport(htmlContent: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

export function shareReport(data: any, title: string) {
  const text = `${title}\n\nGenerado por Laboratorio Ambiental by GREEN OWL LABS\n${new Date().toLocaleString("es-ES")}`

  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: text,
        url: window.location.href,
      })
      .catch((error) => console.log("Error al compartir:", error))
  } else {
    navigator.clipboard.writeText(`${text}\n${window.location.href}`)
    alert("Enlace copiado al portapapeles")
  }
}
