/**
 * @fileOverview Código para pegar en Google Apps Script (script.google.com).
 * Permite recibir peticiones POST desde la aplicación Next.js y enviar correos.
 */

function doPost(e) {
  try {
    // 1. Parsear los datos recibidos
    var data = JSON.parse(e.postData.contents);
    
    // 2. Enviar el correo electrónico
    // El objeto data debe contener: to, subject, html
    MailApp.sendEmail({
      to: data.to,
      subject: data.subject,
      htmlBody: data.html
    });
    
    // 3. Retornar respuesta de éxito
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "success",
      "timestamp": new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 4. Retornar respuesta de error en caso de fallo
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "error", 
      "error": error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * FUNCIÓN PARA ACTIVAR PERMISOS
 * Selecciona esta función en el editor de Google Apps Script y haz clic en "Ejecutar".
 * Esto forzará la aparición de la ventana de autorización de Google.
 */
function testPermissions() {
  var myEmail = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: myEmail,
    subject: "Prueba de Permisos ZB Propiedades",
    htmlBody: "<h1>Permisos Activos</h1><p>Si recibiste esto, el script ya tiene permiso para enviar correos en tu nombre.</p>"
  });
  Logger.log("Correo de prueba enviado a: " + myEmail);
}
