using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace RemesasJJWebAPP.Controllers
{
    public class EmailsController : Controller
    {
        Remesa remex = new Remesa();
        Bancos bancos = new Bancos();
        Change change = new Change();
        RemesasJJ.Logics.SendGrid sendMail = new RemesasJJ.Logics.SendGrid();
        // GET: Emails
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> SendMailService(string subjectx, string fromF, string key, string fromName, string toF, string toName, string content)
        {

            var existe = remex.context.sendgrid.Where(x => x.usuarioEmail == fromF && x.key == key);

            if (existe==null || existe.Count() == 0)
            {
                return Json(new { error = true, message = "No Autorizado - Usuario o Clave Erronea", response = false });

            }

            //StreamReader reader = new StreamReader("~/Content/m.txt");
            var apiKey = sendMail.GetKey();
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromF, fromName);

            var subject = subjectx;
            var to = new EmailAddress(toF, toName);
            var htmlContent = content;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", content);
            var response = await client.SendEmailAsync(msg);

            return Json(new { error= response.StatusCode == System.Net.HttpStatusCode.Accepted ? false : true, message = "Correo enviado", response = response.StatusCode ==System.Net.HttpStatusCode.Accepted ? "Aceptado":"Error"});

        }
    }
}