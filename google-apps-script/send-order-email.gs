// Para usar este script:
// 1. Abra Google Apps Script: https://script.google.com/
// 2. Cree un nuevo proyecto.
// 3. Pegue este código en el archivo `Code.gs`.
// 4. Vaya a Implementar > Nueva implementación.
// 5. En "Seleccionar tipo", elija "Aplicación web".
// 6. En el cuadro de diálogo "Nueva implementación":
//    - Descripción: "Bimmer CR Order Handler"
//    - Ejecutar como: "Yo"
//    - Quién tiene acceso: "Cualquier persona" (Esto es importante para que la aplicación web pueda ser llamada desde su sitio)
// 7. Haga clic en "Implementar".
// 8. Copie la "URL de la aplicación web". Deberá pegar esta URL en su archivo .env.local.

const ADMIN_EMAIL = "skrsoftwarecr@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const customerName = data.name || "N/A";
    const customerEmail = data.email || "N/A";
    const orderId = `BMCR-${new Date().getTime()}`;

    const itemsHtml = data.cart.map(item => 
      `<tr>
        <td style="padding: 5px; border: 1px solid #ddd;">${item.name} (x${item.quantity})</td>
        <td style="padding: 5px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
       </tr>`
    ).join('');

    const total = data.cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.13;

    const emailBodyAdmin = `
      <h1 style="color: #007bff;">Nuevo Pedido Recibido #${orderId}</h1>
      <p>Has recibido un nuevo pedido en Bimmer CR.</p>
      <h2>Detalles del Cliente:</h2>
      <ul>
        <li><strong>Nombre:</strong> ${customerName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Teléfono:</strong> ${data.phone || 'N/A'}</li>
        <li><strong>Dirección:</strong> ${data.address || 'N/A'}, ${data.city || ''}, ${data.zip || ''}</li>
      </ul>
      <h2>Detalles del Pedido:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 5px; border: 1px solid #ddd; text-align: left;">Producto</th>
            <th style="padding: 5px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 5px; border: 1px solid #ddd; text-align: right;"><strong>Total (IVA incl.):</strong></td>
            <td style="padding: 5px; border: 1px solid #ddd; text-align: right;"><strong>${formatPrice(total)}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p><strong>Método de Pago:</strong> ${data.paymentMethod}</p>
      <p><em>Este es un correo automático. El comprobante de pago (si aplica) está adjunto.</em></p>
    `;

    const emailBodyCustomer = `
      <h1 style="color: #007bff;">Confirmación de Pedido #${orderId}</h1>
      <p>Hola ${customerName},</p>
      <p>Hemos recibido tu pedido en Bimmer CR. Lo estaremos procesando pronto.</p>
      <h2>Resumen de tu Pedido:</h2>
      <table style="width: 100%; border-collapse: collapse;">
         <thead>
          <tr>
            <th style="padding: 5px; border: 1px solid #ddd; text-align: left;">Producto</th>
            <th style="padding: 5px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 5px; border: 1px solid #ddd; text-align: right;"><strong>Total (IVA incl.):</strong></td>
            <td style="padding: 5px; border: 1px solid #ddd; text-align: right;"><strong>${formatPrice(total)}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p>Gracias por tu compra.</p>
      <p><strong>Bimmer CR</strong></p>
    `;

    let attachments = [];
    if (data.receipt) {
      const { base64, mimeType, fileName } = data.receipt;
      const fileBlob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName);
      attachments.push(fileBlob);
    }
    
    const mailOptionsAdmin = {
      htmlBody: emailBodyAdmin,
      attachments: attachments,
      cc: customerEmail
    };

    // Send email to admin (with CC to customer)
    MailApp.sendEmail(ADMIN_EMAIL, `Nuevo Pedido en Bimmer CR #${orderId}`, "", mailOptionsAdmin);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, orderId: orderId })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to format currency
function formatPrice(price) {
  return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
}
